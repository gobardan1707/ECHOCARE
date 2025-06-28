"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      const userData = {
        id: "1",
        name: "Dr. Sarah Johnson",
        email: email,
        specialty: "Internal Medicine",
        hospital: "General Hospital",
        role: "doctor",
      }

      localStorage.setItem("echocare_user", JSON.stringify(userData))
      setIsLoading(false)
      onSuccess()
    }, 2000)
  }

  const handleDemoLogin = () => {
    setEmail("demo@echocare.ai")
    setPassword("demo123")
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }, 500)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="modern-card border-0">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 echocare-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl md:text-2xl">Healthcare Professional Login</CardTitle>
          <CardDescription>Access your EchoCare dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Login Banner */}
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Quick Demo Access</h4>
                <p className="text-sm text-blue-700">Try EchoCare with pre-loaded demo data</p>
              </div>
              <Button
                onClick={handleDemoLogin}
                size="sm"
                variant="outline"
                className="rounded-xl bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Demo Login
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-12 modern-button echocare-gradient text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sign In to Dashboard
                </>
              )}
            </Button>
          </form>

          {/* Security Features */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-900">Security Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-center py-2 rounded-xl">
                <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="justify-center py-2 rounded-xl">
                <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                256-bit Encryption
              </Badge>
            </div>
          </div>

          {/* Help Links */}
          <div className="text-center space-y-2 text-sm">
            <p className="text-gray-600">
              Need help?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </a>
            </p>
            <p className="text-gray-600">
              New to EchoCare?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Request Demo
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
