"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </main>
  )
}

function AboutSection() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-square max-w-lg mx-auto relative">
              {/* Glassmorphism card */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                
                {/* Content inside card */}
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-6xl mb-6">🤱</div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Aapki Baat, Humari Zimmedari
                  </h3>
                  <p className="text-muted-foreground">
                    Your feelings matter. Your journey matters. We are here to listen and support.
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8 w-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">10K+</div>
                      <div className="text-xs text-muted-foreground">Mamas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">98%</div>
                      <div className="text-xs text-muted-foreground">Happy Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-xs text-muted-foreground">Support</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-secondary/20 blur-2xl" />
            </div>
          </div>

          {/* Text content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
              Built by Mothers, for Mothers
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We understand that becoming a mother in India comes with unique joys and challenges. 
                From joint family dynamics to societal expectations, from sleepless nights to endless 
                questions - we have been there.
              </p>
              <p>
                Smart Parenting Assistant was born from a simple idea: every mother deserves a 
                non-judgmental space to express herself, get advice, and track her well-being.
              </p>
              <p>
                Our AI is trained to understand the nuances of Indian motherhood, speaking your 
                language - whether that is Hindi, English, or the beautiful mix of Hinglish that 
                we all love.
              </p>
            </div>

            {/* Features list */}
            <div className="mt-8 space-y-3">
              {[
                "Culturally-aware AI that understands Indian context",
                "Private and secure - your data stays yours",
                "Expert-backed advice from pediatricians & psychologists",
                "Community of 10,000+ supportive mothers"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
