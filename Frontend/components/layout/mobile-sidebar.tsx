"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"
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
    label: "Emergency Resources",
    href: "/emergency",
    icon: AlertTriangle,
  },
]

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <SheetClose asChild key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span>{item.label}</span>
            </Link>
          </SheetClose>
        )
      })}

      {/* Supportive message */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Remember, seeking help is a sign of strength. You are doing great, Mama!
        </p>
      </div>
    </nav>
  )
}
