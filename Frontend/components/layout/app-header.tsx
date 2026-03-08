"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Menu, LogOut, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MobileSidebar } from "./mobile-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useBaby } from "@/contexts/baby-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Baby as BabyIcon } from "lucide-react"

export function AppHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { babies, selectedBaby, selectBaby } = useBaby()

  const handleLogout = () => {
    logout()
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Calculate baby age
  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const now = new Date()
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`
    }
    const years = Math.floor(months / 12)
    return `${years} year${years !== 1 ? 's' : ''}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border/50 p-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
                  </div>
                  <span className="font-semibold">Smart Parenting</span>
                </SheetTitle>
              </SheetHeader>
              <MobileSidebar />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="hidden sm:block font-semibold text-foreground">
              Smart Parenting Assistant
            </span>
          </Link>
        </div>

        {/* Right: Notifications & User Menu */}
        <div className="flex items-center gap-2">
          {/* Baby Selector */}
          {babies.length > 0 && (
            <Select
              value={selectedBaby?.id}
              onValueChange={(babyId) => {
                const baby = babies.find(b => b.id === babyId)
                if (baby) selectBaby(baby)
              }}
            >
              <SelectTrigger className="w-[180px] hidden sm:flex">
                <div className="flex items-center gap-2">
                  <BabyIcon className="h-4 w-4" />
                  <SelectValue placeholder="Select baby" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {babies.map((baby) => (
                  <SelectItem key={baby.id} value={baby.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{baby.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {calculateAge(baby.dateOfBirth)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">{user?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
