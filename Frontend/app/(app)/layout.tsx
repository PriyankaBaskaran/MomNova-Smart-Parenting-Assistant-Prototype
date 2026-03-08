"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppFooter } from "@/components/layout/app-footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Fixed Header */}
        <AppHeader />

        <div className="flex-1 flex pt-16">
          {/* Fixed Desktop Sidebar */}
          <AppSidebar />

          {/* Main Content - Scrollable */}
          <main className="flex-1 flex flex-col overflow-y-auto lg:ml-64">
            <div className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-6xl mx-auto w-full">
              {children}
            </div>
            
            {/* Desktop Footer */}
            <AppFooter />
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </ProtectedRoute>
  )
}
