"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PenLine, Lightbulb, Activity } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  onWriteJournal?: () => void
  onGetAdvice?: () => void
}

export function QuickActions({ onWriteJournal, onGetAdvice }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Link href="/journal">
        <Card className="group cursor-pointer border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary/10 via-primary/5 to-card overflow-hidden relative"
          onClick={onWriteJournal}
        >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <PenLine className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Write Journal Entry</h3>
            <p className="text-sm text-muted-foreground">Express your thoughts and feelings</p>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="sr-only">Write journal</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </CardContent>
      </Card>
      </Link>

      <Link href="/advice">
        <Card className="group cursor-pointer border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-secondary/10 via-secondary/5 to-card overflow-hidden relative"
          onClick={onGetAdvice}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-7 h-7 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Get Daily Advice</h3>
              <p className="text-sm text-muted-foreground">Personalized tips in Hinglish</p>
            </div>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="sr-only">Get advice</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </CardContent>
        </Card>
      </Link>

      <Link href="/fitness">
        <Card className="group cursor-pointer border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-500/10 via-green-500/5 to-card overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-7 h-7 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Track Fitness</h3>
              <p className="text-sm text-muted-foreground">Monitor your daily activity</p>
            </div>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="sr-only">Track fitness</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
