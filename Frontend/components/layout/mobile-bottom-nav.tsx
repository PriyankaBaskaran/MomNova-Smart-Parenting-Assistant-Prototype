"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  PenLine, 
  Lightbulb, 
  Heart, 
  MoreHorizontal 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrendingUp, AlertTriangle } from "lucide-react"

const mainNavItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Journal",
    href: "/journal",
    icon: PenLine,
  },
  {
    label: "Advice",
    href: "/advice",
    icon: Lightbulb,
  },
  {
    label: "Health",
    href: "/assessment",
    icon: Heart,
  },
]

const moreNavItems = [
  {
    label: "Mood Trends",
    href: "/mood-trends",
    icon: TrendingUp,
  },
  {
    label: "Emergency",
    href: "/emergency",
    icon: AlertTriangle,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-md safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive && "bg-primary/10"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl text-muted-foreground min-w-[60px]">
            <div className="p-1.5 rounded-lg">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">More</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-2">
            {moreNavItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
