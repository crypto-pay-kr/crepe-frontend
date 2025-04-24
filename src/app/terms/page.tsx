import TermsAgreement from "@/components/signup/TermsAgreement"
import { useNavigate, useLocation } from "react-router-dom"

export default function TermsAgreementPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const isStore = params.get("store") === "true"
  const handleNext = () => {
    if (isStore) {
      navigate("/email?store=true")
    } else {
      navigate("/email")
    }
  }

  return <TermsAgreement onNext={handleNext} isStore={isStore}/>
}
