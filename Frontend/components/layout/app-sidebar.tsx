"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  PenLine, 
  Lightbulb, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  Activity
} from "lucide-react"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Journal Entry",
    href: "/journal",
    icon: PenLine,
  },
  {
    label: "Daily Advice",
    href: "/advice",
    icon: Lightbulb,
  },
  {
    label: "Mental Health",
    href: "/assessment",
    icon: Heart,
  },
  {
    label: "Mood Trends",
    href: "/mood-trends",
    icon: TrendingUp,
  },
  {
    label: "Fitness Tracking",
    href: "/fitness",
    icon: Activity,
  },
  {
    label: "Emergency",
    href: "/emergency",
    icon: AlertTriangle,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Supportive message */}
      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Remember, seeking help is a sign of strength. You are doing great, Mama!
        </p>
      </div>
    </aside>
  )
}
