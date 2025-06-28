"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  TrendingUp,
  Users,
  Phone,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Activity,
} from "lucide-react"
import { NavigationBar } from "@/components/navigation-bar"
import { usePatients } from "@/components/patient-context"

export default function AnalyticsPage() {
  const { patients } = usePatients()

  // Mock analytics data
  const analytics = {
    overview: {
      totalCalls: 1247,
      successfulCalls: 1089,
      missedCalls: 158,
      averageAdherence: 87.3,
      totalPatients: patients.length,
      activePatients: patients.length - 1,
    },
    trends: {
      callsThisWeek: [12, 15, 18, 14, 16, 13, 11],
      adherenceThisWeek: [89, 87, 91, 85, 88, 90, 87],
      sentimentScores: [0.7, 0.8, 0.6, 0.9, 0.7, 0.8, 0.75],
    },
    topMedications: [
      { name: "Metformin", patients: 8, adherence: 92 },
      { name: "Lisinopril", patients: 6, adherence: 89 },
      { name: "Atorvastatin", patients: 5, adherence: 85 },
      { name: "Amlodipine", patients: 4, adherence: 91 },
    ],
    healthInsights: [
      { category: "Blood Pressure", trend: "improving", patients: 12 },
      { category: "Diabetes Management", trend: "stable", patients: 8 },
      { category: "Cholesterol", trend: "improving", patients: 7 },
      { category: "Heart Health", trend: "attention", patients: 3 },
    ],
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "stable":
        return <Activity className="w-4 h-4 text-blue-600" />
      case "attention":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "bg-green-100 text-green-800"
      case "stable":
        return "bg-blue-100 text-blue-800"
      case "attention":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />

        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Medication Adherence Analytics</h1>
              <p className="text-gray-600">Comprehensive insights into patient health and medication compliance</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calls Made</CardTitle>
                <Phone className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.overview.totalCalls.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((analytics.overview.successfulCalls / analytics.overview.totalCalls) * 100)}%
                </div>
                <Progress
                  value={(analytics.overview.successfulCalls / analytics.overview.totalCalls) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Adherence</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{analytics.overview.averageAdherence}%</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3.2% from last week
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <Users className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{analytics.overview.activePatients}</div>
                <p className="text-xs text-muted-foreground">of {analytics.overview.totalPatients} total</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Medication Adherence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Top Medications by Adherence
                </CardTitle>
                <CardDescription>Medication adherence rates across patient population</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analytics.topMedications.map((med, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{med.name}</span>
                            <p className="text-sm text-gray-600">{med.patients} patients</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">{med.adherence}%</span>
                        </div>
                      </div>
                      <Progress value={med.adherence} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Health Category Insights
                </CardTitle>
                <CardDescription>Patient health trends by medical category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.healthInsights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(insight.trend)}
                        <div>
                          <h4 className="font-medium text-gray-900">{insight.category}</h4>
                          <p className="text-sm text-gray-600">{insight.patients} patients monitored</p>
                        </div>
                      </div>
                      <Badge className={getTrendColor(insight.trend)}>
                        {insight.trend === "improving" && "Improving"}
                        {insight.trend === "stable" && "Stable"}
                        {insight.trend === "attention" && "Needs Attention"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Trends */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Weekly Performance Trends
              </CardTitle>
              <CardDescription>Call volume, adherence rates, and patient sentiment over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-medium mb-4 text-gray-900">Daily Call Volume</h4>
                  <div className="space-y-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{day}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(analytics.trends.callsThisWeek[index] / 20) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-6 text-gray-900">
                            {analytics.trends.callsThisWeek[index]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-gray-900">Adherence Rate</h4>
                  <div className="space-y-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{day}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${analytics.trends.adherenceThisWeek[index]}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-gray-900">
                            {analytics.trends.adherenceThisWeek[index]}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-gray-900">Patient Sentiment</h4>
                  <div className="space-y-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{day}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${analytics.trends.sentimentScores[index] * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-gray-900">
                            {analytics.trends.sentimentScores[index].toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Summary */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Performance Metrics
                </CardTitle>
                <CardDescription>Detailed call statistics and performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Successful Calls</span>
                    <span className="font-bold text-green-600">
                      {analytics.overview.successfulCalls.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Missed Calls</span>
                    <span className="font-bold text-red-600">{analytics.overview.missedCalls}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Average Call Duration</span>
                    <span className="font-bold text-blue-600">3m 24s</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Patient Satisfaction</span>
                    <span className="font-bold text-purple-600">4.7/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Health Outcomes
                </CardTitle>
                <CardDescription>Patient health improvements and clinical outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Improved Adherence</span>
                    <span className="font-bold text-green-600">18 patients</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Health Alerts Resolved</span>
                    <span className="font-bold text-blue-600">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Emergency Interventions</span>
                    <span className="font-bold text-orange-600">2</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Family Notifications</span>
                    <span className="font-bold text-purple-600">47</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
