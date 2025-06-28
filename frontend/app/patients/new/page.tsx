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
import { Play, Save, ArrowLeft, Plus, X, User, Pill, Clock, Phone, Volume2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ResponsiveNavigation } from "@/components/responsive-navigation"
import { usePatients } from "@/components/patient-context"

export default function AddNewPatientPage() {
  const router = useRouter()
  const { addPatient } = usePatients()

  // Combined form state matching backend structure exactly
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    language: "en",
    medicationName: "",
    dosage: "",
    frequency: "daily",
    timeSlots: [] as string[],
    instructions: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    voiceProfile: "en-US-Neural2-F"
  })
  
  const [currentTimeSlot, setCurrentTimeSlot] = useState("")
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewResult, setPreviewResult] = useState<string>("")

  // Voice options matching backend expectations
  const voiceOptions = [
    { value: "en-US-Neural2-F", label: "Sarah - Warm & Caring (Female)" },
    { value: "en-US-Neural2-M", label: "Michael - Gentle & Reassuring (Male)" },
    { value: "en-US-Neural2-A", label: "Emma - Friendly & Professional (Female)" },
    { value: "en-US-Neural2-D", label: "David - Calm & Trustworthy (Male)" },
    { value: "hi-IN-Neural2-A", label: "Priya - Compassionate Hindi (Female)" },
    { value: "te-IN-Neural2-A", label: "Raj - Caring Telugu (Male)" },
  ]

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "hi", label: "Hindi" },
    { value: "zh", label: "Chinese" },
  ]

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "twice_daily", label: "Twice Daily" },
    { value: "three_times_daily", label: "Three Times Daily" },
    { value: "custom", label: "Custom" },
  ]

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required"
    }

    if (!formData.medicationName.trim()) {
      newErrors.medicationName = "Medication name is required"
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = "Dosage is required"
    }

    if (formData.timeSlots.length === 0) {
      newErrors.timeSlots = "At least one call time is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Calculate form completion progress
  const calculateProgress = () => {
    let completedFields = 0
    const totalFields = 7 // 7 required fields

    // Phone number validation
    if (formData.phoneNumber.trim() && /^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      completedFields++
    }

    // Name validation
    if (formData.name.trim()) {
      completedFields++
    }

    // Medication name validation
    if (formData.medicationName.trim()) {
      completedFields++
    }

    // Dosage validation
    if (formData.dosage.trim()) {
      completedFields++
    }

    // Time slots validation
    if (formData.timeSlots.length > 0) {
      completedFields++
    }

    // Language validation (always true since it has a default value)
    completedFields++

    // Voice profile validation
    if (formData.voiceProfile) {
      completedFields++
    }

    const progress = (completedFields / totalFields) * 100
    setFormProgress(progress)
  }

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    setTimeout(calculateProgress, 100)
  }

  const addTimeSlot = () => {
    if (!currentTimeSlot) {
      setErrors(prev => ({ ...prev, timeSlots: "Please select a time" }))
      return
    }
    
    if (formData.timeSlots.includes(currentTimeSlot)) {
      setErrors(prev => ({ ...prev, timeSlots: "This time is already added" }))
      return
    }

    const newTimeSlots = [...formData.timeSlots, currentTimeSlot].sort()
    updateFormData("timeSlots", newTimeSlots)
    setCurrentTimeSlot("")
    setErrors(prev => ({ ...prev, timeSlots: "" }))
  }

  const removeTimeSlot = (time: string) => {
    const newTimeSlots = formData.timeSlots.filter((t) => t !== time)
    updateFormData("timeSlots", newTimeSlots)
  }

  const previewVoice = async () => {
    if (!formData.name || !formData.voiceProfile) {
      alert("Please enter patient name and select a voice first")
      return
    }

    setIsPreviewingVoice(true)

    try {
      const previewText = `Hello ${formData.name}, this is your medication reminder. Time to take your ${formData.medicationName || 'medicine'}!`
      
      const response = await fetch('/api/test/murf-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: previewText,
          language: formData.language,
          voiceProfile: formData.voiceProfile
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert(`✅ Voice preview generated successfully!\n\nText: "${previewText}"\n\nVoice: ${formData.voiceProfile}`)
      } else {
        alert(`❌ Voice preview failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Voice preview error:', error)
      alert("❌ Voice preview failed. Please check your connection and try again.")
    } finally {
      setIsPreviewingVoice(false)
    }
  }

  const submitForm = async () => {
    // Basic validation
    if (!formData.phoneNumber || !formData.name || !formData.language || !formData.voiceProfile || 
        !formData.medicationName || !formData.dosage || formData.timeSlots.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    // Validate phone number format
    if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      alert("Please enter a valid phone number")
      return
    }

    // Validate end date if provided
    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert("End date must be after start date")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data matching backend structure exactly
      const patientData = {
        phoneNumber: formData.phoneNumber.trim(),
        name: formData.name.trim(),
        language: formData.language,
        medicationName: formData.medicationName.trim(),
        dosage: formData.dosage.trim(),
        frequency: formData.frequency,
        timeSlots: formData.timeSlots,
        instructions: formData.instructions.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        voiceProfile: formData.voiceProfile
      }

      console.log("Submitting data to backend:", patientData)

      // Call backend API to create patient and schedule calls
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create patient and schedule calls')
      }

      if (result.success) {
        // Add to local context for immediate UI update
        addPatient({
          id: result.data.patient.id,
          name: result.data.patient.name,
          phone: result.data.patient.phone_number,
          language: result.data.patient.language_preference,
          voiceClone: formData.voiceProfile,
          medications: [formData.medicationName],
        })

        // Show success with scheduled calls info
        const callCount = result.data.scheduledCalls?.length || 0
        alert(`✅ Patient created and calls scheduled successfully!\n\n• Patient: ${formData.name}\n• Medication: ${formData.medicationName} ${formData.dosage}\n• Calls scheduled: ${callCount}\n• Next call: ${formData.timeSlots[0]}`)
        
        router.push(`/calls?patient=${result.data.patient.id}&new=true`)
      } else {
        throw new Error(result.error || 'Failed to create patient and schedule calls')
      }
    } catch (error) {
      console.error('Error creating patient and scheduling calls:', error)
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add New Patient & Schedule Calls</h1>
              <p className="text-gray-600 text-sm lg:text-base">Create patient profile and schedule medication reminder calls in one step</p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-gray-600">Form Completion</p>
              <div className="flex items-center space-x-2 mt-1">
                <Progress value={formProgress} className="w-24 h-2" />
                <span className="text-sm font-medium text-gray-700">{Math.round(formProgress)}%</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Information */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Patient Information
                  </CardTitle>
                  <CardDescription>Basic patient details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className={`rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="+1234567890"
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                        className={`rounded-xl ${errors.phoneNumber ? 'border-red-500' : ''}`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language *</Label>
                      <Select value={formData.language} onValueChange={(value) => updateFormData("language", value)}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="voiceProfile">Voice Profile *</Label>
                      <Select value={formData.voiceProfile} onValueChange={(value) => updateFormData("voiceProfile", value)}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medication Information */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Medication Information
                  </CardTitle>
                  <CardDescription>Medication details and dosage information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicationName">Medication Name *</Label>
                      <Input
                        id="medicationName"
                        placeholder="Aspirin"
                        value={formData.medicationName}
                        onChange={(e) => updateFormData("medicationName", e.target.value)}
                        className={`rounded-xl ${errors.medicationName ? 'border-red-500' : ''}`}
                      />
                      {errors.medicationName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.medicationName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage *</Label>
                      <Input
                        id="dosage"
                        placeholder="100mg"
                        value={formData.dosage}
                        onChange={(e) => updateFormData("dosage", e.target.value)}
                        className={`rounded-xl ${errors.dosage ? 'border-red-500' : ''}`}
                      />
                      {errors.dosage && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.dosage}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency *</Label>
                      <Select value={formData.frequency} onValueChange={(value) => updateFormData("frequency", value)}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateFormData("startDate", e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateFormData("endDate", e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Take with food, avoid alcohol..."
                        value={formData.instructions}
                        onChange={(e) => updateFormData("instructions", e.target.value)}
                        className="rounded-xl"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call Schedule */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Call Schedule
                  </CardTitle>
                  <CardDescription>Set up medication reminder call times</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={currentTimeSlot}
                      onChange={(e) => setCurrentTimeSlot(e.target.value)}
                      className="rounded-xl flex-1"
                    />
                    <Button onClick={addTimeSlot} size="sm" className="rounded-xl">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {errors.timeSlots && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.timeSlots}
                    </p>
                  )}
                  
                  {formData.timeSlots.length > 0 && (
                    <div className="space-y-2">
                      <Label>Scheduled Times:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.timeSlots.map((time, index) => (
                          <Badge key={index} variant="secondary" className="rounded-xl">
                            {time}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(time)}
                              className="h-auto p-0 ml-1 hover:bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voice Preview */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Voice Preview
                  </CardTitle>
                  <CardDescription>Test the selected voice profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={previewVoice}
                    disabled={isPreviewingVoice || !formData.name || !formData.voiceProfile}
                    className="w-full rounded-xl"
                    variant="outline"
                  >
                    {isPreviewingVoice ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Preview Voice
                      </>
                    )}
                  </Button>
                  
                  {previewResult && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm whitespace-pre-line">{previewResult}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>What will be created</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Patient:</span>
                    <span className="text-sm font-medium">{formData.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Medication:</span>
                    <span className="text-sm font-medium">{formData.medicationName || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Calls Scheduled:</span>
                    <span className="text-sm font-medium">{formData.timeSlots.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Voice:</span>
                    <span className="text-sm font-medium">
                      {voiceOptions.find(v => v.value === formData.voiceProfile)?.label || "Not set"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card className="modern-card">
                <CardContent className="pt-6">
                  <Button
                    onClick={submitForm}
                    disabled={isSubmitting || formProgress < 100}
                    className="w-full rounded-xl echocare-gradient text-lg py-6"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Patient & Scheduling Calls...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Create Patient & Schedule Calls
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    This will create the patient profile and automatically schedule all medication reminder calls
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
