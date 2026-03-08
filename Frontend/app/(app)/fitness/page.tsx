"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Activity, 
  ArrowLeft, 
  CheckCircle2, 
  Footprints, 
  Heart, 
  TrendingUp,
  Smartphone,
  Watch,
  Calendar,
  Zap,
  Target
} from "lucide-react"
import { useBaby } from "@/contexts/baby-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Mock fitness data - In production, this would come from Google Fit/Apple Health APIs
interface FitnessData {
  steps: number
  goal: number
  calories: number
  distance: number // in km
  activeMinutes: number
  heartRate: number
}

interface IntegrationStatus {
  googleFit: boolean
  appleHealth: boolean
}

export default function FitnessPage() {
  const { selectedBaby } = useBaby()
  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    googleFit: false,
    appleHealth: false,
  })
  const [fitnessData, setFitnessData] = useState<FitnessData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Check if running on iOS
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

  // Load saved integration status
  useEffect(() => {
    const savedIntegrations = localStorage.getItem('fitness_integrations')
    if (savedIntegrations) {
      setIntegrations(JSON.parse(savedIntegrations))
    }
  }, [])

  // Fetch fitness data when integration is active
  useEffect(() => {
    if (integrations.googleFit || integrations.appleHealth) {
      fetchFitnessData()
    }
  }, [integrations, selectedDate])

  const handleGoogleFitConnect = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to Google Fit
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newIntegrations = { ...integrations, googleFit: true }
      setIntegrations(newIntegrations)
      localStorage.setItem('fitness_integrations', JSON.stringify(newIntegrations))
      
      toast.success("Google Fit connected successfully!")
      fetchFitnessData()
    } catch (error) {
      toast.error("Failed to connect Google Fit")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppleHealthConnect = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to Apple Health
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newIntegrations = { ...integrations, appleHealth: true }
      setIntegrations(newIntegrations)
      localStorage.setItem('fitness_integrations', JSON.stringify(newIntegrations))
      
      toast.success("Apple Health connected successfully!")
      fetchFitnessData()
    } catch (error) {
      toast.error("Failed to connect Apple Health")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = (platform: 'googleFit' | 'appleHealth') => {
    const newIntegrations = { ...integrations, [platform]: false }
    setIntegrations(newIntegrations)
    localStorage.setItem('fitness_integrations', JSON.stringify(newIntegrations))
    
    if (!newIntegrations.googleFit && !newIntegrations.appleHealth) {
      setFitnessData(null)
    }
    
    toast.success(`${platform === 'googleFit' ? 'Google Fit' : 'Apple Health'} disconnected`)
  }

  const fetchFitnessData = async () => {
    // Simulate fetching data from fitness APIs
    // In production, this would call your backend which integrates with Google Fit/Apple Health
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data
    const mockData: FitnessData = {
      steps: Math.floor(Math.random() * 5000) + 3000,
      goal: 10000,
      calories: Math.floor(Math.random() * 300) + 200,
      distance: parseFloat((Math.random() * 3 + 2).toFixed(2)),
      activeMinutes: Math.floor(Math.random() * 60) + 30,
      heartRate: Math.floor(Math.random() * 20) + 70,
    }
    
    setFitnessData(mockData)
  }

  const stepsProgress = fitnessData ? (fitnessData.steps / fitnessData.goal) * 100 : 0
  const isGoalReached = fitnessData && fitnessData.steps >= fitnessData.goal

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Fitness Tracking</h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google Fit */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Google Fit</CardTitle>
                    <CardDescription className="text-xs">Android devices</CardDescription>
                  </div>
                </div>
                {integrations.googleFit && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track your daily activity, steps, and health metrics from your Android device.
              </p>
              {!integrations.googleFit ? (
                <Button 
                  onClick={handleGoogleFitConnect} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Connecting..." : "Connect Google Fit"}
                </Button>
              ) : (
                <Button 
                  onClick={() => handleDisconnect('googleFit')} 
                  variant="outline"
                  className="w-full"
                >
                  Disconnect
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Apple Health */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                    <Watch className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Apple Health</CardTitle>
                    <CardDescription className="text-xs">iOS devices</CardDescription>
                  </div>
                </div>
                {integrations.appleHealth && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sync your health data from iPhone, Apple Watch, and other iOS devices.
              </p>
              {!integrations.appleHealth ? (
                <Button 
                  onClick={handleAppleHealthConnect} 
                  disabled={isLoading || !isIOS}
                  className="w-full"
                >
                  {isLoading ? "Connecting..." : "Connect Apple Health"}
                </Button>
              ) : (
                <Button 
                  onClick={() => handleDisconnect('appleHealth')} 
                  variant="outline"
                  className="w-full"
                >
                  Disconnect
                </Button>
              )}
              {!isIOS && !integrations.appleHealth && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Only available on iOS devices
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fitness Data Display */}
        {fitnessData && (integrations.googleFit || integrations.appleHealth) && (
          <>
            {/* Date Selector */}
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <Badge variant="outline">Today</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Steps Card - Main Feature */}
            <Card className={cn(
              "border-none shadow-xl overflow-hidden relative",
              isGoalReached && "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
            )}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center",
                      isGoalReached 
                        ? "bg-green-100 dark:bg-green-900/30" 
                        : "bg-primary/10"
                    )}>
                      <Footprints className={cn(
                        "w-7 h-7",
                        isGoalReached ? "text-green-600 dark:text-green-400" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Steps Today</CardTitle>
                      <CardDescription>Keep moving, mama!</CardDescription>
                    </div>
                  </div>
                  {isGoalReached && (
                    <Badge className="bg-green-500 text-white">
                      <Target className="w-3 h-3 mr-1" />
                      Goal Reached!
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Steps Count */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-foreground mb-2">
                    {fitnessData.steps.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground">
                    of {fitnessData.goal.toLocaleString()} steps goal
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={stepsProgress} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{Math.round(stepsProgress)}% complete</span>
                    <span>{(fitnessData.goal - fitnessData.steps).toLocaleString()} steps to go</span>
                  </div>
                </div>

                {/* Motivational Message */}
                <div className={cn(
                  "p-4 rounded-lg border-l-4",
                  isGoalReached 
                    ? "bg-green-50 dark:bg-green-950/20 border-green-500" 
                    : "bg-primary/5 border-primary"
                )}>
                  <p className="text-sm text-foreground">
                    {isGoalReached 
                      ? "🎉 Amazing! You've reached your daily goal. Your dedication to staying active is inspiring!"
                      : stepsProgress > 75
                      ? "💪 You're so close! Just a few more steps to reach your goal!"
                      : stepsProgress > 50
                      ? "🚶‍♀️ Great progress! You're halfway there. Keep it up!"
                      : "🌟 Every step counts! Take a short walk to boost your mood and energy."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Distance */}
              <Card className="border-none shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-muted-foreground">Distance</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{fitnessData.distance}</div>
                  <p className="text-xs text-muted-foreground">kilometers</p>
                </CardContent>
              </Card>

              {/* Calories */}
              <Card className="border-none shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-muted-foreground">Calories</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{fitnessData.calories}</div>
                  <p className="text-xs text-muted-foreground">kcal burned</p>
                </CardContent>
              </Card>

              {/* Active Minutes */}
              <Card className="border-none shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Active Time</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{fitnessData.activeMinutes}</div>
                  <p className="text-xs text-muted-foreground">minutes</p>
                </CardContent>
              </Card>

              {/* Heart Rate */}
              <Card className="border-none shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-muted-foreground">Heart Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{fitnessData.heartRate}</div>
                  <p className="text-xs text-muted-foreground">bpm avg</p>
                </CardContent>
              </Card>
            </div>

            {/* Health Tips */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-secondary/5 via-card to-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Health Tips for New Moms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                  <span className="text-2xl">🚶‍♀️</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Take short walks</p>
                    <p className="text-xs text-muted-foreground">Even 10-15 minutes can boost your mood and energy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                  <span className="text-2xl">💧</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Stay hydrated</p>
                    <p className="text-xs text-muted-foreground">Drink water before, during, and after physical activity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                  <span className="text-2xl">😴</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Rest when needed</p>
                    <p className="text-xs text-muted-foreground">Listen to your body and don't overdo it</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!fitnessData && !integrations.googleFit && !integrations.appleHealth && (
          <Card className="border-none shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Connect Your Fitness Tracker
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Link your Google Fit or Apple Health account to track your daily activity and stay motivated on your wellness journey.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-center pt-4">
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
