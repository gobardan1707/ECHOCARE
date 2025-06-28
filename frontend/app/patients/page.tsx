"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Phone, Mail, Pill, Users, Search, Plus, Calendar, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ResponsiveNavigation } from "@/components/responsive-navigation"
import { usePatients } from "@/components/patient-context"

export default function PatientsPage() {
  const { patients } = usePatients()

  // Mock additional data for enhanced display
  const patientsWithStats = patients.map((patient) => ({
    ...patient,
    adherenceRate: Math.floor(Math.random() * 20) + 80, // 80-100%
    lastCall: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: Math.random() > 0.8 ? "attention" : "active",
    emergencyContact: `Emergency Contact ${Math.floor(Math.random() * 100)}`,
    nextCall: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString().split("T")[1].slice(0, 5),
  }))

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
  }

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        <ResponsiveNavigation />

        <div className="container mx-auto px-4 py-4 lg:py-8">
          {/* Mobile-Optimized Page Header */}
          <div className="flex flex-col space-y-4 mb-6 lg:mb-8 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Comprehensive patient profiles and medication schedules
              </p>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/patients/new">
                <Plus className="w-5 h-5 mr-2" />
                Add New Patient
              </Link>
            </Button>
          </div>

          {/* Quick Stats - Mobile Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <Card>
              <CardContent className="pt-4 lg:pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-xl lg:text-2xl font-bold text-blue-600">{patients.length}</p>
                  </div>
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mt-2 lg:mt-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 lg:pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">Active Patients</p>
                    <p className="text-xl lg:text-2xl font-bold text-green-600">
                      {patientsWithStats.filter((p) => p.status === "active").length}
                    </p>
                  </div>
                  <Activity className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mt-2 lg:mt-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 lg:pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">Avg Adherence</p>
                    <p className="text-xl lg:text-2xl font-bold text-purple-600">
                      {Math.round(
                        patientsWithStats.reduce((acc, p) => acc + p.adherenceRate, 0) / patientsWithStats.length,
                      )}
                      %
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mt-2 lg:mt-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 lg:pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600">Need Attention</p>
                    <p className="text-xl lg:text-2xl font-bold text-orange-600">
                      {patientsWithStats.filter((p) => p.status === "attention").length}
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600 mt-2 lg:mt-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters - Mobile Optimized */}
          <Card className="mb-6 lg:mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search patients..." className="pl-10 h-11 text-base" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                  <Badge variant="outline" className="cursor-pointer px-4 py-2 whitespace-nowrap">
                    All ({patients.length})
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer px-4 py-2 whitespace-nowrap">
                    Active ({patientsWithStats.filter((p) => p.status === "active").length})
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer px-4 py-2 whitespace-nowrap">
                    Attention ({patientsWithStats.filter((p) => p.status === "attention").length})
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patients Grid - Mobile Optimized */}
          <div className="grid gap-4 lg:gap-6">
            {patientsWithStats.map((patient) => (
              <Card
                key={patient.id}
                className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
              >
                <CardContent className="pt-4 lg:pt-6">
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
                    {/* Patient Info - Mobile Stack */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12 lg:h-16 lg:w-16 border-2 border-gray-200 flex-shrink-0">
                        <AvatarFallback className="text-sm lg:text-lg font-semibold bg-blue-100 text-blue-700">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
                          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">{patient.name}</h3>
                          <Badge className={`${getStatusColor(patient.status)} w-fit`}>
                            {patient.status === "active" ? "Active" : "Needs Attention"}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{patient.phone}</span>
                          </div>
                          {patient.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{patient.email}</span>
                            </div>
                          )}
                          {patient.age && <p className="text-sm text-gray-600">Age: {patient.age} years</p>}
                        </div>
                      </div>
                    </div>

                    {/* Medications - Mobile Stack */}
                    <div className="flex-1 lg:flex-none lg:w-64">
                      <h4 className="font-medium mb-3 flex items-center text-gray-900">
                        <Pill className="w-4 h-4 mr-2" />
                        Medications ({patient.medications.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {patient.medications.slice(0, 2).map((med, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                          >
                            {med}
                          </Badge>
                        ))}
                        {patient.medications.length > 2 && (
                          <Badge variant="outline" className="text-gray-600 text-xs">
                            +{patient.medications.length - 2} more
                          </Badge>
                        )}
                      </div>
                      {patient.voiceClone && <p className="text-xs text-gray-500 mt-2">Voice: {patient.voiceClone}</p>}
                    </div>

                    {/* Stats - Mobile Grid */}
                    <div className="flex-1 lg:flex-none lg:w-48">
                      <div className="grid grid-cols-2 gap-3 lg:gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <p className={`text-lg lg:text-2xl font-bold ${getAdherenceColor(patient.adherenceRate)}`}>
                            {patient.adherenceRate}%
                          </p>
                          <p className="text-xs text-gray-600">Adherence</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <p className="text-sm lg:text-base font-medium text-gray-900">{patient.nextCall}</p>
                          <p className="text-xs text-gray-600">Next Call</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Last: {new Date(patient.lastCall).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions - Mobile Stack */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:gap-3 lg:min-w-[140px]">
                      <Button size="sm" asChild className="w-full">
                        <Link href={`/patients/${patient.id}`}>
                          <Users className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild className="w-full bg-transparent">
                        <Link href={`/calls/schedule?patient=${patient.id}`}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Call
                        </Link>
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" className="w-full bg-transparent">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Initiate immediate medication reminder call</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State - Mobile Optimized */}
          {patients.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Patients Yet</h3>
                <p className="text-gray-600 mb-6">Get started by adding your first patient to the system.</p>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/patients/new">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Patient
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
