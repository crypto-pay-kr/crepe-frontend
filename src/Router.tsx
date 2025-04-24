import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import SplashPage from "@/app/splash/page";
import WelcomePage from "@/app/welcome/page";
import TermsAgreementPage from "@/app/terms/page";
import EmailPasswordPage from "@/app/email/page";
import EmailPasswordFilledPage from "@/app/email-filled/page";
import PhoneNumberPage from "@/app/phone/page";
import PhoneVerificationPage from "@/app/verification/page";
import AdditionalInfoPage from "@/app/additional-info/page";
import SignupCompletePage from "@/app/signup-complete/page";
import LoginHomePage from "@/app/login/page";
import AdditionalStoreInfoPage from "./app/additional-store-info/page";
import MyPage from "./app/mypage/page";
import EditInfo from "./app/edit-info/page";
import SettlementReport from "./app/store-report/page";
import StoreEditInfo from "./app/store-edit-info/page";

function Router({ buttonColor, toggleButtonColor }: { buttonColor: "blue" | "gray"; toggleButtonColor: () => void }) {
  useEffect(() => {
    // Splash screen timer
    if (window.location.pathname === "/") {
      const timer = setTimeout(() => {
        window.location.pathname = "/welcome"
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/home/my" element={<MyPage />} />
        <Route path="/home/my/edit-info" element={<EditInfo />} />
        <Route path="/store/my" element={<MyPage />} />
        <Route path="/store/my/settlement-report" element={<SettlementReport />} />
        <Route path="/store/my/edit-info" element={<StoreEditInfo />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/terms" element={<TermsAgreementPage />} />
        <Route path="/email" element={<EmailPasswordPage />} />
        <Route path="/email-filled" element={<EmailPasswordFilledPage />} />
        <Route path="/phone" element={<PhoneNumberPage />} />
        <Route path="/phone-verification" element={<PhoneVerificationPage />} />
        <Route path="/additional-info" element={<AdditionalInfoPage />} />
        <Route path="/signup-complete" element={<SignupCompletePage />} />
        <Route path="/login" element={<LoginHomePage />} />
        <Route path="/store-info" element={<AdditionalStoreInfoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
