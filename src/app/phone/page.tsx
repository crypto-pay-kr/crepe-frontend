"use client"

import PhoneNumber from "@/components/signup/PhoneNumber"
import { useNavigate } from "react-router-dom"

export default function PhoneNumberPage() {
  const navigate = useNavigate()

  return <PhoneNumber onNext={() => navigate("/verification")} />
}
