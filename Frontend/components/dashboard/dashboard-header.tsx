"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Settings, LogOut } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  userName: string
  babyName: string
  babyAge: string
}

export function DashboardHeader({ userName, babyName, babyAge }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SP</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:block">Smart Parenting</span>
          </Link>

          {/* User info and actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
              <span className="sr-only">Settings</span>
            </Button>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{babyName}, {babyAge}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-5 h-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
