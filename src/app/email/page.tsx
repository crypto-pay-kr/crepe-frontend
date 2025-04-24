"use client"

import EmailPassword from "@/components/signup/EmailPassword"
import { useNavigate,useLocation } from "react-router-dom" 

export default function EmailPasswordPage() {
  const navigate = useNavigate() 
  const location = useLocation()

  const handleNext = () => {
    const params = new URLSearchParams(location.search)
    if (params.get("store") === "true") {
      navigate("/email-filled?store=true") 
    } else {
      navigate("/email-filled") 
    }
  }
  return <EmailPassword onNext={handleNext} /> 
}
