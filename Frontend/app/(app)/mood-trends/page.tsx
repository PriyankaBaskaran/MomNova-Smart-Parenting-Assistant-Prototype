"use client"

import { useState, useMemo, useEffect } from "react"
import { format, subDays, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartTooltip } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer } from "recharts"
import { ArrowLeft, CalendarIcon, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ChevronRight, Sparkles, Shield } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { journalService, mentalHealthService } from "@/lib/api-services"
import { useBaby } from "@/contexts/baby-context"
import { Spinner } from "@/components/ui/spinner"
import type { JournalEntry, MentalHealthAssessment } from "@/lib/types"

type DateRangePreset = "7" | "30" | "90" | "custom"

interface ChartDataPoint {
  date: string
  displayDate: string
  fullDate: string
  score: number
  hasJournalEntry: boolean
  mood: string
  journalPreview?: string
  journalId?: string
}

export default function MoodTrendsPage() {
  const { selectedBaby } = useBaby()
  const [dateRange, setDateRange] = useState<DateRangePreset>("7")
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [assessment, setAssessment] = useState<MentalHealthAssessment | null>(null)

  // Fetch journal entries and mental health assessment
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBaby?.id) {
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      try {
        // Calculate date range based on selected filter
        let startDate: Date
        const endDate = new Date()
        
        if (dateRange === "custom" && customDateRange?.from) {
          startDate = customDateRange.from
        } else {
          const days = parseInt(dateRange)
          startDate = subDays(endDate, days)
        }
        
        // Fetch journal entries and assessment in parallel
        const [entries, assessmentData] = await Promise.all([
          journalService.getAll(startDate.toISOString(), endDate.toISOString()),
          mentalHealthService.getAssessment(parseInt(dateRange) || 7).catch(() => null)
        ])
        setJournalEntries(entries)
        setAssessment(assessmentData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedBaby?.id, dateRange, customDateRange])

  // Convert journal entries to chart data
  const chartData = useMemo(() => {
    const dataMap = new Map<string, ChartDataPoint>()
    
    journalEntries.forEach((entry) => {
      const date = parseISO(entry.createdAt)
      const dateKey = format(date, "yyyy-MM-dd")
      
      const scores = entry.sentimentScores
      const sentimentScore = scores.positive - scores.negative
      const normalizedScore = (sentimentScore + 1) / 2
      const finalScore = Math.max(0, Math.min(1, parseFloat(normalizedScore.toFixed(2))))
      
      dataMap.set(dateKey, {
        date: dateKey,
        displayDate: format(date, "MMM d"),
        fullDate: format(date, "EEEE, MMMM d, yyyy"),
        score: finalScore,
        hasJournalEntry: true,
        mood: entry.sentiment,
        journalPreview: entry.content.substring(0, 100),
        journalId: entry.id,
      })
    })
    
    return Array.from(dataMap.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [journalEntries])

  const stats = useMemo(() => {
    if (chartData.length === 0) return { average: 0, trend: "stable", concerningPattern: false, consecutiveNegative: 0 }
    
    const average = chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length
    
    const halfLength = Math.floor(chartData.length / 2)
    if (halfLength === 0) {
      return { average, trend: "stable", concerningPattern: false, consecutiveNegative: 0 }
    }
    
    const firstHalf = chartData.slice(0, halfLength)
    const secondHalf = chartData.slice(halfLength)
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.score, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.score, 0) / secondHalf.length
    const trend = secondAvg > firstAvg + 0.05 ? "improving" : secondAvg < firstAvg - 0.05 ? "declining" : "stable"
    
    let maxConsecutive = 0
    let currentConsecutive = 0
    for (const item of chartData) {
      if (item.score < 0.4) {
        currentConsecutive++
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
      } else {
        currentConsecutive = 0
      }
    }
    
    return {
      average,
      trend,
      concerningPattern: maxConsecutive >= 3,
      consecutiveNegative: maxConsecutive,
    }
  }, [chartData])

  const getMoodEmoji = (score: number) => {
    if (score > 0.7) return { emoji: "😊", label: "Great", color: "text-green-600" }
    if (score > 0.5) return { emoji: "🙂", label: "Good", color: "text-green-500" }
    if (score > 0.4) return { emoji: "😐", label: "Okay", color: "text-yellow-600" }
    if (score > 0.25) return { emoji: "😔", label: "Low", color: "text-orange-600" }
    return { emoji: "😢", label: "Difficult", color: "text-red-600" }
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setCustomDateRange(range)
    if (range?.from && range?.to) {
      setDateRange("custom")
      setIsCalendarOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (!selectedBaby) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Please select a baby profile to view mood trends</p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Back to dashboard</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Your Mood Journey</h1>
              <p className="text-sm text-muted-foreground">Understanding your emotional patterns</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Date Range Selector */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Time Period:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "7", label: "7 Days" },
                  { value: "30", label: "30 Days" },
                  { value: "90", label: "90 Days" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={dateRange === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange(option.value as DateRangePreset)}
                    className="min-w-[80px]"
                  >
                    {option.label}
                  </Button>
                ))}
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={dateRange === "custom" ? "default" : "outline"}
                      size="sm"
                      className="min-w-[120px]"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateRange === "custom" && customDateRange?.from && customDateRange?.to
                        ? `${format(customDateRange.from, "MMM d")} - ${format(customDateRange.to, "MMM d")}`
                        : "Custom"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={customDateRange?.from}
                      selected={customDateRange}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Sentiment</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-foreground">
                    {Math.round(stats.average * 100)}%
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-medium",
                      stats.average > 0.6 ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30" :
                      stats.average > 0.4 ? "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30" :
                      "border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30"
                    )}
                  >
                    {stats.average > 0.6 ? "Positive" : stats.average > 0.4 ? "Neutral" : "Negative"}
                  </Badge>
                </div>
                <div className="text-3xl">{getMoodEmoji(stats.average).emoji}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Trend Direction</p>
                <div className="flex items-center gap-2">
                  {stats.trend === "improving" ? (
                    <>
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <span className="text-xl font-semibold text-green-600">Improving</span>
                    </>
                  ) : stats.trend === "declining" ? (
                    <>
                      <TrendingDown className="w-6 h-6 text-red-600" />
                      <span className="text-xl font-semibold text-red-600">Declining</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-1 bg-yellow-600 rounded" />
                      <span className="text-xl font-semibold text-yellow-600">Stable</span>
                    </>
                  )}
                </div>
                <div className="text-3xl">
                  {stats.trend === "improving" ? "📈" : stats.trend === "declining" ? "📉" : "➡️"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Concerning Pattern</p>
                <div className="flex items-center gap-2">
                  {stats.concerningPattern ? (
                    <>
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <span className="text-xl font-semibold text-red-600">Yes</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-xl font-semibold text-green-600">No</span>
                    </>
                  )}
                </div>
                <div className="text-3xl">
                  {stats.concerningPattern ? "⚠️" : "✅"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood Wave Journey Chart */}
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Mood Wave Journey
            </CardTitle>
            <CardDescription className="text-base">
              Your emotional journey visualized as a flowing wave
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="mb-2">No journal entries yet</p>
                  <Link href="/journal">
                    <Button variant="outline" size="sm">Start Journaling</Button>
                  </Link>
                </div>
              </div>
            ) : chartData.length === 1 ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">{getMoodEmoji(chartData[0].score).emoji}</div>
                <p className="text-lg font-semibold mb-2">{chartData[0].fullDate}</p>
                <p className={cn("text-xl font-bold mb-4", getMoodEmoji(chartData[0].score).color)}>
                  {getMoodEmoji(chartData[0].score).label}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  You need at least 2 journal entries to see the mood trend line
                </p>
                <Link href="/journal">
                  <Button variant="outline" size="sm">Add Another Entry</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                          <stop offset="50%" stopColor="#eab308" stopOpacity={1} />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                      <XAxis 
                        dataKey="displayDate" 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        dy={10}
                      />
                      <YAxis 
                        domain={[0, 1]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        ticks={[0, 0.25, 0.5, 0.75, 1]}
                        tickFormatter={(value) => {
                          if (value === 1) return "100%"
                          if (value === 0.75) return "75%"
                          if (value === 0.5) return "50%"
                          if (value === 0.25) return "25%"
                          return "0%"
                        }}
                        width={60}
                      />
                      <ReferenceLine 
                        y={0.6} 
                        stroke="#22c55e" 
                        strokeDasharray="5 5" 
                        strokeOpacity={0.6}
                        label={{ 
                          value: 'Positive threshold (60%)', 
                          position: 'insideTopRight', 
                          fill: '#22c55e', 
                          fontSize: 11,
                          offset: 10
                        }}
                      />
                      <ReferenceLine 
                        y={0.4} 
                        stroke="#ef4444" 
                        strokeDasharray="5 5" 
                        strokeOpacity={0.6}
                        label={{ 
                          value: 'Negative threshold (40%)', 
                          position: 'insideBottomRight', 
                          fill: '#ef4444', 
                          fontSize: 11,
                          offset: 10
                        }}
                      />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload
                            const mood = getMoodEmoji(data.score)
                            return (
                              <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-4xl">{mood.emoji}</span>
                                  <div>
                                    <p className={cn("font-bold text-lg", mood.color)}>{mood.label}</p>
                                    <p className="text-xs text-muted-foreground">{Math.round(data.score * 100)}%</p>
                                  </div>
                                </div>
                                <p className="text-sm font-medium mb-1">{data.fullDate}</p>
                                {data.journalPreview && (
                                  <p className="text-xs text-muted-foreground max-w-[250px] line-clamp-2 mt-2 italic">
                                    "{data.journalPreview}..."
                                  </p>
                                )}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="url(#colorGradient)"
                        strokeWidth={4}
                        dot={(props) => {
                          const { cx, cy, payload } = props
                          const mood = getMoodEmoji(payload.score)
                          return (
                            <g>
                              <circle cx={cx} cy={cy} r={8} fill="#000" opacity={0.1} />
                              <circle cx={cx} cy={cy} r={6} fill="#fff" stroke="url(#colorGradient)" strokeWidth={3} />
                              <text 
                                x={cx} 
                                y={cy - 20} 
                                textAnchor="middle" 
                                fontSize={20}
                              >
                                {mood.emoji}
                              </text>
                            </g>
                          )
                        }}
                        activeDot={{ 
                          r: 8,
                          fill: "#fff",
                          stroke: "url(#colorGradient)",
                          strokeWidth: 4
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 rounded" style={{ background: 'linear-gradient(to right, #22c55e, #eab308, #ef4444)' }} />
                    <span className="text-muted-foreground">Mood gradient</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-green-500 opacity-60" style={{ borderTop: '2px dashed #22c55e' }} />
                    <span className="text-muted-foreground">Positive threshold (60%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-red-500 opacity-60" style={{ borderTop: '2px dashed #ef4444' }} />
                    <span className="text-muted-foreground">Negative threshold (40%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🟢</span>
                    <span className="text-muted-foreground">Journal entry</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Mental Health Insights */}
        {assessment && (
          <>
            {/* Risk Factors */}
            {assessment.concerningPatterns && assessment.concerningPatterns.length > 0 && (
              <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground">Things to Watch</CardTitle>
                        <CardDescription>Patterns that need your attention</CardDescription>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-base px-3 py-1">
                      {assessment.concerningPatterns.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assessment.concerningPatterns.map((pattern: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-red-950/30 border-l-4 border-red-500 hover:shadow-md transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{pattern}</p>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                    <Link href="/assessment">
                      <Button className="w-full" variant="outline">
                        View Full Assessment
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Strengths */}
            {assessment.positiveIndicators && assessment.positiveIndicators.length > 0 && (
              <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground">Your Strengths</CardTitle>
                        <CardDescription>Positive things you're doing</CardDescription>
                      </div>
                    </div>
                    <Badge className="text-base px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {assessment.positiveIndicators.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assessment.positiveIndicators.map((indicator: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-green-950/30 border-l-4 border-green-500 hover:shadow-md transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{indicator}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {assessment.recommendations && assessment.recommendations.length > 0 && (
              <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">Helpful Tips</CardTitle>
                      <CardDescription>Small steps to feel better</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {assessment.recommendations.map((rec: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{rec}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}
