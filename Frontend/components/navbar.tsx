"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLoginClick = () => {
    router.push('/login')
  }

  const handleGetStartedClick = () => {
    router.push('/register')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              Smart Parenting
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleLoginClick}
              className="text-foreground hover:bg-muted"
            >
              Login
            </Button>
            <Button
              onClick={handleGetStartedClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/30">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLoginClick()
                    setMobileMenuOpen(false)
                  }}
                  className="flex-1"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    handleGetStartedClick()
                    setMobileMenuOpen(false)
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
