"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-background/60 backdrop-blur-lg border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-2">
        <div className="text-4xl mb-3">{icon}</div>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
