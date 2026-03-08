"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface MentalHealthScoreProps {
  score: number
  lastUpdated: string
}

function getScoreColor(score: number): string {
  if (score <= 30) return "text-green-500"
  if (score <= 50) return "text-yellow-500"
  if (score <= 75) return "text-orange-500"
  return "text-red-500"
}

function getScoreGradient(score: number): string {
  if (score <= 30) return "from-green-400 to-green-500"
  if (score <= 50) return "from-yellow-400 to-yellow-500"
  if (score <= 75) return "from-orange-400 to-orange-500"
  return "from-red-400 to-red-500"
}

function getRiskLevel(score: number): string {
  if (score <= 30) return "Low Risk"
  if (score <= 50) return "Mild Risk"
  if (score <= 75) return "Moderate Risk"
  return "High Risk"
}

function getRiskBadgeColor(score: number): string {
  if (score <= 30) return "bg-green-100 text-green-700 border-green-200"
  if (score <= 50) return "bg-yellow-100 text-yellow-700 border-yellow-200"
  if (score <= 75) return "bg-orange-100 text-orange-700 border-orange-200"
  return "bg-red-100 text-red-700 border-red-200"
}

export function MentalHealthScore({ score, lastUpdated }: MentalHealthScoreProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-card via-card to-muted/30">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader>
        <CardTitle className="text-xl">Mental Health Score</CardTitle>
        <CardDescription>Your overall well-being indicator</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular Progress */}
          <div className="relative">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r="45"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="72"
                cy="72"
                r="45"
                stroke="url(#scoreGradient)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={`${getScoreGradient(score).includes('green') ? 'stop-color-green-400' : getScoreGradient(score).includes('yellow') ? 'stop-color-yellow-400' : getScoreGradient(score).includes('orange') ? 'stop-color-orange-400' : 'stop-color-red-400'}`} stopColor={score <= 30 ? '#4ade80' : score <= 50 ? '#facc15' : score <= 75 ? '#fb923c' : '#f87171'} />
                  <stop offset="100%" stopColor={score <= 30 ? '#22c55e' : score <= 50 ? '#eab308' : score <= 75 ? '#f97316' : '#ef4444'} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Score details */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getRiskBadgeColor(score)}`}>
              {getRiskLevel(score)}
            </span>
            
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                {score <= 30 && "You are doing great! Keep up the positive habits."}
                {score > 30 && score <= 50 && "You are managing well. Consider some self-care time."}
                {score > 50 && score <= 75 && "Take it easy, mama. We are here to help."}
                {score > 75 && "Please reach out for support. You are not alone."}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
