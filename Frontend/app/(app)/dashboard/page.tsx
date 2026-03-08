"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useBaby } from "@/contexts/baby-context"
import { MentalHealthScore } from "@/components/dashboard/mental-health-score"
import Link from "next/link"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { MoodTrendChart } from "@/components/dashboard/mood-trend-chart"
import { RecentJournals } from "@/components/dashboard/recent-journals"
import { MandalaPattern } from "@/components/mandala-pattern"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { BabyProfileForm } from "@/components/baby-profile-form"
import { journalService, mentalHealthService, analyticsService } from "@/lib/api-services"
import { formatRelativeTime } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Baby, Plus } from "lucide-react"
import type { JournalEntry, MentalHealthAssessment, MoodTrendResponse } from "@/lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const { selectedBaby, babies } = useBaby()
  const [isLoading, setIsLoading] = useState(true)
  const [assessment, setAssessment] = useState<MentalHealthAssessment | null>(null)
  const [journals, setJournals] = useState<JournalEntry[]>([])
  const [moodTrends, setMoodTrends] = useState<MoodTrendResponse | null>(null)
  const [showBabyForm, setShowBabyForm] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedBaby) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Calculate date range for last 7 days
        const endDate = new Date()
        const startDate = new Date("2026-01-01")

        // Fetch all dashboard data in parallel
        const [assessmentData, journalsData, trendsData] = await Promise.all([
          mentalHealthService.getAssessment(14).catch(() => null),
          journalService.getAll(startDate.toISOString(), endDate.toISOString()).catch(() => []),
          analyticsService.getMoodTrends(startDate.toISOString(), endDate.toISOString()).catch(() => null),
        ])

        setAssessment(assessmentData)
        setJournals(journalsData.slice(0, 3)) // Get latest 3 journals
        setMoodTrends(trendsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedBaby])

  if (isLoading && selectedBaby) {
    return <DashboardSkeleton />
  }

  // Show baby profile creation prompt if no baby exists
  if (!selectedBaby && babies.length === 0) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center">
        <MandalaPattern className="absolute -top-20 -right-20 w-80 h-80 text-primary/3" />
        <Card className="max-w-md w-full relative z-10">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Baby className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Welcome to Smart Parenting Assistant!</CardTitle>
            <CardDescription>
              Let's start by creating a profile for your baby
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowBabyForm(true)} 
              className="w-full"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Baby Profile
            </Button>
          </CardContent>
        </Card>
        <BabyProfileForm open={showBabyForm} onOpenChange={setShowBabyForm} />
      </div>
    )
  }

  // Transform journal entries for display
  const recentJournalEntries = journals.map(journal => ({
    id: journal.id,
    preview: journal.content.substring(0, 150) + '...',
    sentiment: journal.sentiment === 'POSITIVE' ? 'Positive' as const 
      : journal.sentiment === 'NEGATIVE' ? 'Negative' as const 
      : 'Neutral' as const,
    timestamp: formatRelativeTime(journal.createdAt),
  }))

  // Generate chart data for last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      score: moodTrends ? moodTrends.averageSentiment : 0.5,
      fullDate: date.toLocaleDateString(),
    }
  })

  return (
    <div className="relative">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <MandalaPattern className="absolute -top-20 -right-20 w-80 h-80 text-primary/3" />
        <MandalaPattern className="absolute -bottom-20 -left-20 w-64 h-64 text-secondary/3" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Welcome message */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {user?.name || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is how you are doing today. Remember, every small step counts.
          </p>
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Mental Health Score + Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/assessment" className="block hover:opacity-90 transition-opacity">
              <MentalHealthScore 
                score={assessment?.riskScore || 0}
                lastUpdated={assessment ? formatRelativeTime(assessment.assessmentDate) : 'Not assessed'}
              />
            </Link>
            
            <QuickActions />

            {/* Mood Trend Chart */}
            <Link href="/mood-trends" className="block hover:opacity-95 transition-opacity">
              <MoodTrendChart data={chartData} />
            </Link>
          </div>

          {/* Right column - Recent Journals */}
          <div className="lg:col-span-1">
            <RecentJournals entries={recentJournalEntries} />
          </div>
        </div>

        {/* Supportive message */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl">🤱</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Daily Reminder</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aap ek amazing maa ho! Taking care of yourself is not selfish - it is necessary. 
                Your well-being matters just as much as {selectedBaby?.name || 'your baby'}&apos;s. We are here for you, always.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
