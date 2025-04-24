"use client"

import EmailPasswordFilled from "@/components/signup/EmailPasswordFilled"
import { useNavigate,useLocation } from "react-router-dom"

export default function EmailPasswordFilledPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNext = () => {
    const params = new URLSearchParams(location.search)
    if (params.get("store") === "true") {
      navigate("/phone-verification?store=true")
    } else {
      navigate("/phone-verification")
    }
  }
  return <EmailPasswordFilled onNext={handleNext} />
}
