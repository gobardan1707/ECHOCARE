"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Phone,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Pill,
  ArrowRight,
  Plus,
  Stethoscope,
  Volume2,
  Brain,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { ResponsiveNavigation } from "@/components/responsive-navigation"
import { usePatients } from "@/components/patient-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { patients } = usePatients()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  // Check authentication
  useEffect(() => {
    const userData = localStorage.getItem("echocare_user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Redirect to home if not authenticated
      router.push("/")
    }
  }, [router])

  // Enhanced mock data for demo
  const stats = {
    totalPatients: patients.length,
    scheduledCalls: 8,
    completedToday: 12,
    adherenceRate: 94,
    voiceQuality: 97.2,
  }

  const recentCalls = [
    {
      id: 1,
      patient: "John Smith",
      time: "08:00 AM",
      status: "completed",
      medication: "Lisinopril",
      sentiment: "positive",
      voiceClone: "Daughter - Sarah",
      voiceQuality: 98,
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      time: "08:30 AM",
      status: "completed",
      medication: "Atorvastatin",
      sentiment: "neutral",
      voiceClone: "Son - Michael",
      voiceQuality: 96,
    },
    {
      id: 3,
      patient: "Mike Davis",
      time: "09:00 AM",
      status: "missed",
      medication: "Metformin",
      sentiment: null,
      voiceClone: "Wife - Linda",
      voiceQuality: null,
    },
    {
      id: 4,
      patient: "Lisa Brown",
      time: "09:30 AM",
      status: "scheduled",
      medication: "Insulin",
      sentiment: null,
      voiceClone: "Husband - David",
      voiceQuality: null,
    },
  ]

  const upcomingCalls = [
    {
      id: 1,
      patient: "John Smith",
      time: "08:00 PM",
      medication: "Metformin",
      priority: "normal",
      voiceClone: "Daughter - Sarah",
    },
    {
      id: 2,
      patient: "Emma Wilson",
      time: "09:00 PM",
      medication: "Warfarin",
      priority: "high",
      voiceClone: "Son - Robert",
    },
    {
      id: 3,
      patient: "David Lee",
      time: "10:00 PM",
      medication: "Amlodipine",
      priority: "normal",
      voiceClone: "Wife - Maria",
    },
  ]

  const criticalAlerts = [
    { id: 1, patient: "Mike Davis", issue: "Missed 2 consecutive calls", severity: "high" },
    { id: 2, patient: "Emma Wilson", issue: "Reported side effects", severity: "medium" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "missed":
        return "bg-red-100 text-red-800 border-red-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return <div className="w-3 h-3 bg-green-500 rounded-full" />
      case "neutral":
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" />
      case "negative":
        return <div className="w-3 h-3 bg-red-500 rounded-full" />
      default:
        return <div className="w-3 h-3 bg-gray-300 rounded-full" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 echocare-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pb-20 lg:pb-0">
        <ResponsiveNavigation />

        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Enhanced Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 echocare-gradient rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Welcome back, Dr. {user.name.split(" ")[1]}
                </h1>
                <p className="text-gray-600 text-lg">
                  {user.specialty} • {user.hospital}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Murf AI Highlight */}
            <Card className="modern-card bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Murf AI Voice System Active</h3>
                      <p className="text-sm text-gray-600">
                        All voice clones operational • Average quality: {stats.voiceQuality}%
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="px-4 py-2 rounded-xl">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Powered
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <Card className="mb-8 border-red-200 bg-red-50 modern-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {criticalAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-red-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            alert.severity === "high" ? "bg-red-500" : "bg-orange-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{alert.patient}</p>
                          <p className="text-sm text-gray-600">{alert.issue}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-xl bg-white">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="modern-card hover:echocare-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
                    <p className="text-xs text-green-600 mt-1">+3 this week</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card hover:echocare-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scheduled Today</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.scheduledCalls}</p>
                    <p className="text-xs text-blue-600 mt-1">Next at 6:00 PM</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card hover:echocare-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completedToday}</p>
                    <p className="text-xs text-green-600 mt-1">85% success rate</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card hover:echocare-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.adherenceRate}%</p>
                    <p className="text-xs text-green-600 mt-1">+2% improvement</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card hover:echocare-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Voice Quality</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.voiceQuality}%</p>
                    <p className="text-xs text-purple-600 mt-1">Murf AI Powered</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Calls */}
            <div className="lg:col-span-2">
              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Recent Calls
                    </CardTitle>
                    <CardDescription>Latest medication reminder calls with AI insights</CardDescription>
                  </div>
                  <Button variant="outline" asChild className="rounded-xl bg-transparent">
                    <Link href="/calls">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCalls.map((call) => (
                      <div
                        key={call.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="echocare-gradient text-white font-bold text-sm">
                              {call.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{call.patient}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Pill className="w-3 h-3" />
                              <span>{call.medication}</span>
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              <span>{call.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                              <Volume2 className="w-3 h-3" />
                              <span>{call.voiceClone}</span>
                              {call.voiceQuality && (
                                <>
                                  <span>•</span>
                                  <span>Quality: {call.voiceQuality}%</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Tooltip>
                            <TooltipTrigger>{getSentimentIcon(call.sentiment)}</TooltipTrigger>
                            <TooltipContent>
                              <p>Patient sentiment: {call.sentiment || "Unknown"}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Badge className={`${getStatusColor(call.status)} rounded-xl px-3 py-1`}>{call.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start modern-button echocare-gradient">
                    <Link href="/calls/schedule">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule New Call
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start rounded-xl bg-transparent">
                    <Link href="/patients/new">
                      <Users className="w-4 h-4 mr-2" />
                      Add Patient
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start rounded-xl bg-transparent">
                    <Link href="/analytics">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-start rounded-xl bg-transparent">
                    <Link href="/voice-clone">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Create Voice Clone
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Calls */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                        <div>
                          <p className="font-medium text-sm">{call.patient}</p>
                          <p className="text-xs text-gray-600">{call.medication}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                            <Volume2 className="w-3 h-3" />
                            <span>{call.voiceClone}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{call.time}</p>
                          <Badge
                            variant={call.priority === "high" ? "destructive" : "secondary"}
                            className="text-xs rounded-lg"
                          >
                            {call.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="modern-card bg-gradient-to-br from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-white rounded-xl border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-1">Murf AI Performance</p>
                    <p className="text-xs text-gray-600">Voice recognition accuracy improved by 3% this week</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-1">Patient Engagement</p>
                    <p className="text-xs text-gray-600">Patients respond 40% better to family voice clones</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-1">Adherence Trend</p>
                    <p className="text-xs text-gray-600">Overall medication compliance up 8% this month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
