"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useBaby } from "@/contexts/baby-context"
import { journalService } from "@/lib/api-services"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Keyboard, Mic, Loader2, AlertTriangle, Phone, ArrowLeft, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import { VoiceRecorder } from "@/components/voice-recorder"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import type { JournalEntry } from "@/lib/types"

const MAX_CHARS = 5000

const MOODS = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😢", label: "Sad", value: "sad" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "😩", label: "Overwhelmed", value: "overwhelmed" },
]

export default function JournalPage() {
  const { user } = useAuth()
  const { selectedBaby } = useBaby()
  const [inputMode, setInputMode] = useState<"type" | "voice">("type")
  const [journalText, setJournalText] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null)
  const [allJournals, setAllJournals] = useState<JournalEntry[]>([])
  const [isLoadingJournals, setIsLoadingJournals] = useState(true)

  // Fetch all journals on mount and when baby changes
  useEffect(() => {
    const fetchJournals = async () => {
      if (!selectedBaby) {
        setIsLoadingJournals(false)
        return
      }

      try {
        setIsLoadingJournals(true)
        // Use fixed start date to get all journals from 2026-01-01
        const startDate = '2026-01-01T00:00:00.000Z'
        const endDate = new Date().toISOString()
        const journals = await journalService.getAll(startDate, endDate)
        // Sort in descending order (newest first)
        const sortedJournals = journals.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setAllJournals(sortedJournals)
      } catch (error) {
        console.error('Failed to fetch journals:', error)
      } finally {
        setIsLoadingJournals(false)
      }
    }

    fetchJournals()
  }, [selectedBaby])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= MAX_CHARS) {
      setJournalText(text)
    }
  }

  const handleTranscriptionUpdate = (text: string) => {
    if (text.length <= MAX_CHARS) {
      setJournalText(text)
    } else {
      setJournalText(text.substring(0, MAX_CHARS))
      toast.warning("Transcription truncated to maximum length")
    }
  }

  const handleSubmit = async () => {
    if (!journalText.trim()) {
      toast.error("Please write something in your journal")
      return
    }

    if (!selectedBaby) {
      toast.error("Please create a baby profile first")
      return
    }
    
    setIsAnalyzing(true)
    setJournalEntry(null)
    
    try {
      const entry = await journalService.create({
        content: journalText,
        mood: selectedMood || undefined,
        babyId: selectedBaby.id,
      })
      
      setJournalEntry(entry)
      // Add new entry to the list
      setAllJournals(prev => [entry, ...prev])
      toast.success("Journal entry saved with sentiment analysis!")
      
      // Clear form
      setJournalText("")
      setSelectedMood(null)
    } catch (error) {
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment.toUpperCase()) {
      case "POSITIVE": return "😊"
      case "NEGATIVE": return "😔"
      case "NEUTRAL": return "😐"
      case "MIXED": return "😕"
      default: return "😐"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toUpperCase()) {
      case "POSITIVE": return "text-green-600"
      case "NEGATIVE": return "text-red-500"
      case "NEUTRAL": return "text-blue-500"
      case "MIXED": return "text-purple-500"
      default: return "text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            How are you feeling today?
          </h1>
          <p className="text-muted-foreground">
            Take a moment to share your thoughts. We&apos;re here to listen.
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={inputMode === "type" ? "default" : "outline"}
            onClick={() => setInputMode("type")}
            className="gap-2"
          >
            <Keyboard className="w-4 h-4" />
            Type
          </Button>
          <Button
            variant={inputMode === "voice" ? "default" : "outline"}
            onClick={() => setInputMode("voice")}
            className="gap-2"
          >
            <Mic className="w-4 h-4" />
            Voice Input
          </Button>
        </div>

        {/* Journal Entry Card */}
        <Card className="mb-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Your Journal Entry</CardTitle>
            <CardDescription>
              Share your thoughts... You can write in English, Hindi, or Hinglish
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Voice Recorder (when voice mode) */}
            {inputMode === "voice" && (
              <VoiceRecorder 
                onTranscriptionUpdate={handleTranscriptionUpdate}
                className="mb-4"
              />
            )}

            {/* Text Area */}
            <div className="relative">
              <Textarea
                value={journalText}
                onChange={handleTextChange}
                placeholder="Share your thoughts... You can write in English, Hindi, or Hinglish"
                className="min-h-[200px] resize-none text-base leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {journalText.length}/{MAX_CHARS}
              </div>
            </div>

            {/* Mood Selector */}
            <div>
              <p className="text-sm font-medium mb-3 text-foreground">How would you describe your mood?</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood.value)}
                    className="gap-1.5"
                  >
                    <span className="text-lg">{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              size="lg"
              className="w-full mt-4"
              onClick={handleSubmit}
              disabled={!journalText.trim() || isAnalyzing || !selectedBaby}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing your emotions...
                </>
              ) : (
                "Submit Entry"
              )}
            </Button>
            
            {!selectedBaby && (
              <p className="text- Your Journal Historysm text-center text-muted-foreground">
                Please create a baby profile first to start journaling
              </p>
            )}
          </CardContent>
        </Card>

        {/* Sentiment Analysis Result */}
        {journalEntry && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            {/* Red Flag Alert */}
            {journalEntry.hasRedFlags && journalEntry.emergencyResources && (
              <Alert variant="destructive" className="border-red-300 bg-red-50">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-red-800 font-semibold">
                  We noticed some concerning words
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  <p className="mb-3">
                    We care about your wellbeing. If you&apos;re going through a difficult time, please reach out for support.
                  </p>
                  <div className="space-y-2 mb-3">
                    {journalEntry.emergencyResources.map((resource, idx) => (
                      <div key={idx} className="bg-white/50 p-3 rounded">
                        <p className="font-semibold text-red-900">{resource.name}</p>
                        <p className="text-red-800 font-mono">{resource.phone}</p>
                        <p className="text-sm text-red-700">{resource.description}</p>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    <Phone className="w-4 h-4 mr-2" />
                    Call for Help
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Sentiment Result Card */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Powered by AWS Comprehend AI
                </p>
              </CardHeader>
              <CardContent>
                {/* Overall Sentiment */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">
                    {getSentimentEmoji(journalEntry.sentiment)}
                  </div>
                  <p className={`text-xl font-semibold capitalize ${getSentimentColor(journalEntry.sentiment)}`}>
                    {journalEntry.sentiment}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Confidence: {Math.round(journalEntry.confidenceScore * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Language: {journalEntry.language}
                  </p>
                </div>

                {/* Sentiment Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-foreground">Sentiment Breakdown</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600 font-medium">Positive</span>
                        <span className="text-muted-foreground">
                          {Math.round(journalEntry.sentimentScores.positive * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={journalEntry.sentimentScores.positive * 100} 
                        className="h-2 [&>div]:bg-green-500" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-500 font-medium">Negative</span>
                        <span className="text-muted-foreground">
                          {Math.round(journalEntry.sentimentScores.negative * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={journalEntry.sentimentScores.negative * 100} 
                        className="h-2 [&>div]:bg-red-500" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-500 font-medium">Neutral</span>
                        <span className="text-muted-foreground">
                          {Math.round(journalEntry.sentimentScores.neutral * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={journalEntry.sentimentScores.neutral * 100} 
                        className="h-2 [&>div]:bg-blue-500" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-purple-500 font-medium">Mixed</span>
                        <span className="text-muted-foreground">
                          {Math.round(journalEntry.sentimentScores.mixed * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={journalEntry.sentimentScores.mixed * 100} 
                        className="h-2 [&>div]:bg-purple-500" 
                      />
                    </div>
                  </div>
                </div>

                {/* Supportive Message */}
                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm text-center text-foreground">
                    {journalEntry.sentiment.toUpperCase() === "POSITIVE"
                      ? "It's wonderful to see you're feeling good! Keep nurturing those positive moments. 💕"
                      : journalEntry.sentiment.toUpperCase() === "NEGATIVE"
                      ? "It's okay to have tough days, mama. Remember, you're doing an amazing job. We're here for you. 🤗"
                      : "Thank you for sharing. Every emotion is valid. Take it one moment at a time. 💛"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Journal Entries Section */}
        {selectedBaby && (
          <>
            <Separator className="my-8" />
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Your Journal History
              </h2>
              <p className="text-muted-foreground">
                All your journal entries with sentiment analysis
              </p>
            </div>

            {isLoadingJournals ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading journals...</span>
              </div>
            ) : allJournals.length === 0 ? (
              <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-2">No journal entries yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start writing above to track your emotions and thoughts
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {allJournals.map((entry) => (
                  <Card key={entry.id} className="shadow-lg border-0 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">
                            {getSentimentEmoji(entry.sentiment)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  entry.sentiment === 'POSITIVE' ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30" :
                                  entry.sentiment === 'NEGATIVE' ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30" :
                                  entry.sentiment === 'NEUTRAL' ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30" :
                                  "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/30"
                                )}
                              >
                                {entry.sentiment}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(entry.confidenceScore * 100)}% confidence
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {format(parseISO(entry.createdAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Journal Content */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>
                      </div>

                      {/* Mood Badge */}
                      {entry.mood && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Mood:</span>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {entry.mood}
                          </Badge>
                        </div>
                      )}

                      {/* Sentiment Scores */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Positive</div>
                          <div className="text-sm font-semibold text-green-600">
                            {Math.round(entry.sentimentScores.positive * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Negative</div>
                          <div className="text-sm font-semibold text-red-500">
                            {Math.round(entry.sentimentScores.negative * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Neutral</div>
                          <div className="text-sm font-semibold text-blue-500">
                            {Math.round(entry.sentimentScores.neutral * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Mixed</div>
                          <div className="text-sm font-semibold text-purple-500">
                            {Math.round(entry.sentimentScores.mixed * 100)}%
                          </div>
                        </div>
                      </div>

                      {/* Red Flag Alert */}
                      {entry.hasRedFlags && entry.emergencyResources && (
                        <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-950/30">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-xs text-red-700 dark:text-red-400">
                            This entry contained concerning words. Support resources are available.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
