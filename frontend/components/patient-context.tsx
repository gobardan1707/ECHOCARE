"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Patient {
  id: string
  name: string
  phone: string
  email?: string
  age?: number
  medications: string[]
  voiceClone?: string
  language?: string
}

interface PatientContextType {
  patients: Patient[]
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, updates: Partial<Patient>) => void
  getPatient: (id: string) => Patient | undefined
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john@example.com",
      age: 68,
      medications: ["Lisinopril", "Metformin"],
      voiceClone: "Mary Smith (Spouse)",
      language: "english",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phone: "+1 (555) 234-5678",
      email: "sarah@example.com",
      age: 74,
      medications: ["Atorvastatin", "Amlodipine"],
      voiceClone: "Mike Johnson (Son)",
      language: "english",
    },
    {
      id: "3",
      name: "Mike Davis",
      phone: "+1 (555) 345-6789",
      email: "mike@example.com",
      age: 62,
      medications: ["Warfarin", "Digoxin"],
      voiceClone: "Lisa Davis (Daughter)",
      language: "english",
    },
  ])

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient])
  }

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((patient) => (patient.id === id ? { ...patient, ...updates } : patient)))
  }

  const getPatient = (id: string) => {
    return patients.find((patient) => patient.id === id)
  }

  return (
    <PatientContext.Provider value={{ patients, addPatient, updatePatient, getPatient }}>
      {children}
    </PatientContext.Provider>
  )
}

export function usePatients() {
  const context = useContext(PatientContext)
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider")
  }
  return context
}
