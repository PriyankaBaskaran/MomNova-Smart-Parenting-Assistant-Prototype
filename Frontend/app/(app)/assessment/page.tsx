"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Heart, ArrowLeft, AlertTriangle, CheckCircle2, ArrowRight, Phone, MessageCircle, Sparkles, Loader2 } from "lucide-react"
import { useBaby } from "@/contexts/baby-context"
import { mentalHealthService } from "@/lib/api-services"
import { toast } from "sonner"
import type { MentalHealthAssessment } from "@/lib/types"

// Helper functions for score visualization
function getScoreColor(score: number): string {
  if (score <= 30) return "text-green-600 dark:text-green-400"
  if (score <= 50) return "text-yellow-600 dark:text-yellow-400"
  if (score <= 75) return "text-orange-600 dark:text-orange-400"
  return "text-red-600 dark:text-red-400"
}

function getRiskLevel(score: number): string {
  if (score <= 30) return "Low Risk"
  if (score <= 50) return "Mild Risk"
  if (score <= 75) return "Moderate Risk"
  return "High Risk"
}

function getRiskBadgeVariant(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score <= 30) return "secondary"
  if (score <= 50) return "outline"
  if (score <= 75) return "default"
  return "destructive"
}

function getStrokeColor(score: number): string {
  if (score <= 30) return "#22c55e"
  if (score <= 50) return "#eab308"
  if (score <= 75) return "#f97316"
  return "#ef4444"
}

export default function AssessmentPage() {
  const { selectedBaby } = useBaby()
  const [assessment, setAssessment] = useState<MentalHealthAssessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [days, setDays] = useState(14)
  const [showSupportMessage, setShowSupportMessage] = useState(false)

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!selectedBaby) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await mentalHealthService.getAssessment(days)
        setAssessment(data)
        // Auto-show support message if high risk
        if (data && data.riskScore > 75) {
          setTimeout(() => setShowSupportMessage(true), 1000)
        }
      } catch (error) {
        console.error('Failed to fetch assessment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssessment()
  }, [selectedBaby, days])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your assessment...</p>
        </div>
      </div>
    )
  }

  if (!selectedBaby) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>No Baby Profile Selected</CardTitle>
            <CardDescription>
              Please select or create a baby profile to view mental health assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>No Assessment Data</CardTitle>
            <CardDescription>
              Start journaling to get your mental health assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/journal">
              <Button className="w-full">Write Your First Journal Entry</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const score = assessment.riskScore
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Your Mental Health Assessment</h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Time Period Selector */}
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Analysis Period:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 7, label: "7 Days" },
                  { value: 14, label: "14 Days" },
                  { value: 30, label: "30 Days" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={days === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDays(option.value)}
                    className="min-w-[80px]"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Risk Score Section */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-card via-card to-muted/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/5 to-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <CardContent className="pt-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Large Circular Progress */}
              <div className="relative">
                <svg className="w-52 h-52 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="104"
                    cy="104"
                    r="90"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/30"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="104"
                    cy="104"
                    r="90"
                    stroke={getStrokeColor(score)}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-6xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
              </div>

              {/* Score Details */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <Badge variant={getRiskBadgeVariant(score)} className="text-base px-4 py-1.5 mb-2">
                    {getRiskLevel(score)}
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {score <= 30 && "You're Doing Great!"}
                    {score > 30 && score <= 50 && "You're Managing Well"}
                    {score > 50 && score <= 75 && "Take Care of Yourself"}
                    {score > 75 && "Please Reach Out for Support"}
                  </h2>
                  <p className="text-muted-foreground">
                    {score <= 30 && "Your mental health indicators are positive. Keep up the good work with self-care and journaling."}
                    {score > 30 && score <= 50 && "You're handling things well, but remember to prioritize self-care and reach out when needed."}
                    {score > 50 && score <= 75 && "We notice some concerning patterns. Consider talking to someone you trust or a professional."}
                    {score > 75 && "Your well-being is important. Please don't hesitate to reach out for professional support."}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Risk Factors</p>
                    <p className="text-2xl font-bold text-foreground">
                      {assessment.concerningPatterns?.length || 0}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Strengths</p>
                    <p className="text-2xl font-bold text-foreground">
                      {assessment.positiveIndicators?.length || 0}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Based on analysis from last {days} days • Updated {new Date(assessment.assessmentDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors Section */}
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
                    <CardDescription className="mt-1">
                      Patterns that need your attention
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="destructive" className="text-base px-3 py-1.5">
                  {assessment.concerningPatterns.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessment.concerningPatterns.map((factor: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-red-950/30 border-l-4 border-red-500 hover:shadow-md transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed flex-1">{factor}</p>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                <p className="text-sm text-muted-foreground mb-3">
                  💡 Remember: Recognizing these patterns is the first step toward feeling better. You're already doing great by being aware.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Protective Factors Section */}
        {assessment.positiveIndicators && assessment.positiveIndicators.length > 0 && (
          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">Your Strengths</CardTitle>
                    <CardDescription className="mt-1">
                      Positive things you're doing well
                    </CardDescription>
                  </div>
                </div>
                <Badge className="text-base px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {assessment.positiveIndicators.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessment.positiveIndicators.map((factor: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-green-950/30 border-l-4 border-green-500 hover:shadow-md transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed flex-1">{factor}</p>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground">
                  ✨ Keep doing these things! They're helping you stay strong and resilient.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations Section */}
        {assessment.recommendations && assessment.recommendations.length > 0 && (
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Helpful Tips for You</CardTitle>
                  <CardDescription className="mt-1">
                    Small, actionable steps to feel better
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {assessment.recommendations.map((rec: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all group cursor-pointer hover:border-blue-400"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed flex-1">{rec}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-blue-600 transition-all shrink-0 mt-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI Supportive Message */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-secondary/5 via-card to-primary/5">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible value={showSupportMessage ? "ai-advice" : undefined}>
              <AccordionItem value="ai-advice" className="border-none">
                <AccordionTrigger className="hover:no-underline py-4" onClick={() => setShowSupportMessage(!showSupportMessage)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-base text-foreground">A Message of Support</h3>
                      <p className="text-xs text-muted-foreground font-normal">Tap to read words of encouragement</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="bg-card rounded-lg p-5 border shadow-sm space-y-4">
                    <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100">
                      <span className="font-medium text-base">Dear Mama,</span>
                    </p>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      First of all, you are incredibly brave for taking time to understand your mental health. 
                      Being a new mother is one of the most challenging yet beautiful experiences, and it's completely 
                      normal to feel overwhelmed sometimes.
                    </p>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      Your journal entries show your journey, and we want you to know that asking for help is not a sign 
                      of weakness - it shows strength and love for yourself and your baby.
                    </p>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      Consider starting with one small thing today: reach out to one person - whether it's your 
                      partner, mother, friend, or even a helpline. Sometimes just talking about how you feel can lift 
                      a huge weight off your shoulders.
                    </p>
                    <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                      <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 font-medium">
                        You are not alone in this journey. We're here with you, every step of the way. 💕
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Emergency Resources Button */}
        <Card className="border-none shadow-lg bg-red-50 dark:bg-red-950/20 mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Need Immediate Help?</h3>
                <p className="text-sm text-red-600 dark:text-red-500">
                  If you are in crisis, please reach out right away
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/emergency">
                  <Button variant="destructive" size="lg" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Call Helpline
                  </Button>
                </Link>
                <Link href="/emergency">
                  <Button variant="outline" size="lg" className="gap-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40">
                    <MessageCircle className="w-4 h-4" />
                    Chat Now
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Helpline numbers */}
            <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-500 text-center sm:text-left">
                <span className="font-medium">India Helplines:</span> iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345 | NIMHANS: 080-46110007
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/journal">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              Write New Journal Entry
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
