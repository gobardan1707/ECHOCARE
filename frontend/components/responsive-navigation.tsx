"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  Bell,
  User,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Menu,
  Phone,
  Home,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: string | number
  urgent?: boolean
  tooltip: string
}

export function ResponsiveNavigation() {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState(3)
  const [pendingCalls, setPendingCalls] = useState(5)
  const [missedCalls, setMissedCalls] = useState(2)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("echocare_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

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
      icon: <Home className="w-5 h-5" />,
      href: "/dashboard",
      tooltip: "Main dashboard overview",
    },
    // {
    //   id: "schedule-call",
    //   label: "Schedule Call",
    //   icon: <Calendar className="w-5 h-5" />,
    //   href: "/calls/schedule",
    //   badge: pendingCalls > 0 ? pendingCalls : undefined,
    //   tooltip: "Schedule new medication reminder calls",
    // },
    {
      id: "patient-summaries",
      label: "Patients",
      icon: <Users className="w-5 h-5" />,
      href: "/patients",
      tooltip: "View and manage patient profiles",
    },
    // {
    //   id: "call-logs",
    //   label: "Call Logs",
    //   icon: <Phone className="w-5 h-5" />,
    //   href: "/calls",
    //   tooltip: "View detailed call history and recordings",
    // },
    // {
    //   id: "adherence-report",
    //   label: "Analytics",
    //   icon: <BarChart3 className="w-5 h-5" />,
    //   href: "/analytics",
    //   tooltip: "Medication compliance analytics and insights",
    // },
    // {
    //   id: "system-settings",
    //   label: "Settings",
    //   icon: <Settings className="w-5 h-5" />,
    //   href: "/settings",
    //   tooltip: "Configure system preferences and integrations",
    // },
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

  const handleLogout = () => {
    localStorage.removeItem("echocare_user")
    window.location.href = "/"
  }

  return (
    <TooltipProvider>
      {/* Desktop Navigation */}
      <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-50 echocare-shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <Link href="/dashboard" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div className="relative">
                <Image
                  src="/images/echocare-logo.jpg"
                  alt="EchoCare Logo"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold echocare-gradient-text">EchoCare</h1>
                <p className="text-xs text-gray-500">AI Healthcare Companion</p>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className={`relative h-14 px-6 flex flex-col items-center justify-center min-w-[110px] rounded-2xl transition-all duration-300 ${
                          isActive(item.href)
                            ? "echocare-gradient text-white hover:opacity-90 echocare-glow"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {item.icon}
                          {item.badge && (
                            <Badge
                              variant={item.urgent ? "destructive" : "secondary"}
                              className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center text-xs rounded-full"
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
            <div className="flex items-center space-x-4">
              {/* System Status Indicators */}
              <div className="flex items-center space-x-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">All Systems Online</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>All systems operational</p>
                  </TooltipContent>
                </Tooltip>

                {/* {missedCalls > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/calls?filter=missed">
                        <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-medium text-red-700">{missedCalls} Missed Calls</span>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Missed calls requiring follow-up</p>
                    </TooltipContent>
                  </Tooltip>
                )} */}
              </div>

              {/* Notifications */}
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative rounded-xl">
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full echocare-gradient">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>System notifications and alerts</p>
                </TooltipContent>
              </Tooltip> */}

              {/* User Menu */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-3 rounded-xl px-4 py-2 h-12">
                    <div className="w-10 h-10 echocare-gradient rounded-xl flex items-center justify-center text-white font-bold">
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "DR"}
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-medium block">{user?.name || "Doctor"}</span>
                      <span className="text-xs text-gray-500">{user?.specialty || "Healthcare Professional"}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl">
                  <DropdownMenuLabel className="text-center py-4">
                    <div className="w-12 h-12 echocare-gradient rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-2">
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "DR"}
                    </div>
                    <p className="font-medium">{user?.name || "Healthcare Professional"}</p>
                    <p className="text-xs text-gray-500">{user?.specialty || "Doctor"}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-xl">
                    <User className="w-4 h-4 mr-3" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl">
                    <Settings className="w-4 h-4 mr-3" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 rounded-xl" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 echocare-shadow">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image
                src="/images/echocare-logo.jpg"
                alt="EchoCare Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold echocare-gradient-text">EchoCare</span>
            </Link>

            <div className="flex items-center space-x-2">
              {/* Mobile Notifications */}
              <Button variant="ghost" size="sm" className="relative rounded-xl">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full echocare-gradient">
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 echocare-gradient rounded-xl flex items-center justify-center text-white font-bold">
                        {user?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "DR"}
                      </div>
                      <div>
                        <p className="font-medium">{user?.name || "Healthcare Professional"}</p>
                        <p className="text-sm text-gray-500">{user?.specialty || "Doctor"}</p>
                      </div>
                    </div>
                  </div>
                  <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => (
                      <Link key={item.id} href={item.href}>
                        <Button
                          variant={isActive(item.href) ? "default" : "ghost"}
                          className={`w-full justify-start h-12 rounded-xl ${
                            isActive(item.href) ? "echocare-gradient text-white" : ""
                          }`}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </Link>
                    ))}
                  </nav>
                  <div className="absolute bottom-6 left-4 right-4">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 echocare-shadow">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navigationItems.slice(0, 4).map((item) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full h-16 flex flex-col items-center justify-center rounded-xl relative ${
                    isActive(item.href) ? "text-blue-600 bg-blue-50" : "text-gray-600"
                  }`}
                >
                  <div className="relative">
                    {item.icon}
                    {item.badge && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
