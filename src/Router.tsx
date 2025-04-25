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
import CoinHomeAddressPage from "@/app/home-coin-address/page";
import CoinHomeSolarPage from "@/app/home-coin-soladdress/page";
import CoinHomeXrpPage from "@/app/home-coin-xrpaddress/page";
import CoinHomeTransactionPage from "@/app/home-coin-transaction/page";
import LoginHomePage from "@/app/login/page";
import AdditionalStoreInfoPage from "./app/additional-store-info/page";
import MyPage from "./app/mypage/page";
import EditInfo from "./app/edit-info/page";
import SettlementReport from "./app/store-report/page";
import StoreEditInfo from "./app/store-edit-info/page";
import MenuEdit from "./app/menu-add/page";

import StoreCoin from '@/app/store-coin/page';
import UserCoin from  '@/app/user-coin/page';
import CoinDetailPage from '@/app/store-coin-detail/page';
import AdjustmentCoin from "@/app/adjustment-coin/page";


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
        <Route path="/home-coin-address" element={<CoinHomeAddressPage />} />
        <Route path="/home-coin-soladdress" element={<CoinHomeSolarPage />} />
        <Route path="/home-coin-xrpaddress" element={<CoinHomeXrpPage />} />
        <Route path="/home-coin-transaction" element={<CoinHomeTransactionPage />} />
        <Route path="/login" element={<LoginHomePage />} />
        <Route path="/store-info" element={<AdditionalStoreInfoPage />} />
        <Route path="/store/menu/add" element={<MenuEdit/>} />
        <Route path="/store/menu/edit" element={<MenuEdit/>} />
        <Route path="/store-coin" element={<StoreCoin />} />
        <Route path="/user-coin" element={<UserCoin/>} />
        <Route path="/coin-detail/:symbol" element={<CoinDetailPage/>} />
        <Route path="/adjustmentCoin" element={<AdjustmentCoin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
