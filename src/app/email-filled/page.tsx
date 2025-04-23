"use client"

import EmailPasswordFilled from "@/components/signup/EmailPasswordFilled"
import { useNavigate } from "react-router-dom"

export default function EmailPasswordFilledPage() {
  const navigate = useNavigate()

  return <EmailPasswordFilled onNext={() => navigate("/phone-verification")} />
}
