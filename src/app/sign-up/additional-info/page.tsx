"use client"

import AdditionalInfo from "@/components/signup/AdditionalInfo"
import { useNavigate } from "react-router-dom" 

export default function AdditionalInfoPage() {
  const navigate = useNavigate() // Updated hook

  return (
    <AdditionalInfo
      onNext={() => navigate("/signup-complete")} // Updated navigation logic
      buttonColor="blue"
      onToggleColor={() => {}}
    />
  )
}
