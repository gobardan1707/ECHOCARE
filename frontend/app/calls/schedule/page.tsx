"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Volume2,
  Phone,
  Calendar,
  Clock,
  User,
  Pill,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ResponsiveNavigation } from "@/components/responsive-navigation"
import { usePatients } from "@/components/patient-context"

interface Medicine {
  id: string
  name: string
  dosage: string
  instructions: string
}

export default function ScheduleCallPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { patients } = usePatients()

  // Check if this is from a new patient creation
  const preselectedPatientId = searchParams.get("patient")
  const isNewPatient = searchParams.get("new") === "true"

  // Form state
  const [selectedPatient, setSelectedPatient] = useState(preselectedPatientId || "")
  const [callTime, setCallTime] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [isRepeating, setIsRepeating] = useState(true)
  const [medicines, setMedicines] = useState<Medicine[]>([{ id: "1", name: "", dosage: "", instructions: "" }])
  const [customMessage, setCustomMessage] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("")
  const [enableHealthCheck, setEnableHealthCheck] = useState(true)
  const [isPreviewingCall, setIsPreviewingCall] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [formProgress, setFormProgress] = useState(0)

  // Pre-populate form when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      const patient = patients.find((p) => p.id === selectedPatient)
      if (patient) {
        // Pre-populate voice
        if (patient.voiceClone) {
          setSelectedVoice(patient.voiceClone)
        }

        // Pre-populate medications
        if (patient.medications.length > 0) {
          const medicineList = patient.medications.map((med, index) => ({
            id: (index + 1).toString(),
            name: med,
            dosage: "",
            instructions: "",
          }))
          setMedicines(medicineList)
        }

        // Set default call time based on common medication schedules
        if (!callTime) {
          setCallTime("08:00")
        }
      }
    }
  }, [selectedPatient, patients, callTime])

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = [selectedPatient, callTime, frequency, selectedVoice]
    const completedFields = requiredFields.filter(Boolean).length
    const medicinesValid = medicines.some((med) => med.name.trim())
    const progress = ((completedFields + (medicinesValid ? 1 : 0)) / 5) * 100
    setFormProgress(progress)
  }, [selectedPatient, callTime, frequency, selectedVoice, medicines])

  const voiceOptions = [
    "Sarah - Warm & Caring (Female)",
    "Michael - Gentle & Reassuring (Male)",
    "Emma - Friendly & Professional (Female)",
    "David - Calm & Trustworthy (Male)",
    "Priya - Compassionate Hindi (Female)",
    "Raj - Caring Telugu (Male)",
  ]

  const frequencyOptions = [
    { value: "daily", label: "Daily", description: "Every day at the same time" },
    { value: "twice-daily", label: "Twice Daily", description: "Morning and evening" },
    { value: "weekly", label: "Weekly", description: "Once per week" },
    { value: "as-needed", label: "As Needed", description: "Manual scheduling only" },
  ]

  const commonMedications = [
    "Lisinopril 10mg",
    "Metformin 500mg",
    "Atorvastatin 20mg",
    "Amlodipine 5mg",
    "Warfarin 5mg",
    "Insulin",
  ]

  const addMedicineRow = () => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      instructions: "",
    }
    setMedicines([...medicines, newMedicine])
  }

  const removeMedicineRow = (id: string) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((med) => med.id !== id))
    }
  }

  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    setMedicines(medicines.map((med) => (med.id === id ? { ...med, [field]: value } : med)))
  }

  const previewCall = async () => {
    if (!selectedPatient || !selectedVoice) {
      alert("Please select a patient and voice first")
      return
    }

    setIsPreviewingCall(true)

    setTimeout(() => {
      const patient = patients.find((p) => p.id === selectedPatient)
      const patientName = patient?.name || "Patient"
      const medicineNames = medicines
        .filter((m) => m.name)
        .map((m) => m.name)
        .join(", ")

      const previewMessage =
        customMessage ||
        `Hi ${patientName}, it's time to take your medication: ${medicineNames}. How are you feeling today?`

      setIsPreviewingCall(false)
      alert(`Call Preview:\n\n"${previewMessage}"\n\nVoice: ${selectedVoice}`)
    }, 2000)
  }

  const sendTestCall = async () => {
    if (!selectedPatient || !selectedVoice) {
      alert("Please select a patient and voice first")
      return
    }

    setIsSendingTest(true)

    setTimeout(() => {
      setIsSendingTest(false)
      alert("Test call sent successfully! The patient will receive the call shortly.")
    }, 3000)
  }

  const scheduleCall = async () => {
    if (formProgress < 100) {
      alert("Please complete all required fields")
      return
    }

    setIsScheduling(true)

    setTimeout(() => {
      setIsScheduling(false)
      alert("Call scheduled successfully!")
      router.push("/calls")
    }, 2000)
  }

  const selectedPatientData = patients.find((p) => p.id === selectedPatient)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        <ResponsiveNavigation />

        <div className="container mx-auto px-4 py-4 lg:py-8">
          {/* Mobile-Optimized Page Header */}
          <div className="flex flex-col space-y-4 mb-6 lg:mb-8 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <Button variant="outline" size="sm" asChild className="self-start bg-transparent">
              <Link href="/calls">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Schedule Medication Call</h1>
              <p className="text-gray-600 text-sm lg:text-base">Set up automated reminders with AI health check-ins</p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-gray-600">Setup Progress</p>
              <div className="flex items-center space-x-2 mt-1">
                <Progress value={formProgress} className="w-24 h-2" />
                <span className="text-sm font-medium">{Math.round(formProgress)}%</span>
              </div>
            </div>
          </div>

          {/* New Patient Success Banner - Mobile Optimized */}
          {isNewPatient && selectedPatientData && (
            <Card className="mb-6 lg:mb-8 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900">Patient Added Successfully!</h3>
                    <p className="text-green-700 text-sm">
                      {selectedPatientData.name} has been added. Complete the form below to schedule their first call.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl lg:text-2xl flex items-center">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                  Call Configuration
                </CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  Configure when and how medication reminder calls should be made
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 lg:space-y-8">
                {/* Patient Selection - Mobile Optimized */}
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Patient & Timing
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="patient" className="flex items-center text-sm lg:text-base">
                        Select Patient <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger className="h-11 lg:h-12 text-base">
                          <SelectValue placeholder="Choose patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                <span className="font-medium">{patient.name}</span>
                                <span className="text-gray-500 text-sm">• {patient.phone}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedPatientData && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-sm space-y-1 sm:space-y-0">
                            <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">{selectedPatientData.name}</span>
                            <span className="text-gray-600 hidden sm:inline">•</span>
                            <span className="text-gray-600">{selectedPatientData.medications.length} medications</span>
                            <span className="text-gray-600 hidden sm:inline">•</span>
                            <span className="text-gray-600 capitalize">{selectedPatientData.language}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="callTime" className="flex items-center text-sm lg:text-base">
                        Call Time <span className="text-red-500 ml-1">*</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="ml-1 text-gray-400">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Best times are typically 8 AM, 12 PM, or 8 PM</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="callTime"
                        type="time"
                        value={callTime}
                        onChange={(e) => setCallTime(e.target.value)}
                        className="h-11 lg:h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="flex items-center text-sm lg:text-base">
                        Frequency <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger className="h-11 lg:h-12 text-base">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              <div>
                                <div className="font-medium">{freq.label}</div>
                                <div className="text-xs text-gray-500">{freq.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voice" className="flex items-center text-sm lg:text-base">
                        Voice Selection <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
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

                  {/* Advanced Settings - Mobile Stack */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="repeat" className="text-base font-medium">
                          Recurring Reminders
                        </Label>
                        <p className="text-sm text-gray-600">Enable automatic recurring calls</p>
                      </div>
                      <Switch id="repeat" checked={isRepeating} onCheckedChange={setIsRepeating} />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <Label htmlFor="healthCheck" className="text-base font-medium">
                          AI Health Check
                        </Label>
                        <p className="text-sm text-gray-600">Include health status questions</p>
                      </div>
                      <Switch id="healthCheck" checked={enableHealthCheck} onCheckedChange={setEnableHealthCheck} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Medications - Mobile Optimized */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                      <Pill className="w-5 h-5 mr-2" />
                      Medications to Include
                    </h3>
                    <Button onClick={addMedicineRow} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>

                  {/* Quick Add Common Medications - Mobile Scroll */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Quick Add Common Medications</Label>
                    <div className="flex flex-wrap gap-2">
                      {commonMedications.map((med) => (
                        <Button
                          key={med}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMed = { id: Date.now().toString(), name: med, dosage: "", instructions: "" }
                            setMedicines([...medicines, newMed])
                          }}
                          className="h-8 text-xs"
                        >
                          + {med}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {medicines.map((medicine, index) => (
                      <Card key={medicine.id} className="border-gray-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium flex items-center">
                              <Pill className="w-4 h-4 mr-2" />
                              Medication #{index + 1}
                            </h4>
                            {medicines.length > 1 && (
                              <Button
                                onClick={() => removeMedicineRow(medicine.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm lg:text-base">Medication Name *</Label>
                              <Input
                                placeholder="e.g., Lisinopril"
                                value={medicine.name}
                                onChange={(e) => updateMedicine(medicine.id, "name", e.target.value)}
                                className="h-11 text-base"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm lg:text-base">Dosage</Label>
                              <Input
                                placeholder="e.g., 10mg"
                                value={medicine.dosage}
                                onChange={(e) => updateMedicine(medicine.id, "dosage", e.target.value)}
                                className="h-11 text-base"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm lg:text-base">Instructions</Label>
                              <Input
                                placeholder="e.g., With food"
                                value={medicine.instructions}
                                onChange={(e) => updateMedicine(medicine.id, "instructions", e.target.value)}
                                className="h-11 text-base"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Custom Message */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Custom Message (Optional)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="customMessage" className="text-sm lg:text-base">
                      Personalized Reminder Message
                    </Label>
                    <Textarea
                      id="customMessage"
                      placeholder="Enter a personalized message or leave blank for auto-generated message"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={3}
                      className="resize-none text-base"
                    />
                    <p className="text-xs text-gray-500">
                      If left blank, we'll generate: "Hi [Name], it's time to take your [Medication]. How are you
                      feeling today?"
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Preview and Test Section - Mobile Optimized */}
                <div className="bg-blue-50 p-4 lg:p-6 rounded-lg border border-blue-200 space-y-4">
                  <h3 className="font-medium text-lg text-blue-900">Preview & Test Call</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Button
                      onClick={previewCall}
                      disabled={isPreviewingCall || !selectedPatient || !selectedVoice}
                      variant="outline"
                      className="w-full bg-white hover:bg-gray-50 h-11"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      {isPreviewingCall ? "Generating Preview..." : "🔊 Preview Message"}
                    </Button>

                    <Button
                      onClick={sendTestCall}
                      disabled={isSendingTest || !selectedPatient || !selectedVoice}
                      variant="secondary"
                      className="w-full h-11"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {isSendingTest ? "Sending Test..." : "📞 Send Test Call"}
                    </Button>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Call Schedule Preview</span>
                    </div>
                    {selectedPatientData && callTime && frequency ? (
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>
                          <strong>{selectedPatientData.name}</strong> will receive calls{" "}
                          <strong>{frequency === "daily" ? "daily" : frequency}</strong> at <strong>{callTime}</strong>
                        </p>
                        <p>
                          Voice: <strong>{selectedVoice}</strong> | Health Check:{" "}
                          <strong>{enableHealthCheck ? "Enabled" : "Disabled"}</strong>
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700">Complete the form to see call schedule preview</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 pt-6 border-t">
                  <Button
                    onClick={scheduleCall}
                    disabled={isScheduling || formProgress < 100}
                    className="flex-1 h-12 lg:h-auto"
                    size="lg"
                  >
                    {isScheduling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Scheduling Call...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 mr-2" />
                        Schedule Medication Call
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 lg:h-auto lg:flex-none bg-transparent" asChild>
                    <Link href="/calls">Cancel</Link>
                  </Button>
                </div>

                {/* Form Validation Messages */}
                {formProgress < 100 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Complete Required Fields</p>
                        <p className="text-sm text-yellow-700">
                          Please fill in all required fields to schedule the medication call.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Call Summary - Mobile Optimized */}
                {formProgress === 100 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium mb-2 text-green-900 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Ready to Schedule
                    </h4>
                    <div className="text-sm space-y-1 text-green-800">
                      <p>
                        <strong>Patient:</strong> {selectedPatientData?.name}
                      </p>
                      <p>
                        <strong>Schedule:</strong> {frequency} at {callTime}
                      </p>
                      <p>
                        <strong>Medications:</strong> {medicines.filter((m) => m.name).length} medication(s)
                      </p>
                      <p>
                        <strong>Voice:</strong> {selectedVoice}
                      </p>
                      <p>
                        <strong>Features:</strong> {enableHealthCheck ? "Health Check Enabled" : "Basic Reminder Only"}
                        {isRepeating ? " • Recurring" : " • One-time"}
                      </p>
                    </div>
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
