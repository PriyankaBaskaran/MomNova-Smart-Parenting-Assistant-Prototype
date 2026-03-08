"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, BookOpen } from "lucide-react"
import Link from "next/link"

interface JournalEntry {
  id: string
  preview: string
  sentiment: "Positive" | "Negative" | "Neutral"
  timestamp: string
}

interface RecentJournalsProps {
  entries: JournalEntry[]
}

function getSentimentBadgeVariant(sentiment: string): "default" | "secondary" | "outline" | "destructive" {
  switch (sentiment) {
    case "Positive":
      return "default"
    case "Negative":
      return "destructive"
    default:
      return "secondary"
  }
}

function getSentimentBadgeClass(sentiment: string): string {
  switch (sentiment) {
    case "Positive":
      return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
    case "Negative":
      return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100"
  }
}

export function RecentJournals({ entries }: RecentJournalsProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Journal Entries</CardTitle>
          <CardDescription>Your latest thoughts and reflections</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/journal">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No journal entries yet.</p>
            <p className="text-sm text-muted-foreground">Start writing to track your emotions!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="group p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                      {entry.preview}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {entry.timestamp}
                    </p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`shrink-0 ${getSentimentBadgeClass(entry.sentiment)}`}
                  >
                    {entry.sentiment}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
