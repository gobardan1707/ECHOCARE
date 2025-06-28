"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Volume2,
  Shield,
  Globe,
  Star,
  MessageSquare,
  TrendingUp,
  Award,
  Languages,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()

  const handleTryNow = () => {
    // Redirect to the new patient creation page
    router.push("/patients/new")
  }

  const features = [
    {
      icon: <Volume2 className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Ultra-Realistic Voice Cloning",
      description: "Create authentic family member voices using Murf AI's advanced neural networks",
      highlight: "Murf AI Powered",
    },
    {
      icon: <Brain className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Emotional Intelligence",
      description: "AI adapts tone and empathy based on patient responses and health status",
      highlight: "Smart AI",
    },
    {
      icon: <Languages className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Multi-Language Support",
      description: "Support for 20+ languages with native pronunciation and cultural nuances",
      highlight: "Global Ready",
    },
    {
      icon: <Activity className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Real-Time Health Monitoring",
      description: "Continuous health status tracking with intelligent medication adherence insights",
      highlight: "Live Monitoring",
    },
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
      title: "HIPAA Compliant Security",
      description: "Enterprise-grade security ensuring complete patient data protection",
      highlight: "Secure",
    },
    {
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive insights into medication patterns and health trends",
      highlight: "Data Driven",
    },
  ]

  const howItWorksSteps = [
    {
      step: "01",
      title: "Patient Registration",
      description: "Add patient details, medical history, and contact information to create comprehensive profiles",
      icon: <Users className="w-8 h-8 md:w-12 md:h-12" />,
      details: [
        "Secure patient data collection",
        "Medical history integration",
        "Emergency contact setup",
        "Medication schedule planning",
      ],
    },
    {
      step: "02",
      title: "Voice Clone Creation",
      description:
        "Upload family member voice samples to create personalized, comforting reminder voices using Murf AI",
      icon: <Mic className="w-8 h-8 md:w-12 md:h-12" />,
      details: [
        "High-quality voice recording",
        "Murf AI neural processing",
        "Voice quality optimization",
        "Multi-language voice support",
      ],
    },
    {
      step: "03",
      title: "Smart Scheduling",
      description: "Set up automated medication reminders with intelligent timing and personalized messaging",
      icon: <Calendar className="w-8 h-8 md:w-12 md:h-12" />,
      details: [
        "Flexible scheduling options",
        "Timezone-aware reminders",
        "Recurring call patterns",
        "Priority-based calling",
      ],
    },
    {
      step: "04",
      title: "AI-Powered Calls",
      description: "Automated calls using cloned voices with intelligent health check-ins and medication reminders",
      icon: <Phone className="w-8 h-8 md:w-12 md:h-12" />,
      details: [
        "Natural conversation flow",
        "Emotional tone adaptation",
        "Real-time response analysis",
        "Emergency escalation protocols",
      ],
    },
    {
      step: "05",
      title: "Health Monitoring",
      description: "Real-time analysis of patient responses, medication adherence, and health status tracking",
      icon: <Activity className="w-8 h-8 md:w-12 md:h-12" />,
      details: ["Sentiment analysis", "Adherence tracking", "Health trend monitoring", "Predictive health insights"],
    },
    {
      step: "06",
      title: "Comprehensive Analytics",
      description: "Detailed reports and insights for healthcare providers with actionable recommendations",
      icon: <BarChart3 className="w-8 h-8 md:w-12 md:h-12" />,
      details: [
        "Patient compliance reports",
        "Health outcome tracking",
        "Voice quality metrics",
        "Care optimization insights",
      ],
    },
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Geriatrician",
      hospital: "Mayo Clinic",
      quote:
        "EchoCare has revolutionized how we manage medication adherence. The voice cloning technology is incredible.",
      rating: 5,
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Cardiologist",
      hospital: "Johns Hopkins",
      quote: "Our patients love hearing their family members' voices. Adherence rates have improved by 40%.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "Family Medicine",
      hospital: "Cleveland Clinic",
      quote: "The AI insights help us identify health issues before they become critical. Game-changing technology.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 echocare-shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-3 md:space-x-4">
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
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-gray-900 transition-colors">
                Demo
              </Link>
              <Button onClick={handleTryNow} className="modern-button echocare-gradient">
                Try Now
              </Button>
            </nav>
            <div className="md:hidden">
              <Button onClick={handleTryNow} size="sm" className="rounded-xl echocare-gradient">
                Try Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-4 md:mb-6 px-4 py-2 rounded-full border-blue-200 bg-blue-50">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by Murf AI
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                Transform Patient Care with <span className="echocare-gradient-text">AI-Powered Voice Technology</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0">
                Revolutionize medication adherence with personalized voice reminders using family members' voices,
                intelligent health monitoring, and comprehensive analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button onClick={handleTryNow} size="lg" className="modern-button echocare-gradient text-lg px-8">
                  Try Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" asChild className="rounded-2xl bg-transparent text-lg px-8">
                  <Link href="/demo">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  20+ Languages
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  99.9% Uptime
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl p-6 md:p-8 echocare-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 echocare-gradient rounded-2xl flex items-center justify-center">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Calling John Smith</p>
                      <p className="text-sm text-gray-600">Medication Reminder</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 rounded-xl">Active</Badge>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Sarah's Voice (Daughter)</span>
                    </div>
                    <p className="text-sm text-blue-700 italic">
                      "Hi Dad, it's time for your morning medication. How are you feeling today?"
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">Patient Response</span>
                    </div>
                    <p className="text-sm text-gray-700">"I'm feeling good today, just took my pills."</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Voice Quality:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="echocare-gradient h-2 rounded-full w-full"></div>
                      </div>
                      <span className="font-semibold text-green-600">98%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 bg-blue-200 rounded-full opacity-20 floating-element"></div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 md:w-20 md:h-20 bg-cyan-200 rounded-full opacity-20 floating-element"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 rounded-full border-purple-200 bg-purple-50">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Revolutionary Healthcare Technology
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Combining cutting-edge Murf AI voice synthesis with intelligent healthcare monitoring for unprecedented
              patient care.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="modern-card hover:echocare-glow transition-all duration-300 group">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-1 rounded-lg">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-12 md:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 rounded-full border-green-200 bg-green-50">
              <Zap className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              How EchoCare Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              From patient registration to comprehensive analytics - our streamlined process ensures optimal care
              delivery.
            </p>
          </div>
          <div className="space-y-8 md:space-y-12">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 lg:gap-12`}
              >
                <div className="flex-1 w-full">
                  <Card className="modern-card h-full">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 echocare-gradient rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl">
                          {step.step}
                        </div>
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed">{step.description}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex-1 w-full flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
                      <div className="w-32 h-32 md:w-40 md:h-40 echocare-gradient rounded-2xl flex items-center justify-center text-white">
                        {step.icon}
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-200 rounded-full opacity-30 floating-element"></div>
                    <div
                      className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-200 rounded-full opacity-30 floating-element"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 rounded-full border-yellow-200 bg-yellow-50">
              <Award className="w-4 h-4 mr-2" />
              Trusted by Healthcare Professionals
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              What Healthcare Providers Say
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Leading healthcare institutions trust EchoCare to improve patient outcomes and medication adherence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="modern-card hover:echocare-glow transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 echocare-gradient rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.hospital}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="modern-card bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 md:p-12 lg:p-16 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                  Ready to Transform Patient Care?
                </h2>
                <p className="text-lg md:text-xl mb-8 md:mb-10 opacity-90">
                  Join thousands of healthcare providers using EchoCare to improve medication adherence and patient
                  outcomes with AI-powered voice technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleTryNow}
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 modern-button text-lg px-8"
                  >
                    Try Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-white text-white hover:bg-white hover:text-blue-600 rounded-2xl text-lg px-8 bg-transparent"
                  >
                    <Link href="/demo">
                      <Play className="w-5 h-5 mr-2" />
                      Watch Demo
                    </Link>
                  </Button>
                </div>
                <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm opacity-80">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    No Setup Fees
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    30-Day Free Trial
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Cancel Anytime
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/echocare-logo.jpg"
                  alt="EchoCare Logo"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
                <div>
                  <h3 className="text-xl font-bold">EchoCare</h3>
                  <p className="text-sm text-gray-400">AI Healthcare Companion</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transforming patient care with AI-powered voice technology, intelligent health monitoring, and
                comprehensive analytics.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 EchoCare. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">Powered by Murf AI Technology</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
