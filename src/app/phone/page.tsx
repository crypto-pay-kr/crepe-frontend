import PhoneNumber from "@/components/signup/PhoneNumber"
import { useNavigate } from "react-router-dom"

export default function PhoneNumberPage() {
  const navigate = useNavigate()
  const isStore = location.search.includes("store=true")
  const handleNext = () => {
    if (!isStore) {
      navigate("/phone-verification")
    } else {
      navigate("/phone-verification?store=true")
    }
  }
  return <PhoneNumber onNext={handleNext} isStore={isStore} />
}
