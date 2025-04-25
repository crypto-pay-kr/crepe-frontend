import EmailPassword from "@/components/signup/EmailPassword"
import { useNavigate, useLocation } from "react-router-dom" 

export default function EmailPasswordPage() {
  const navigate = useNavigate() 
  const location = useLocation()
  const isStore = location.search.includes("store=true")

  const handleNext = () => {
    if (!isStore) {
      navigate("/phone-number")
    } else {
      navigate("/phone-number?store=true")
    }
  }

  return <EmailPassword onNext={handleNext} isStore={isStore} /> 
}