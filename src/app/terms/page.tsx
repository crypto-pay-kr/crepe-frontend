"use client"

import TermsAgreement from "@/components/signup/TermsAgreement"
import { useNavigate } from "react-router-dom"

export default function TermsAgreementPage() {
  const navigate = useNavigate()

  return <TermsAgreement onNext={() => navigate("/email")} />
}
