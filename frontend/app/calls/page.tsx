"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Phone,
  Search,
  Download,
  Play,
  Clock,
  Pill,
  Filter,
  TrendingUp,
  CheckCircle,
  Volume2,
  AudioWaveformIcon as Waveform,
  BarChart3,
  FileText,
  Pause,
  SkipForward,
  Rewind,
  MessageSquare,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { ResponsiveNavigation } from "@/components/responsive-navigation"

export default function CallLogsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [isPlaying, setIsPlaying] = useState<number | null>(null)

  // Enhanced mock call log data with Murf AI features
  const callLogs = [
    {
      id: 1,
      patient: "John Smith",
      medication: "Lisinopril",
      scheduledTime: "2024-01-15 08:00",
      actualTime: "2024-01-15 08:02",
      duration: "3m 24s",
      status: "completed",
      medicationTaken: true,
      healthResponse: "Feeling good today, no side effects. Blood pressure seems stable.",
      sentimentScore: 0.8,
      emotion: "positive",
      voiceQuality: 98,
      aiResponse: "Great to hear you're feeling well! Keep up the good work with your medication routine.",
      voiceCloneUsed: "Daughter - Sarah",
      transcriptAvailable: true,
      callRecording: true,
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      medication: "Atorvastatin",
      scheduledTime: "2024-01-15 09:00",
      actualTime: "2024-01-15 09:01",
      duration: "2m 45s",
      status: "completed",
      medicationTaken: true,
      healthResponse: "Had some mild dizziness yesterday, but feeling better today.",
      sentimentScore: 0.3,
      emotion: "concerned",
      voiceQuality: 96,
      aiResponse:
        "I understand your concern about dizziness. This can be a side effect. Please contact your doctor if it continues.",
      voiceCloneUsed: "Son - Michael",
      transcriptAvailable: true,
      callRecording: true,
    },
    {
      id: 3,
      patient: "Mike Davis",
      medication: "Metformin",
      scheduledTime: "2024-01-15 09:00",
      actualTime: null,
      duration: null,
      status: "missed",
      medicationTaken: null,
      healthResponse: null,
      sentimentScore: null,
      emotion: null,
      voiceQuality: null,
      aiResponse: null,
      voiceCloneUsed: "Wife - Linda",
      transcriptAvailable: false,
      callRecording: false,
    },
    {
      id: 4,
      patient: "Emma Wilson",
      medication: "Insulin",
      scheduledTime: "2024-01-15 07:30",
      actualTime: "2024-01-15 07:32",
      duration: "4m 12s",
      status: "completed",
      medicationTaken: true,
      healthResponse: "Blood sugar levels have been stable. Feeling energetic today.",
      sentimentScore: 0.7,
      emotion: "satisfied",
      voiceQuality: 99,
      aiResponse: "Excellent news about your stable blood sugar! Continue monitoring as usual.",
      voiceCloneUsed: "Husband - David",
      transcriptAvailable: true,
      callRecording: true,
    },
    {
      id: 5,
      patient: "Lisa Brown",
      medication: "Warfarin",
      scheduledTime: "2024-01-14 20:00",
      actualTime: "2024-01-14 20:15",
      duration: "5m 03s",
      status: "completed",
      medicationTaken: false,
      healthResponse: "Forgot to take it earlier, will take now. Been busy with work.",
      sentimentScore: 0.4,
      emotion: "apologetic",
      voiceQuality: 97,
      aiResponse: "No worries, it happens. Try setting a phone reminder for tomorrow. Take your dose now as planned.",
      voiceCloneUsed: "Mother - Patricia",
      transcriptAvailable: true,
      callRecording: true,
    },
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

  const getSentimentColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-600"
    if (score >= 0.6) return "bg-green-100 text-green-700"
    if (score >= 0.3) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
  }

  const getVoiceQualityColor = (quality: number | null) => {
    if (quality === null) return "text-gray-400"
    if (quality >= 95) return "text-green-600"
    if (quality >= 90) return "text-blue-600"
    return "text-orange-600"
  }

  const filteredCalls = callLogs.filter((call) => {
    if (selectedTab === "all") return true
    if (selectedTab === "completed") return call.status === "completed"
    if (selectedTab === "missed") return call.status === "missed"
    if (selectedTab === "scheduled") return call.status === "scheduled"
    return true
  })

  const handlePlayRecording = (callId: number) => {
    if (isPlaying === callId) {
      setIsPlaying(null)
    } else {
      setIsPlaying(callId)
      // Simulate stopping after 10 seconds
      setTimeout(() => setIsPlaying(null), 10000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pb-20 lg:pb-0">
      <ResponsiveNavigation />

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Enhanced Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold echocare-gradient-text mb-2">Call Logs & Analytics</h1>
              <p className="text-gray-600 text-lg">
                Comprehensive call history with AI-powered insights and Murf voice analytics
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button asChild className="modern-button echocare-gradient">
                <Link href="/calls/schedule">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule New Call
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="modern-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Calls</p>
                  <p className="text-3xl font-bold text-gray-900">{callLogs.length}</p>
                  <p className="text-xs text-green-600 mt-1">+12% this week</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(
                      (callLogs.filter((call) => call.status === "completed").length / callLogs.length) * 100,
                    )}
                    %
                  </p>
                  <p className="text-xs text-green-600 mt-1">+5% improvement</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Voice Quality</p>
                  <p className="text-3xl font-bold text-gray-900">97%</p>
                  <p className="text-xs text-blue-600 mt-1">Murf AI Powered</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                  <p className="text-3xl font-bold text-gray-900">3m 36s</p>
                  <p className="text-xs text-gray-600 mt-1">Per completed call</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="modern-card mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, medication, or voice clone..."
                  className="pl-12 rounded-xl h-12"
                />
              </div>
              <div className="flex gap-3">
                <Select>
                  <SelectTrigger className="w-40 rounded-xl h-12">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40 rounded-xl h-12">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="rounded-xl h-12 px-4 bg-transparent">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-gray-100 p-1">
            <TabsTrigger value="all" className="rounded-xl">
              All Calls ({callLogs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-xl">
              Completed ({callLogs.filter((c) => c.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="missed" className="rounded-xl">
              Missed ({callLogs.filter((c) => c.status === "missed").length})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="rounded-xl">
              Scheduled ({callLogs.filter((c) => c.status === "scheduled").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <div className="space-y-6">
              {filteredCalls.map((call) => (
                <Card key={call.id} className="modern-card hover:echocare-glow transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-12 gap-6">
                      {/* Patient Info */}
                      <div className="lg:col-span-3">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="echocare-gradient text-white font-bold">
                              {call.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-lg">{call.patient}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Pill className="w-4 h-4" />
                              {call.medication}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Scheduled:</span>
                            <span className="font-medium">{new Date(call.scheduledTime).toLocaleString()}</span>
                          </div>
                          {call.actualTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Actual:</span>
                              <span className="font-medium">{new Date(call.actualTime).toLocaleString()}</span>
                            </div>
                          )}
                          {call.voiceCloneUsed && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Voice:</span>
                              <Badge variant="outline" className="text-xs">
                                <Volume2 className="w-3 h-3 mr-1" />
                                {call.voiceCloneUsed}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Call Status & Metrics */}
                      <div className="lg:col-span-3">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Badge className={`${getStatusColor(call.status)} rounded-xl px-3 py-1`}>
                              {call.status}
                            </Badge>
                            {call.duration && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {call.duration}
                              </div>
                            )}
                          </div>

                          {call.voiceQuality && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Voice Quality:</span>
                                <span className={`font-bold ${getVoiceQualityColor(call.voiceQuality)}`}>
                                  {call.voiceQuality}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="echocare-gradient h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${call.voiceQuality}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Medication Taken:</span>
                            {call.medicationTaken === true && (
                              <Badge className="bg-green-100 text-green-800 rounded-xl">Yes</Badge>
                            )}
                            {call.medicationTaken === false && (
                              <Badge variant="destructive" className="rounded-xl">
                                No
                              </Badge>
                            )}
                            {call.medicationTaken === null && (
                              <Badge variant="secondary" className="rounded-xl">
                                N/A
                              </Badge>
                            )}
                          </div>

                          {call.sentimentScore !== null && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Sentiment:</span>
                              <Badge className={`${getSentimentColor(call.sentimentScore)} rounded-xl`}>
                                {call.emotion} ({Math.round(call.sentimentScore * 100)}%)
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Patient Response */}
                      <div className="lg:col-span-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Patient Response
                        </h4>
                        {call.healthResponse ? (
                          <div className="space-y-3">
                            <div className="bg-gray-50 p-4 rounded-2xl">
                              <p className="text-sm italic">"{call.healthResponse}"</p>
                            </div>
                            {call.aiResponse && (
                              <div className="bg-blue-50 p-4 rounded-2xl">
                                <h5 className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                                  <Brain className="w-3 h-3" />
                                  AI Response
                                </h5>
                                <p className="text-sm text-blue-800">{call.aiResponse}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No response recorded</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-2">
                        <div className="flex flex-col gap-3">
                          {call.callRecording && (
                            <Button
                              variant="outline"
                              className="rounded-xl justify-start bg-transparent"
                              onClick={() => handlePlayRecording(call.id)}
                            >
                              {isPlaying === call.id ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause Recording
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Play Recording
                                </>
                              )}
                            </Button>
                          )}

                          {call.transcriptAvailable && (
                            <Button variant="outline" className="rounded-xl justify-start bg-transparent">
                              <FileText className="w-4 h-4 mr-2" />
                              View Transcript
                            </Button>
                          )}

                          <Button variant="outline" className="rounded-xl justify-start bg-transparent" asChild>
                            <Link href={`/calls/${call.id}`}>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Detailed Analytics
                            </Link>
                          </Button>

                          {call.status === "missed" && (
                            <Button className="rounded-xl justify-start echocare-gradient">
                              <Phone className="w-4 h-4 mr-2" />
                              Retry Call
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Audio Player for Playing Calls */}
                    {isPlaying === call.id && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 echocare-gradient rounded-full flex items-center justify-center">
                              <Volume2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">Playing: {call.voiceCloneUsed} Voice</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Murf AI Quality: {call.voiceQuality}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                            <Rewind className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl bg-transparent"
                            onClick={() => setIsPlaying(null)}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                            <SkipForward className="w-4 h-4" />
                          </Button>
                          <div className="flex-1 bg-white rounded-full h-2 relative">
                            <div className="echocare-gradient h-2 rounded-full w-1/3"></div>
                          </div>
                          <span className="text-sm text-gray-600">1:12 / 3:24</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Voice Quality Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Murf AI Quality</span>
                  <span className="font-bold text-lg echocare-gradient-text">97.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="echocare-gradient h-3 rounded-full" style={{ width: "97.2%" }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Best Performance</p>
                    <p className="font-semibold">Emma Wilson - 99%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Improvement</p>
                    <p className="font-semibold text-green-600">+2.1% this week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waveform className="w-5 h-5" />
                Voice Clone Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Daughter - Sarah", "Son - Michael", "Wife - Linda", "Husband - David", "Mother - Patricia"].map(
                  (voice, index) => (
                    <div key={voice} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Volume2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">{voice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.random() * 80 + 20}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{Math.floor(Math.random() * 10 + 1)} calls</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
