"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Save,
  ArrowLeft,
  Plus,
  X,
  User,
  Pill,
  Clock,
  Volume2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResponsiveNavigation } from "@/components/responsive-navigation";
import { usePatients } from "@/components/patient-context";

// A small helper to format time for user-friendly display
const formatDisplayTime = (time24h: string) => {
  if (!time24h) return "";
  const [hours, minutes] = time24h.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function AddNewPatientPage() {
  const router = useRouter();
  const { addPatient } = usePatients();

  // Best practice: Use environment variables for API endpoints
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://echocare.onrender.com/api";

  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    language: "en",
    medicationName: "",
    dosage: "",
    frequency: "daily",
    timeSlots: [] as string[],
    instructions: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    voiceProfile: "en-US-amara",
  });

  const [currentTimeSlot, setCurrentTimeSlot] = useState("");
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [voiceModels, setVoiceModels] = useState<{ voiceId: string; voiceName: string}[]>([]);
  useEffect(() => {
  fetchVoiceModels("en");
  
}, []);
useEffect(() => {
  fetchVoiceModels(formData.language);
}, [formData.language]);

  const fetchVoiceModels = async (language: string) => {
    setVoiceModels([]);
    console.log("Fetching voice models for language:", language);
    try {
      const response = await fetch(`https://echocare.onrender.com/api/api/voice-models?language=${language}`);
      if (!response.ok) throw new Error("Failed to fetch voice models");
      const data = await response.json();
      console.log("Fetched voice models:", data);
      setVoiceModels(data.voices);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, voiceProfile: data[0].voiceId }));
      }
    } catch (error) {
      console.error("Error fetching voice models:", error);
      setNotification({ type: 'error', message: 'Failed to load voice models. Please try again later.' });
    }
  };
 
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
    { value: "ar", label: "Arabic" },
    { value: "ru", label: "Russian" },
    { value: "bn", label: "Bengali" },
    { value: "te", label: "Telugu" },
    { value: "ta", label: "Tamil" },
    { value: "mr", label: "Marathi" },
    { value: "gu", label: "Gujarati" },
    { value: "kn", label: "Kannada" },
    { value: "ml", label: "Malayalam" },
    { value: "pa", label: "Punjabi" },
  ];

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "twice_daily", label: "Twice Daily" },
    { value: "three_times_daily", label: "Three Times Daily" },
    { value: "custom", label: "Custom" },
  ];

  const formProgress = useMemo(() => {
    let completedFields = 0;
    const totalFields = 7;
    if (formData.name.trim()) completedFields++;
    if (formData.phoneNumber && /^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) completedFields++;
    if (formData.medicationName.trim()) completedFields++;
    if (formData.dosage.trim()) completedFields++;
    if (formData.timeSlots.length > 0) completedFields++;
    if (formData.language) completedFields++;
    if (formData.voiceProfile) completedFields++;
    return (completedFields / totalFields) * 100;
  }, [formData]);


  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addTimeSlot = () => {
    if (!currentTimeSlot) {
      setErrors((prev) => ({ ...prev, timeSlots: "Please select a time first." }));
      return;
    }
    if (formData.timeSlots.includes(currentTimeSlot)) {
      setErrors((prev) => ({ ...prev, timeSlots: "This time has already been added." }));
      return;
    }

    const newTimeSlots = [...formData.timeSlots, currentTimeSlot].sort();
    updateFormData("timeSlots", newTimeSlots);
    setCurrentTimeSlot("");
    setErrors((prev) => ({ ...prev, timeSlots: "" }));
  };

  const removeTimeSlot = (time: string) => {
    updateFormData("timeSlots", formData.timeSlots.filter((t) => t !== time));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Patient name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Please enter a valid phone number";
    if (!formData.medicationName.trim()) newErrors.medicationName = "Medication name is required";
    if (!formData.dosage.trim()) newErrors.dosage = "Dosage is required";
    if (formData.timeSlots.length === 0) newErrors.timeSlots = "At least one call time is required";
    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after the start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const previewVoice = async () => {
    setNotification(null);
    if (!formData.name || !formData.voiceProfile) {
      setNotification({ type: 'error', message: 'Please enter a patient name and select a voice first.' });
      return;
    }
    setIsPreviewingVoice(true);
    try {
      const previewText = `Hello ${formData.name}, this is a reminder to take your ${formData.medicationName || 'medicine'}.`;
      const response = await fetch(`/api/test/murf-voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text: previewText,
            language: formData.language,
            voiceProfile: formData.voiceProfile,
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setNotification({ type: 'success', message: 'Voice preview generated successfully!' });
      } else {
        setNotification({ type: 'error', message: `Voice preview failed: ${result.error || 'Unknown error'}` });
      }
    } catch (error) {
      console.error("Voice preview error:", error);
      setNotification({ type: 'error', message: 'An unexpected error occurred during preview.' });
    } finally {
      setIsPreviewingVoice(false);
    }
  };

  const submitForm = async () => {
    setNotification(null);
    if (!validateForm()) {
        setNotification({ type: 'error', message: 'Please fix the errors before submitting.' });
        return;
    }

    setIsSubmitting(true);

    try {
      const digitsOnly = formData.phoneNumber.replace(/\D/g, '');
      const last10Digits = digitsOnly.slice(-10);
      const formattedPhoneNumber = `+91${last10Digits}`;
      
      // *** THE FIX IS HERE ***
      // The payload now sends formData.timeSlots directly,
      // as it's already an array of "HH:mm" strings, which matches the TIME[] type.
      const patientData = {
        ...formData,
        phoneNumber: formattedPhoneNumber, 
        // No conversion is needed for timeSlots. Send the array as is.
        timeSlots: formData.timeSlots,
        endDate: formData.endDate || null,
      };
      console.log("Submitting patient data:", patientData);

      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create patient.");
      }

      addPatient({
        id: result.data.patient.id,
        name: result.data.patient.name,
        phone: formattedPhoneNumber,
        language: result.data.patient.language_preference,
        voiceClone: formData.voiceProfile,
        medications: [formData.medicationName],
      });
      
      router.push(`/calls?patient=${result.data.patient.id}&new=true`);

    } catch (error) {
      console.error("Error creating patient:", error);
      setNotification({ type: 'error', message: `Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        <ResponsiveNavigation />

        <div className="container mx-auto px-4 py-4 lg:py-8">
          <div className="flex flex-col space-y-4 mb-6 lg:mb-8 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <Button variant="outline" size="sm" asChild className="self-start bg-transparent">
              <Link href="/patients">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Add New Patient & Schedule Calls
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Create a profile and schedule medication reminders in one go.
              </p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-gray-600">Form Completion</p>
              <div className="flex items-center space-x-2 mt-1">
                <Progress value={formProgress} className="w-24 h-2" />
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(formProgress)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" /> Patient Information
                  </CardTitle>
                  <CardDescription>
                    Basic patient details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} className={errors.name ? "border-red-500" : ""} />
                      {errors.name && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input id="phoneNumber" placeholder="98765 43210" value={formData.phoneNumber} onChange={(e) => updateFormData("phoneNumber", e.target.value)} className={errors.phoneNumber ? "border-red-500" : ""} />
                      {errors.phoneNumber && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phoneNumber}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language *</Label>
                      <Select
  value={formData.language}
  onValueChange={(value) => {
    updateFormData("language", value);
  }}
>
  <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
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
                      <Select
  value={formData.voiceProfile}
  onValueChange={(value) => updateFormData("voiceProfile", value)}
>
  <SelectTrigger><SelectValue placeholder="Select voice" /></SelectTrigger>
  <SelectContent>
    {voiceModels.map((model) => (
      <SelectItem key={model.voiceId} value={model.voiceId}>
        {model.voiceName}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Pill className="w-5 h-5"/>Medication & Schedule</CardTitle>
                    <CardDescription>Medication details and dosage information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="medicationName">Medication Name *</Label>
                            <Input id="medicationName" placeholder="Aspirin" value={formData.medicationName} onChange={(e)=>updateFormData("medicationName", e.target.value)} className={errors.medicationName ? "border-red-500" : ""}/>
                            {errors.medicationName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.medicationName}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dosage">Dosage *</Label>
                            <Input id="dosage" placeholder="100mg" value={formData.dosage} onChange={(e)=>updateFormData("dosage", e.target.value)} className={errors.dosage ? "border-red-500" : ""}/>
                            {errors.dosage && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.dosage}</p>}
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency *</Label>
                            <Select value={formData.frequency} onValueChange={(value)=>updateFormData("frequency", value)}>
                                <SelectTrigger><SelectValue placeholder="Select frequency"/></SelectTrigger>
                                <SelectContent>{frequencyOptions.map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input id="startDate" type="date" value={formData.startDate} onChange={(e)=>updateFormData("startDate", e.target.value)}/>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date (Optional)</Label>
                            <Input id="endDate" type="date" value={formData.endDate} onChange={(e)=>updateFormData("endDate", e.target.value)} className={errors.endDate ? "border-red-500" : ""}/>
                             {errors.endDate && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.endDate}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instructions">Instructions</Label>
                            <Textarea id="instructions" placeholder="Take with food..." value={formData.instructions} onChange={(e)=>updateFormData("instructions", e.target.value)} rows={3}/>
                        </div>
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Call Times
                  </CardTitle>
                  <CardDescription>
                    Set the specific times for medication reminders each day.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <div className="flex-grow space-y-1">
                      <Input type="time" value={currentTimeSlot} onChange={(e) => setCurrentTimeSlot(e.target.value)} className={`rounded-xl ${errors.timeSlots ? "border-red-500" : ""}`} />
                      {errors.timeSlots && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.timeSlots}
                        </p>
                      )}
                    </div>
                    <Button onClick={addTimeSlot} size="icon" className="rounded-xl flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.timeSlots.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <Label>Scheduled Times:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.timeSlots.map((time, index) => (
                          <Badge key={index} variant="secondary" className="rounded-xl text-sm py-1 px-3">
                            {formatDisplayTime(time)}
                            <button
                              onClick={() => removeTimeSlot(time)}
                              className="ml-2 p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                              aria-label={`Remove ${formatDisplayTime(time)}`}
                            >
                              <X className="w-3 h-3 text-gray-600 dark:text-gray-300 hover:text-red-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Volume2 className="w-5 h-5"/>Voice Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={previewVoice} disabled={isPreviewingVoice || !formData.name} className="w-full" variant="outline">
                            {isPreviewingVoice ? (<><div className="w-4 h-4 border-2 border-t-transparent border-current animate-spin rounded-full mr-2"/>Generating...</>) : (<><Play className="w-4 h-4 mr-2"/>Preview Voice</>)}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Patient:</span><span className="font-medium text-right">{formData.name || "—"}</span></div>
                        <div className="flex justify-between"><span>Medication:</span><span className="font-medium text-right">{formData.medicationName || "—"}</span></div>
                        <div className="flex justify-between"><span>Daily Calls:</span><span className="font-medium">{formData.timeSlots.length}</span></div>
                        {/* <div className="flex justify-between"><span>Voice:</span><span className="font-medium text-right">{voiceModels.find(v => v.value === formData.voiceProfile)?.label.split(" - ")[0] || "—"}</span></div> */}
                    </CardContent>
                </Card>
              
                <Card>
                    <CardContent className="pt-6">
                    {notification && (
                        <div className={`p-3 rounded-lg mb-4 flex items-start gap-2 text-sm ${
                            notification.type === 'success' ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-red-100 border border-red-200 text-red-800'
                        }`}>
                        {notification.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        <span className="flex-1">{notification.message}</span>
                        </div>
                    )}

                    <Button
                        onClick={submitForm}
                        disabled={isSubmitting || formProgress < 100}
                        className="w-full rounded-xl echocare-gradient text-lg py-6"
                        size="lg"
                    >
                        {isSubmitting ? (
                            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Creating Patient...</>
                        ) : (
                            <><Save className="w-5 h-5 mr-2" />Create Patient & Schedule</>
                        )}
                    </Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}