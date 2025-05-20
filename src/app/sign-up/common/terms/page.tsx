import TermsAgreement from "@/components/signup/TermsAgreement"
import { useNavigate, useLocation } from "react-router-dom"

export default function TermsAgreementPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isStore = location.pathname.includes("/store/")
  
  const handleNext = () => {
    if (isStore) {
      navigate("/store/email")
    } else {
      navigate("/email")
    }
  }

  return <TermsAgreement onNext={handleNext} isStore={isStore}/>
}