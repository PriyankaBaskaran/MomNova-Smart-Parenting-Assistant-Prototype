"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useBaby } from "@/contexts/baby-context"
import { adviceService } from "@/lib/api-services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Sparkles, Calendar, Baby as BabyIcon, Heart, AlertCircle } from "lucide-react"
import { MandalaPattern } from "@/components/mandala-pattern"
import { toast } from "sonner"
import { calculateAge } from "@/lib/date-utils"
import type { DailyAdvice } from "@/lib/types"

export default function AdvicePage() {
  const { user } = useAuth()
  const { selectedBaby, babies } = useBaby()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAdvice, setGeneratedAdvice] = useState<DailyAdvice | null>(null)

  const handleGenerate = async () => {
    if (!selectedBaby) {
      toast.error("Please select a baby profile first")
      return
    }

    setIsGenerating(true)
    setGeneratedAdvice(null)
    
    try {
      const advice = await adviceService.generate(selectedBaby.id)
      setGeneratedAdvice(advice)
      toast.success("Daily advice generated!")
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Format advice text with proper styling
  const formatAdvice = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers (lines with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="font-semibold text-secondary mt-4 mb-2 text-lg">
            {line.replace(/\*\*/g, '')}
          </h3>
        )
      }

      // Numbered lists
      if (line.trim().match(/^\d+\./)) {
        return (
          <p key={index} className="mb-1 ml-4 text-foreground/90 leading-relaxed">
            {line}
          </p>
        )
      }

      // Bullet points
      if (line.trim().startsWith('-')) {
        return (
          <p key={index} className="mb-1 ml-4 text-foreground/90 leading-relaxed">
            {line}
          </p>
        )
      }

      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="mb-2 text-foreground/90 leading-relaxed">
            {line}
          </p>
        )
      }

      // Empty lines
      return <br key={index} />
    })
  }

  // Show baby profile prompt if no baby
  if (!selectedBaby && babies.length === 0) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center">
        <MandalaPattern className="absolute -top-20 -right-20 w-80 h-80 text-primary/3" />
        <Card className="max-w-md w-full relative z-10">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BabyIcon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Create a Baby Profile</CardTitle>
            <CardDescription>
              Create a baby profile to get personalized daily advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <MandalaPattern className="absolute -top-20 -right-20 w-80 h-80 text-primary/3" />
        <MandalaPattern className="absolute -bottom-20 -left-20 w-64 h-64 text-secondary/3" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Daily Parenting Advice
          </h1>
          <p className="text-muted-foreground">
            AI-powered personalized advice for {selectedBaby?.name}
          </p>
        </div>

        {/* Baby Info Card */}
        {selectedBaby && (
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BabyIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedBaby.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {calculateAge(selectedBaby.dateOfBirth)} old
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Generate Today's Advice
            </CardTitle>
            <CardDescription>
              Get personalized AI-powered advice based on your baby's age and your recent journal entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !selectedBaby}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating advice...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Daily Advice
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isGenerating && (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        )}

        {/* Generated Advice */}
        {generatedAdvice && !isGenerating && (
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                    <Heart className="w-5 h-5 text-primary" />
                    Today's Advice
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Personalized for {selectedBaby?.name} ({calculateAge(selectedBaby?.dateOfBirth || '')})
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {generatedAdvice.generatedAt 
                      ? new Date(generatedAdvice.generatedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : 'Today'
                    }
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none">
                {formatAdvice(generatedAdvice.advice)}
              </div>

              {/* Category Badge */}
              {generatedAdvice.category && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {generatedAdvice.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Baby Age Info */}
              <div className="mt-4 p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <BabyIcon className="w-4 h-4 inline mr-2" />
                  This advice is tailored for {selectedBaby?.name} who is {generatedAdvice.babyAgeInDays} days old
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Alert */}
        {!generatedAdvice && !isGenerating && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Click the button above to generate personalized daily advice powered by AI. 
              The advice is based on your baby's age and your recent journal entries.
            </AlertDescription>
          </Alert>
        )}

        {/* Supportive Message */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl">💝</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Remember</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every baby is unique, and so is every parenting journey. Use this advice as a guide, 
                but always trust your instincts. You know your baby best! 🤱
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
