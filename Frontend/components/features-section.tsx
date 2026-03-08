"use client"

import { FeatureCard } from "./feature-card"
import { MandalaPattern } from "./mandala-pattern"

const features = [
  {
    icon: "📝",
    title: "Daily Journal with AI Sentiment Analysis",
    description: "Write your daily thoughts and feelings. Our AI understands your emotions and provides gentle insights to help you reflect on your parenting journey."
  },
  {
    icon: "🤖",
    title: "Personalized Parenting Advice",
    description: "Get culturally-aware parenting tips that understand Indian family dynamics. Available in Hinglish - jaise aap chahein, waise baat karein!"
  },
  {
    icon: "💚",
    title: "Mental Health Risk Assessment",
    description: "Regular check-ins to monitor your emotional well-being. We help identify early signs of postpartum depression and connect you with support when needed."
  },
  {
    icon: "📊",
    title: "Mood Trend Tracking",
    description: "Visualize your emotional patterns over time. Understand what triggers stress and what brings you joy, helping you take better care of yourself."
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative mandala */}
      <MandalaPattern className="absolute -right-40 top-1/2 -translate-y-1/2 w-80 h-80 text-primary/10 hidden lg:block" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Everything You Need for Your Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Designed with love, keeping Indian mothers in mind. From emotional support to practical advice - we are here for you.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-background/60 backdrop-blur-lg border border-border/30 shadow-lg">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 border-2 border-background flex items-center justify-center text-primary-foreground text-xs font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Join our community</p>
              <p className="text-xs text-muted-foreground">10,000+ mothers supporting each other</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
