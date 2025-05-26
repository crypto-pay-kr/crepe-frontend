"use client"

import type React from "react"

import { ChevronRight } from "lucide-react"

interface VerificationOptionProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export function VerificationOption({ icon, label, onClick }: VerificationOptionProps) {
  return (
    <div
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mr-4">{icon}</div>
        <span className="text-lg font-medium">{label}</span>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  )
}
