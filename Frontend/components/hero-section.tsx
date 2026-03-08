"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MandalaPattern } from "./mandala-pattern"
import { ArrowRight, Heart } from "lucide-react"

export function HeroSection() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/register')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
      
      {/* Mandala decorations */}
      <MandalaPattern className="absolute -top-20 -right-20 w-96 h-96 text-primary/30 rotate-12 hidden lg:block" />
      <MandalaPattern className="absolute -bottom-32 -left-32 w-[500px] h-[500px] text-secondary/20 -rotate-45 hidden lg:block" />
      <MandalaPattern className="absolute top-1/4 left-10 w-32 h-32 text-primary/20 hidden md:block" />
      
      {/* Floating elements */}
      <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-primary/30 animate-pulse hidden md:block" />
      <div className="absolute bottom-1/3 left-1/4 w-6 h-6 rounded-full bg-secondary/30 animate-pulse hidden md:block" />
      <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-accent/40 animate-pulse hidden md:block" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Heart className="w-4 h-4 text-primary" fill="currentColor" />
          <span className="text-sm font-medium text-primary">Trusted by 10,000+ Indian Mothers</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
          <span className="text-balance">
            {"You're Not Alone, Mama "}
          </span>
          <span className="inline-block animate-pulse">{"💕"}</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed text-pretty">
          AI-powered support for your parenting journey, understanding Indian culture and your emotions
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg font-semibold border-2 border-secondary/50 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground mb-4">Aapke emotions samajhte hain hum</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Available 24/7
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Hinglish Support
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              100% Private
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
