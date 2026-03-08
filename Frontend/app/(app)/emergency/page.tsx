"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Phone, 
  Heart,
  AlertTriangle,
  Clock,
  Globe,
  ChevronDown,
  Home,
  Wind,
  Eye,
  HandHeart,
  Brain,
  Sparkles
} from "lucide-react"

const helplines = [
  {
    name: "NIMHANS Helpline",
    number: "080-46110007",
    description: "National Institute of Mental Health and Neurosciences - Professional mental health support",
    hours: "Mon-Sat, 9:00 AM - 4:30 PM",
    languages: ["English", "Hindi", "Kannada"],
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    description: "India's largest mental health foundation providing free counseling and crisis intervention",
    hours: "24 hours, 7 days a week",
    languages: ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"],
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "border-purple-500/30",
  },
  {
    name: "iCall",
    number: "9152987821",
    description: "Psychosocial helpline by Tata Institute of Social Sciences (TISS)",
    hours: "Mon-Sat, 8:00 AM - 10:00 PM",
    languages: ["English", "Hindi", "Marathi"],
    color: "from-teal-500/20 to-teal-600/10",
    borderColor: "border-teal-500/30",
  },
  {
    name: "AASRA",
    number: "91-22-27546669",
    description: "Crisis intervention and suicide prevention - trained volunteers available",
    hours: "24 hours, 7 days a week",
    languages: ["English", "Hindi"],
    color: "from-rose-500/20 to-rose-600/10",
    borderColor: "border-rose-500/30",
  },
  {
    name: "Sneha India",
    number: "91-44-24640050",
    description: "Emotional support and suicide prevention helpline based in Chennai",
    hours: "24 hours, 7 days a week",
    languages: ["English", "Hindi", "Tamil"],
    color: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/30",
  },
  {
    name: "Fortis Stress Helpline",
    number: "+91-8376804102",
    description: "Free mental health support by Fortis Healthcare professionals",
    hours: "24 hours, 7 days a week",
    languages: ["English", "Hindi"],
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
  },
]

const selfCareTips = [
  {
    title: "Box Breathing Exercise",
    icon: Wind,
    description: "A calming technique to reduce anxiety and stress",
    content: [
      "Find a comfortable seated position",
      "Breathe in slowly for 4 seconds",
      "Hold your breath for 4 seconds",
      "Exhale slowly for 4 seconds",
      "Hold empty for 4 seconds",
      "Repeat 4-6 times until you feel calmer",
    ],
  },
  {
    title: "5-4-3-2-1 Grounding Technique",
    icon: Eye,
    description: "Bring yourself back to the present moment",
    content: [
      "Name 5 things you can SEE around you",
      "Name 4 things you can TOUCH or feel",
      "Name 3 things you can HEAR right now",
      "Name 2 things you can SMELL",
      "Name 1 thing you can TASTE",
      "Take a deep breath - you are here, you are safe",
    ],
  },
  {
    title: "Self-Compassion Practice",
    icon: HandHeart,
    description: "Be kind to yourself like you would to a friend",
    content: [
      "Place your hand on your heart",
      "Say to yourself: 'This is a difficult moment'",
      "Acknowledge: 'Many mothers feel this way'",
      "Tell yourself: 'Mujhe apna khayal rakhna hai'",
      "Breathe deeply and feel the warmth of your hand",
      "Remind yourself: 'I am doing my best'",
    ],
  },
  {
    title: "When to Seek Professional Help",
    icon: Brain,
    description: "Signs that indicate you should reach out",
    content: [
      "Persistent feelings of sadness lasting more than 2 weeks",
      "Difficulty bonding with your baby",
      "Thoughts of harming yourself or your baby",
      "Severe anxiety or panic attacks",
      "Unable to sleep even when baby is sleeping",
      "Loss of interest in activities you used to enjoy",
      "Feeling disconnected from reality",
    ],
  },
]

export default function EmergencyPage() {
  const [openTips, setOpenTips] = useState<string[]>(["Box Breathing Exercise"])

  const toggleTip = (title: string) => {
    setOpenTips(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
          <Heart className="w-8 h-8 text-accent-foreground" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          You&apos;re Not Alone - Help is Available
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Reaching out takes courage. These resources are here to support you through difficult moments.
        </p>
      </div>

      {/* Crisis Alert */}
      <Alert className="border-2 border-destructive/50 bg-gradient-to-r from-destructive/10 to-destructive/5 shadow-lg">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <AlertTitle className="text-destructive font-bold text-lg">
          If you are in immediate danger
        </AlertTitle>
        <AlertDescription className="text-destructive/90 mt-2">
          <p className="mb-3">Please call emergency services immediately or go to your nearest hospital.</p>
          <a href="tel:112" className="inline-block">
            <Button variant="destructive" size="lg" className="gap-2 font-bold text-lg">
              <Phone className="w-5 h-5" />
              Call 112 Now
            </Button>
          </a>
        </AlertDescription>
      </Alert>

      {/* Helplines Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Phone className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Mental Health Helplines</h2>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helplines.map((helpline) => (
            <Card 
              key={helpline.name} 
              className={`bg-gradient-to-br ${helpline.color} ${helpline.borderColor} border-2 hover:shadow-lg transition-shadow`}
            >
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground text-lg mb-2">{helpline.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {helpline.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{helpline.hours}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{helpline.languages.join(", ")}</span>
                  </div>
                </div>

                <a 
                  href={`tel:${helpline.number.replace(/[^0-9+]/g, '')}`}
                  className="block"
                >
                  <Button className="w-full gap-2 font-bold text-base py-5" size="lg">
                    <Phone className="w-5 h-5" />
                    {helpline.number}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Self-Care Tips Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-accent-foreground" />
          <h2 className="text-xl font-bold text-foreground">Self-Care & Coping Strategies</h2>
        </div>

        <div className="space-y-3">
          {selfCareTips.map((tip) => {
            const isOpen = openTips.includes(tip.title)
            const Icon = tip.icon

            return (
              <Collapsible 
                key={tip.title} 
                open={isOpen}
                onOpenChange={() => toggleTip(tip.title)}
              >
                <Card className={`border-border/50 transition-all ${isOpen ? 'shadow-md border-primary/30' : ''}`}>
                  <CollapsibleTrigger className="w-full text-left">
                    <CardHeader className="pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">{tip.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">{tip.description}</p>
                          </div>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-4 pb-5">
                      <div className="ml-13 pl-13">
                        <ol className="space-y-2 list-decimal list-inside">
                          {tip.content.map((step, index) => (
                            <li key={index} className="text-sm text-muted-foreground leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          })}
        </div>
      </div>

      {/* Supportive Message */}
      <Card className="bg-gradient-to-br from-accent/15 via-primary/5 to-secondary/10 border-accent/30 border-2">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-2">Remember, Mama</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seeking help is a sign of strength, not weakness. Your mental health matters just as much as your physical health. 
                Taking care of yourself is taking care of your baby too. <span className="font-medium text-foreground">Aap akeli nahi ho</span> - millions of mothers 
                have felt what you are feeling. You deserve support, compassion, and care.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back to Dashboard Button */}
      <div className="text-center pt-4">
        <Link href="/dashboard">
          <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base">
            <Home className="w-5 h-5" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
