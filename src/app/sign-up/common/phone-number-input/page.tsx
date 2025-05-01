import PhoneNumber from "@/components/signup/PhoneNumber"
import { useNavigate } from "react-router-dom"

export default function PhoneNumberPage() {
  const navigate = useNavigate()
  const isStore = location.pathname.includes("/store/")
  const handleNext = () => {
    if (!isStore) {
      navigate("/phone/verification")
    } else {
      navigate("/store/phone/verification")
    }
  }
  return <PhoneNumber onNext={handleNext} isStore={isStore} />
}
