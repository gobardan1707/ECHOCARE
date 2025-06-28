import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PatientProvider } from "@/components/patient-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EchoCare - AI Healthcare Companion",
  description:
    "Transform patient care with personalized voice reminders, intelligent health monitoring, and comprehensive analytics.",
  keywords: "healthcare, AI, voice technology, medication adherence, patient care, HIPAA compliant",
  authors: [{ name: "EchoCare Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PatientProvider>{children}</PatientProvider>
      </body>
    </html>
  )
}
