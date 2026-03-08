"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    onOpenChange(false)
    // Navigate to dashboard after successful login/register
    router.push("/dashboard")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-foreground">
            Welcome, Mama
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Join thousands of mothers on their parenting journey
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="aap@example.com"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-foreground">Full Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Aapka naam"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-foreground">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="aap@example.com"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-foreground">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  )
}
