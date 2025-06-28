"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Calendar,
  Users,
  BarChart3,
  Settings,
  Heart,
  Bell,
  User,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Menu,
  Home,
  Phone,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationItem {
  id: string
  label: string
  shortLabel: string
  icon: React.ReactNode
  href: string
  badge?: string | number
  urgent?: boolean
  tooltip: string
}

export function MobileNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [pendingCalls, setPendingCalls] = useState(5)
  const [missedCalls, setMissedCalls] = useState(2)

  // Update counters periodically for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingCalls((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      setMissedCalls((prev) => Math.max(0, prev + Math.floor(Math.random() * 2) - 1))
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      shortLabel: "Home",
      icon: <Home className="w-5 h-5" />,
      href: "/dashboard",
      tooltip: "Healthcare dashboard overview",
    },
    {
      id: "schedule-call",
      label: "Schedule Call",
      shortLabel: "Schedule",
      icon: <Calendar className="w-5 h-5" />,
      href: "/calls/schedule",
      badge: pendingCalls > 0 ? pendingCalls : undefined,
      tooltip: "Schedule new medication reminder calls",
    },
    {
      id: "patient-summaries",
      label: "Patient Summaries",
      shortLabel: "Patients",
      icon: <Users className="w-5 h-5" />,
      href: "/patients",
      tooltip: "View and manage patient profiles",
    },
    {
      id: "adherence-report",
      label: "Adherence Report",
      shortLabel: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/analytics",
      tooltip: "Medication compliance analytics and insights",
    },
    {
      id: "calls",
      label: "Call Logs",
      shortLabel: "Calls",
      icon: <Phone className="w-5 h-5" />,
      href: "/calls",
      badge: missedCalls > 0 ? missedCalls : undefined,
      urgent: missedCalls > 0,
      tooltip: "View call history and logs",
    },
  ]

  const quickActions = [
    {
      id: "add-patient",
      label: "Add Patient",
      icon: <Plus className="w-4 h-4" />,
      href: "/patients/new",
    },
    {
      id: "emergency-call",
      label: "Emergency Call",
      icon: <Phone className="w-4 h-4" />,
      href: "/calls/emergency",
    },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") return true
    if (href === "/patients" && pathname.startsWith("/patients")) return true
    if (href === "/calls/schedule" && pathname.includes("/calls/schedule")) return true
    if (href === "/calls" && pathname === "/calls") return true
    if (href === "/analytics" && pathname === "/analytics") return true
    if (href === "/settings" && pathname === "/settings") return true
    return pathname === href
  }

  return (
    <TooltipProvider>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VoiceCare AI
              </h1>
            </div>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* System Status */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-lg">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-700 hidden sm:inline">Online</span>
              </div>

              {missedCalls > 0 && (
                <Link href="/calls?filter=missed">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    <span className="text-xs font-medium text-red-700">{missedCalls}</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">Dr. Smith</p>
                        <p className="text-sm text-gray-600">Healthcare Professional</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex-1 p-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Navigation</h3>
                      {navigationItems.map((item) => (
                        <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)}>
                          <div
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              isActive(item.href) ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {item.icon}
                              <span className="font-medium">{item.label}</span>
                            </div>
                            {item.badge && (
                              <Badge
                                variant={item.urgent ? "destructive" : "secondary"}
                                className={isActive(item.href) ? "bg-white/20 text-white" : ""}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        {quickActions.map((action) => (
                          <Link key={action.id} href={action.href} onClick={() => setIsOpen(false)}>
                            <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                              {action.icon}
                              <span className="font-medium">{action.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t">
                    <div className="space-y-2">
                      <Link href="/settings" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Settings</span>
                        </div>
                      </Link>
                      <div className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Sign Out</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.slice(0, 5).map((item) => (
            <Link key={item.id} href={item.href} className="flex flex-col items-center justify-center relative">
              <div
                className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive(item.href) ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <Badge
                      variant={item.urgent ? "destructive" : "default"}
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.shortLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </TooltipProvider>
  )
}
