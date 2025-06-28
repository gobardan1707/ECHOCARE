"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Play,
  Pause,
  Volume2,
  Phone,
  Heart,
  Brain,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Headphones,
  MessageSquare,
  BarChart3,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"


export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState("voice-call")
  const [isPlaying, setIsPlaying] = useState(false)
  const [callProgress, setCallProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  // Simulate call progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCallProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 2
        })
      }, 200)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const demoSections = [
    {
      id: "voice-call",
      title: "AI Voice Call Demo",
      description: "Experience realistic family voice clones in action",
      icon: <Phone className="w-5 h-5" />,
    },
    {
      id: "dashboard",
      title: "Healthcare Dashboard",
      description: "Comprehensive patient management interface",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "analytics",
      title: "AI Analytics",
      description: "Intelligent insights and health monitoring",
      icon: <Brain className="w-5 h-5" />,
    },
  ]

  const callSteps = [
    {
      speaker: "AI (Sarah's Voice)",
      message: "Hi Dad, it's Sarah. It's time for your morning medication. How are you feeling today?",
      timestamp: "0:05",
      type: "ai",
    },
    {
      speaker: "John Smith",
      message: "Hi sweetheart! I'm feeling good today. Just a little tired from yesterday's walk.",
      timestamp: "0:15",
      type: "patient",
    },
    {
      speaker: "AI (Sarah's Voice)",
      message: "That's wonderful to hear! Did you remember to take your blood pressure medication this morning?",
      timestamp: "0:25",
      type: "ai",
    },
    {
      speaker: "John Smith",
      message: "Yes, I took it right after breakfast, just like you always remind me.",
      timestamp: "0:35",
      type: "patient",
    },
    {
      speaker: "AI (Sarah's Voice)",
      message: "Perfect! I'm so proud of you for staying consistent. Have a wonderful day, Dad. Love you!",
      timestamp: "0:45",
      type: "ai",
    },
  ]

  const stats = [
    { label: "Voice Quality", value: "98%", color: "text-green-600" },
    { label: "Patient Satisfaction", value: "96%", color: "text-blue-600" },
    { label: "Adherence Rate", value: "94%", color: "text-purple-600" },
    { label: "Response Time", value: "1.2s", color: "text-orange-600" },
  ]

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying)
    setCurrentStep(0)
    setCallProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 echocare-shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3 md:space-x-4">
              <Image
                src="/images/echocare-logo.jpg"
                alt="EchoCare Logo"
                width={40}
                height={40}
                className="rounded-xl md:w-12 md:h-12"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold echocare-gradient-text">EchoCare</h1>
                <p className="text-xs text-gray-500 hidden sm:block">AI Healthcare Companion</p>
              </div>
            </Link>
            <div className="flex items-center space-x-3 md:space-x-4">
              <Badge variant="outline" className="px-3 py-1 rounded-xl border-green-200 bg-green-50">
                <Sparkles className="w-3 h-3 mr-1" />
                Live Demo
              </Badge>
              <Button asChild variant="outline" className="rounded-xl bg-transparent hidden sm:inline-flex">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild className="modern-button echocare-gradient">
                <Link href="/">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2 rounded-full border-purple-200 bg-purple-50">
            <Play className="w-4 h-4 mr-2" />
            Interactive Demo
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Experience EchoCare in Action
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            See how our AI-powered voice technology transforms patient care with realistic family voice clones and
            intelligent health monitoring.
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="flex flex-col sm:flex-row justify-center mb-8 md:mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-100 p-1 rounded-2xl max-w-2xl mx-auto w-full">
            {demoSections.map((section) => (
              <Button
                key={section.id}
                variant={currentDemo === section.id ? "default" : "ghost"}
                onClick={() => setCurrentDemo(section.id)}
                className={`rounded-xl h-auto py-3 px-4 flex flex-col items-center space-y-1 ${
                  currentDemo === section.id ? "echocare-gradient text-white" : "text-gray-600"
                }`}
              >
                {section.icon}
                <span className="text-sm font-medium">{section.title}</span>
                <span className="text-xs opacity-80 hidden sm:block">{section.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-6xl mx-auto">
          {currentDemo === "voice-call" && (
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* Voice Call Interface */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 echocare-gradient rounded-2xl flex items-center justify-center">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl">Live Call Simulation</h3>
                      <p className="text-sm text-gray-600 font-normal">Medication reminder call in progress</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Patient Info */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 md:w-12 md:h-12">
                        <AvatarFallback className="echocare-gradient text-white font-bold">JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">John Smith</p>
                        <p className="text-sm text-gray-600">Age 72 • Hypertension</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 rounded-xl">Connected</Badge>
                  </div>

                  {/* Voice Clone Info */}
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-800">Using Sarah's Voice Clone</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Murf AI
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-700">Voice Quality:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-purple-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full w-full"></div>
                        </div>
                        <span className="font-semibold text-purple-800">98%</span>
                      </div>
                    </div>
                  </div>

                  {/* Call Controls */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handlePlayDemo}
                      size="lg"
                      className={`modern-button ${
                        isPlaying ? "bg-red-500 hover:bg-red-600" : "echocare-gradient"
                      } px-8`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Stop Demo
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Start Demo Call
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  {isPlaying && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Call Progress</span>
                        <span>{Math.round(callProgress)}%</span>
                      </div>
                      <Progress value={callProgress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Conversation Flow */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Conversation Transcript
                  </CardTitle>
                  <CardDescription>Real-time AI conversation with emotional intelligence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {callSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl transition-all duration-500 ${
                          isPlaying && index <= Math.floor(callProgress / 20)
                            ? "opacity-100 transform translate-x-0"
                            : "opacity-50 transform translate-x-2"
                        } ${
                          step.type === "ai"
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : "bg-gray-50 border-l-4 border-gray-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {step.type === "ai" ? (
                              <Volume2 className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Headphones className="w-4 h-4 text-gray-600" />
                            )}
                            <span className="font-medium text-sm">{step.speaker}</span>
                          </div>
                          <span className="text-xs text-gray-500">{step.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{step.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentDemo === "dashboard" && (
            <div className="space-y-6 md:space-y-8">
              {/* Dashboard Preview */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Healthcare Dashboard Preview
                  </CardTitle>
                  <CardDescription>Comprehensive patient management and monitoring interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    <div className="p-4 md:p-6 bg-blue-50 rounded-2xl text-center">
                      <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl md:text-3xl font-bold text-blue-900">24</p>
                      <p className="text-sm text-blue-700">Active Patients</p>
                    </div>
                    <div className="p-4 md:p-6 bg-green-50 rounded-2xl text-center">
                      <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl md:text-3xl font-bold text-green-900">94%</p>
                      <p className="text-sm text-green-700">Adherence Rate</p>
                    </div>
                    <div className="p-4 md:p-6 bg-purple-50 rounded-2xl text-center">
                      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl md:text-3xl font-bold text-purple-900">12</p>
                      <p className="text-sm text-purple-700">Calls Today</p>
                    </div>
                    <div className="p-4 md:p-6 bg-orange-50 rounded-2xl text-center">
                      <Volume2 className="w-6 h-6 md:w-8 md:h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl md:text-3xl font-bold text-orange-900">98%</p>
                      <p className="text-sm text-orange-700">Voice Quality</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button asChild className="modern-button echocare-gradient">
                      <Link href="/">
                        Try Full Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentDemo === "analytics" && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* AI Insights */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription>Intelligent health monitoring and predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Adherence Improvement</span>
                    </div>
                    <p className="text-sm text-green-700">
                      John Smith's medication adherence improved by 15% since using family voice clones
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Health Pattern</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Patient reports feeling "good" 85% of the time, indicating stable health status
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Volume2 className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Voice Performance</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Murf AI voice quality consistently above 95% with high patient recognition
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Real-time system performance and quality indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                        <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="echocare-gradient h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.random() * 30 + 70}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <Card className="modern-card bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 max-w-4xl mx-auto">
            <CardContent className="p-6 md:p-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                Ready to Transform Your Practice?
              </h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
                Join healthcare providers worldwide who are improving patient outcomes with EchoCare's AI-powered voice
                technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 modern-button text-lg px-8"
                >
                  <Link href="/">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 rounded-2xl text-lg px-8 bg-transparent"
                >
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
