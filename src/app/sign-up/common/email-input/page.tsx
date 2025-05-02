import EmailPassword from "@/components/signup/EmailPassword"
import { useNavigate, useLocation } from "react-router-dom" 

export default function EmailPasswordPage() {
  const navigate = useNavigate() 
  const location = useLocation()
  const isStore = location.pathname.includes("/store/")
  
  const handleNext = () => {
    if (!isStore) {
      navigate("/phone")
    } else {
      navigate("/store/phone")
    }
  }

  return <EmailPassword onNext={handleNext} isStore={isStore} /> 
}