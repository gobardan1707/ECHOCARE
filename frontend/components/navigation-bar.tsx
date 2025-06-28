"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: string | number
  urgent?: boolean
  tooltip: string
}

export function NavigationBar() {
  const pathname = usePathname()
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
      id: "schedule-call",
      label: "Schedule Call",
      icon: <Calendar className="w-5 h-5" />,
      href: "/calls/schedule",
      badge: pendingCalls > 0 ? pendingCalls : undefined,
      tooltip: "Schedule new medication reminder calls",
    },
    {
      id: "patient-summaries",
      label: "Patient Summaries",
      icon: <Users className="w-5 h-5" />,
      href: "/patients",
      tooltip: "View and manage patient profiles",
    },
    {
      id: "adherence-report",
      label: "Adherence Report",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/analytics",
      tooltip: "Medication compliance analytics and insights",
    },
    {
      id: "system-settings",
      label: "System Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/settings",
      tooltip: "Configure system preferences and integrations",
    },
  ]

  const isActive = (href: string) => {
    if (href === "/patients" && pathname.startsWith("/patients")) return true
    if (href === "/calls/schedule" && pathname.includes("/calls")) return true
    if (href === "/analytics" && pathname === "/analytics") return true
    if (href === "/settings" && pathname === "/settings") return true
    return pathname === href
  }

  return (
    <TooltipProvider>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VoiceCare AI
                </h1>
                <p className="text-xs text-gray-500">Healthcare Companion</p>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className={`relative h-12 px-4 flex flex-col items-center justify-center min-w-[100px] ${
                          isActive(item.href)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {item.icon}
                          {item.badge && (
                            <Badge
                              variant={item.urgent ? "destructive" : "secondary"}
                              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* System Status Indicators */}
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Online</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>All systems operational</p>
                  </TooltipContent>
                </Tooltip>

                {missedCalls > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/calls?filter=missed">
                        <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-medium text-red-700">{missedCalls} Missed</span>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Missed calls requiring follow-up</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Notifications */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>System notifications and alerts</p>
                </TooltipContent>
              </Tooltip>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Dr. Smith</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Healthcare Professional</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
