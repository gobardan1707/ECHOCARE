"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  Mic,
  BarChart3,
  Play,
  Sparkles,
  Heart,
  Phone,
  Brain,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  completed?: boolean
  estimated_time: string
  difficulty: "Easy" | "Medium" | "Advanced"
}

export function OnboardingFlow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const router = useRouter()

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "add-patient",
      title: "Add Your First Patient",
      description: "Register a patient with their contact details and medical information",
      icon: <Users className="w-6 h-6" />,
      href: "/patients/new",
      estimated_time: "3 min",
      difficulty: "Easy",
    },
    {
      id: "create-voice",
      title: "Create Voice Clone",
      description: "Upload a loved one's voice sample to create personalized reminders",
      icon: <Mic className="w-6 h-6" />,
      href: "/voice-studio",
      estimated_time: "5 min",
      difficulty: "Easy",
    },
    {
      id: "schedule-call",
      title: "Schedule First Call",
      description: "Set up automated medication reminder calls with AI health check-ins",
      icon: <Calendar className="w-6 h-6" />,
      href: "/calls/schedule",
      estimated_time: "4 min",
      difficulty: "Medium",
    },
    {
      id: "test-system",
      title: "Test the System",
      description: "Send a test call to verify everything works perfectly",
      icon: <Phone className="w-6 h-6" />,
      href: "/calls/schedule?test=true",
      estimated_time: "2 min",
      difficulty: "Easy",
    },
    {
      id: "view-analytics",
      title: "Explore Analytics",
      description: "Discover health insights and medication adherence reports",
      icon: <BarChart3 className="w-6 h-6" />,
      href: "/analytics",
      estimated_time: "3 min",
      difficulty: "Easy",
    },
  ]

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const handleStartStep = (step: OnboardingStep) => {
    router.push(step.href)
    onClose()
  }

  const handleSkipOnboarding = () => {
    router.push("/dashboard")
    onClose()
  }

  const progressPercentage = (completedSteps.length / onboardingSteps.length) * 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Welcome to VoiceCare AI</DialogTitle>
              <DialogDescription className="text-base">
                Let's get you started with the most advanced voice-based health companion system
              </DialogDescription>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Setup Progress</span>
              <span className="font-medium">
                {completedSteps.length} of {onboardingSteps.length} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Demo Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Quick Demo Available</h3>
                  <p className="text-gray-600 mb-3">
                    See VoiceCare AI in action with pre-loaded demo data and sample voice calls
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
                      <Play className="w-4 h-4 mr-2" />
                      View Demo Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/calls?demo=true")}>
                      Listen to Sample Calls
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Complete Setup (Optional)</h3>
            <div className="grid gap-4">
              {onboardingSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id)
                const isCurrent = index === currentStep && !isCompleted

                return (
                  <Card
                    key={step.id}
                    className={`transition-all ${
                      isCompleted
                        ? "bg-green-50 border-green-200"
                        : isCurrent
                          ? "bg-blue-50 border-blue-200 shadow-md"
                          : "hover:shadow-md"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-green-100 text-green-600"
                              : isCurrent
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-6 h-6" /> : step.icon}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{step.title}</h4>
                            <Badge variant={step.difficulty === "Easy" ? "secondary" : "outline"}>
                              {step.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {step.estimated_time}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Button onClick={() => handleStartStep(step)} size="sm">
                              {isCurrent ? "Continue" : "Start"}
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Key Features Highlight */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Loved One's Voice</h4>
              <p className="text-sm text-gray-600">Use familiar voices for medication reminders</p>
            </Card>

            <Card className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">AI Health Analysis</h4>
              <p className="text-sm text-gray-600">Intelligent health monitoring and insights</p>
            </Card>

            <Card className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Real-time Calls</h4>
              <p className="text-sm text-gray-600">Automated Twilio-powered medication reminders</p>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleSkipOnboarding}>
              Skip Setup - Go to Dashboard
            </Button>
            <div className="flex gap-2">
              {completedSteps.length === onboardingSteps.length ? (
                <Button onClick={() => router.push("/dashboard")} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setup Complete - Enter Dashboard
                </Button>
              ) : (
                <Button onClick={() => handleStartStep(onboardingSteps[currentStep])}>
                  Continue Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
