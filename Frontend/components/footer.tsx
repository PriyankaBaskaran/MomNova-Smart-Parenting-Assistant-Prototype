"use client"

import { MandalaPattern } from "./mandala-pattern"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="relative py-16 overflow-hidden bg-secondary text-secondary-foreground">
      {/* Decorative mandala */}
      <MandalaPattern className="absolute -left-20 -bottom-20 w-64 h-64 text-secondary-foreground/10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-semibold text-lg">Smart Parenting</span>
            </div>
            <p className="text-secondary-foreground/80 max-w-md leading-relaxed">
              Your AI companion for the beautiful, challenging journey of motherhood. 
              Because every mama deserves support that understands her culture and emotions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><a href="#features" className="hover:text-secondary-foreground transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-secondary-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li>hello@smartparenting.in</li>
              <li>+91 98765 43210</li>
              <li className="pt-2">
                <span className="text-sm">Available 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-secondary-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-foreground/70">
            © 2026 Smart Parenting Assistant. Made with{" "}
            <Heart className="w-4 h-4 inline text-primary" fill="currentColor" />{" "}
            in India
          </p>
          <div className="flex gap-6 text-sm text-secondary-foreground/70">
            <a href="#" className="hover:text-secondary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
