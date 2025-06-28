"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Play, Save, ArrowLeft, Plus, X, User, Pill } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ResponsiveNavigation } from "@/components/responsive-navigation"
import { usePatients } from "@/components/patient-context"

export default function AddNewPatientPage() {
  const router = useRouter()
  const { addPatient } = usePatients()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    language: "",
    voiceClone: "",
    address: "",
    medicalHistory: "",
  })
  const [medications, setMedications] = useState<string[]>([])
  const [currentMedication, setCurrentMedication] = useState("")
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formProgress, setFormProgress] = useState(0)

  // Mock Murf voice options
  const voiceOptions = [
    "Sarah - Warm & Caring (Female)",
    "Michael - Gentle & Reassuring (Male)",
    "Emma - Friendly & Professional (Female)",
    "David - Calm & Trustworthy (Male)",
    "Priya - Compassionate Hindi (Female)",
    "Raj - Caring Telugu (Male)",
  ]

  const languageOptions = ["English", "Hindi", "Telugu", "Tamil", "Bengali", "Spanish"]

  // Calculate form completion progress
  const calculateProgress = () => {
    const requiredFields = ["name", "phone", "language", "voiceClone"]
    const completedFields = requiredFields.filter((field) => formData[field as keyof typeof formData])
    const progress = (completedFields.length / requiredFields.length) * 100
    setFormProgress(progress)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTimeout(calculateProgress, 100)
  }

  const addMedication = () => {
    if (currentMedication.trim() && !medications.includes(currentMedication.trim())) {
      setMedications([...medications, currentMedication.trim()])
      setCurrentMedication("")
    }
  }

  const removeMedication = (med: string) => {
    setMedications(medications.filter((m) => m !== med))
  }

  const previewVoice = async () => {
    if (!formData.name || !formData.voiceClone) {
      alert("Please enter patient name and select a voice first")
      return
    }

    setIsPreviewingVoice(true)
    setTimeout(() => {
      setIsPreviewingVoice(false)
      alert(`Voice preview: "Hello ${formData.name}, this is your medication reminder. Time to take your medicine!"`)
    }, 2000)
  }

  const savePatient = async () => {
    // Validation
    if (!formData.name || !formData.phone || !formData.language || !formData.voiceClone) {
      alert("Please fill in all required fields")
      return
    }

    setIsSaving(true)

    // Create new patient
    const newPatient = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      age: formData.age ? Number.parseInt(formData.age) : undefined,
      medications,
      voiceClone: formData.voiceClone,
      language: formData.language,
    }

    // Simulate API call
    setTimeout(() => {
      addPatient(newPatient)
      setIsSaving(false)

      // Show success message and redirect to schedule call
      alert("Patient saved successfully! Redirecting to schedule a call...")
      router.push(`/calls/schedule?patient=${newPatient.id}&new=true`)
    }, 1500)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        <ResponsiveNavigation />

        <div className="container mx-auto px-4 py-4 lg:py-8">
          {/* Mobile-Optimized Page Header */}
          <div className="flex flex-col space-y-4 mb-6 lg:mb-8 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <Button variant="outline" size="sm" asChild className="self-start bg-transparent">
              <Link href="/patients">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add New Patient</h1>
              <p className="text-gray-600 text-sm lg:text-base">Create a comprehensive patient profile</p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-gray-600">Form Completion</p>
              <div className="flex items-center space-x-2 mt-1">
                <Progress value={formProgress} className="w-24 h-2" />
                <span className="text-sm font-medium">{Math.round(formProgress)}%</span>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl lg:text-2xl flex items-center">
                  <User className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                  Patient Information
                </CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  Enter comprehensive patient details for personalized medication reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 lg:space-y-8">
                {/* Basic Information */}
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center text-sm lg:text-base">
                        Full Name <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter patient's full name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="h-11 lg:h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center text-sm lg:text-base">
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        className="h-11 lg:h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm lg:text-base">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="patient@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="h-11 lg:h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm lg:text-base">
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter age"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        className="h-11 lg:h-12 text-base"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Voice & Language Settings */}
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Voice & Language Settings</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="flex items-center text-sm lg:text-base">
                        Preferred Language <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select value={formData.language} onValueChange={(value) => updateFormData("language", value)}>
                        <SelectTrigger className="h-11 lg:h-12 text-base">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((lang) => (
                            <SelectItem key={lang} value={lang.toLowerCase()}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voice" className="flex items-center text-sm lg:text-base">
                        Murf AI Voice <span className="text-red-500 ml-1">*</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="ml-1 text-gray-400">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select a voice that will be familiar and comforting to the patient</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select
                        value={formData.voiceClone}
                        onValueChange={(value) => updateFormData("voiceClone", value)}
                      >
                        <SelectTrigger className="h-11 lg:h-12 text-base">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceOptions.map((voice) => (
                            <SelectItem key={voice} value={voice}>
                              {voice}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Voice Preview - Mobile Optimized */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                      <div>
                        <h4 className="font-medium text-blue-900">Voice Preview</h4>
                        <p className="text-sm text-blue-700">Test how the selected voice will sound</p>
                      </div>
                      <Button
                        onClick={previewVoice}
                        disabled={!formData.name || !formData.voiceClone || isPreviewingVoice}
                        variant="outline"
                        className="bg-white w-full lg:w-auto"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {isPreviewingVoice ? "Playing..." : "Preview Voice"}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Medical Information */}
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Medical Information
                  </h3>

                  <div className="space-y-4">
                    <Label className="text-sm lg:text-base">Current Medications</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter medication name (e.g., Lisinopril 10mg)"
                        value={currentMedication}
                        onChange={(e) => setCurrentMedication(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addMedication()}
                        className="h-11 lg:h-12 text-base"
                      />
                      <Button onClick={addMedication} variant="outline" className="h-11 lg:h-12 px-3 bg-transparent">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {medications.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {medications.map((med) => (
                          <Badge key={med} variant="secondary" className="flex items-center gap-1 py-1 px-3 text-sm">
                            {med}
                            <button onClick={() => removeMedication(med)} className="ml-1 hover:text-red-600">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="history" className="text-sm lg:text-base">
                      Medical History & Notes
                    </Label>
                    <Textarea
                      id="history"
                      placeholder="Enter relevant medical history, conditions, allergies, or special instructions..."
                      value={formData.medicalHistory}
                      onChange={(e) => updateFormData("medicalHistory", e.target.value)}
                      rows={4}
                      className="resize-none text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm lg:text-base">
                      Address (Optional)
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter patient's address for emergency contact purposes"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      rows={3}
                      className="resize-none text-base"
                    />
                  </div>
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 pt-6 border-t">
                  <Button
                    onClick={savePatient}
                    disabled={isSaving || formProgress < 100}
                    className="flex-1 h-12 lg:h-auto"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving Patient...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Patient & Schedule Call
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 lg:h-auto lg:flex-none bg-transparent" asChild>
                    <Link href="/patients">Cancel</Link>
                  </Button>
                </div>

                {/* Form Validation Messages */}
                {formProgress < 100 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Required fields missing:</strong> Please complete all required fields marked with * to
                      save the patient.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
