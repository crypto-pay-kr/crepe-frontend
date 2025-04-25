import PhoneVerification from "@/components/signup/PhoneVerification"
import { useNavigate, useLocation } from "react-router-dom"

export default function PhoneVerificationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isStore = location.search.includes("store=true")
  const handleNext = () => {
    if (!isStore) {
      navigate("/additional-info")
    } else {
      navigate("/store-info")
    }
  }

  return (
    <PhoneVerification
      onNext={handleNext}
      buttonColor="blue"
      isStore={isStore}
      onToggleColor={() => {}}
    />
  )
}