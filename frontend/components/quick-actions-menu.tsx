"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Plus,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Phone,
  Bell,
  Zap,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Mic,
  Brain,
  Heart,
  X,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface QuickAction {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  badge?: string
  urgent?: boolean
  shortcut?: string
}

export function QuickActionsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isMinimized, setIsMinimized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Mock real-time data
  const [stats, setStats] = useState({
    pendingCalls: 5,
    missedCalls: 2,
    urgentAlerts: 1,
    newPatients: 3,
  })

  // Update stats periodically for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        pendingCalls: Math.max(0, prev.pendingCalls + Math.floor(Math.random() * 3) - 1),
        missedCalls: Math.max(0, prev.missedCalls + Math.floor(Math.random() * 2) - 1),
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const quickActions: QuickAction[] = [
    {
      id: "schedule-call",
      label: "Schedule Call",
      description: "Set up new medication reminder calls",
      icon: <Calendar className="w-4 h-4" />,
      href: "/calls/schedule",
      badge: stats.pendingCalls > 0 ? stats.pendingCalls.toString() : undefined,
      shortcut: "Ctrl+N",
    },
    {
      id: "add-patient",
      label: "Add Patient",
      description: "Register new patient with voice preferences",
      icon: <Plus className="w-4 h-4" />,
      href: "/patients/new",
      badge: stats.newPatients > 0 ? "New" : undefined,
      shortcut: "Ctrl+P",
    },
    {
      id: "emergency-call",
      label: "Emergency Call",
      description: "Initiate immediate health check call",
      icon: <Phone className="w-4 h-4" />,
      onClick: () => handleEmergencyCall(),
      urgent: true,
      shortcut: "Ctrl+E",
    },
    {
      id: "patient-summary",
      label: "Patient Summary",
      description: "View comprehensive patient health reports",
      icon: <Users className="w-4 h-4" />,
      href: "/patients",
      shortcut: "Ctrl+U",
    },
    {
      id: "adherence-report",
      label: "Adherence Report",
      description: "Medication compliance analytics and insights",
      icon: <BarChart3 className="w-4 h-4" />,
      href: "/analytics",
      shortcut: "Ctrl+R",
    },
    {
      id: "voice-studio",
      label: "Voice Studio",
      description: "Create and manage Murf AI voice clones",
      icon: <Mic className="w-4 h-4" />,
      href: "/voice-studio",
      shortcut: "Ctrl+V",
    },
    {
      id: "ai-insights",
      label: "AI Insights",
      description: "Health trends and predictive analytics",
      icon: <Brain className="w-4 h-4" />,
      href: "/insights",
      badge: "Beta",
      shortcut: "Ctrl+I",
    },
    {
      id: "missed-calls",
      label: "Missed Calls",
      description: "Follow up on missed medication reminders",
      icon: <AlertTriangle className="w-4 h-4" />,
      href: "/calls?filter=missed",
      badge: stats.missedCalls > 0 ? stats.missedCalls.toString() : undefined,
      urgent: stats.missedCalls > 0,
      shortcut: "Ctrl+M",
    },
  ]

  const systemActions: QuickAction[] = [
    {
      id: "notifications",
      label: "Notifications",
      description: "System alerts and patient updates",
      icon: <Bell className="w-4 h-4" />,
      href: "/notifications",
      badge: notifications > 0 ? notifications.toString() : undefined,
    },
    {
      id: "settings",
      label: "Settings",
      description: "System configuration and preferences",
      icon: <Settings className="w-4 h-4" />,
      href: "/settings",
    },
  ]

  const handleEmergencyCall = () => {
    // Mock emergency call functionality
    alert("Emergency call feature activated! Select a patient to initiate immediate health check.")
    router.push("/patients?emergency=true")
  }

  const handleQuickAction = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick()
    } else if (action.href) {
      router.push(action.href)
    }
    setIsOpen(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const action = quickActions.find((a) => a.shortcut === `Ctrl+${e.key.toUpperCase()}`)
        if (action) {
          e.preventDefault()
          handleQuickAction(action)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []) // Removed quickActions from dependency array

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsMinimized(false)}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Zap className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quick Actions Menu</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm">Quick Actions</h3>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-6 w-6 p-0">
                      <X className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Minimize</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-green-50 p-2 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">Active</span>
              </div>
              <p className="text-lg font-bold text-green-600">24</p>
              <p className="text-xs text-green-600">Patients</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Today</span>
              </div>
              <p className="text-lg font-bold text-blue-600">{stats.pendingCalls}</p>
              <p className="text-xs text-blue-600">Pending</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Primary Actions</h4>
            {quickActions.slice(0, 4).map((action) => (
              <TooltipProvider key={action.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start h-auto p-2 ${
                        action.urgent ? "bg-red-50 hover:bg-red-100 border border-red-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleQuickAction(action)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-1 rounded ${action.urgent ? "bg-red-100" : "bg-gray-100"}`}>
                          {action.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{action.label}</p>
                          <p className="text-xs text-gray-500 truncate">{action.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {action.badge && (
                            <Badge variant={action.urgent ? "destructive" : "secondary"} className="text-xs px-1 py-0">
                              {action.badge}
                            </Badge>
                          )}
                          {action.shortcut && (
                            <span className="text-xs text-gray-400 font-mono">
                              {action.shortcut.replace("Ctrl+", "⌘")}
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{action.description}</p>
                    {action.shortcut && <p className="text-xs opacity-75">Shortcut: {action.shortcut}</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <Separator className="my-3" />

          {/* Secondary Actions */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">More Actions</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-transparent">
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    More Options
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {quickActions.length - 4}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>Additional Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {quickActions.slice(4).map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center gap-3 p-3"
                  >
                    <div className="p-1 bg-gray-100 rounded">{action.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {systemActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center gap-3 p-3"
                  >
                    <div className="p-1 bg-gray-100 rounded">{action.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Current Page Context */}
          {pathname !== "/" && (
            <>
              <Separator className="my-3" />
              <div className="bg-blue-50 p-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Current Page</span>
                </div>
                <p className="text-xs text-blue-600">
                  {pathname === "/dashboard" && "Healthcare Dashboard - Monitor patient health in real-time"}
                  {pathname === "/patients" && "Patient Management - View and manage patient profiles"}
                  {pathname === "/calls" && "Call Logs - Review medication reminder call history"}
                  {pathname === "/analytics" && "Analytics - Health insights and adherence reports"}
                  {pathname.includes("/new") && "Add New Patient - Register patient with voice preferences"}
                  {pathname.includes("/schedule") && "Schedule Call - Set up medication reminders"}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
