import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import SplashPage from "./app/splash/page";
import MyPage from "./app/mypage/page";
import EditInfo from "./app/mypage/edit-info/page";
import BusinessVerificationPage from "./app/sign-up/store-verification/page";
import SettlementReport from "./app/store-coin/store-coin-report/page";
import StoreEditInfo from "./app/store-mypage/page";
import WelcomePage from "./app/welcome/page";
import TermsAgreementPage from "./app/sign-up/common/terms/page";
import EmailPasswordPage from "./app/sign-up/common/email-input/page";
import PhoneNumberPage from "./app/sign-up/common/phone-number-input/page";
import PhoneVerificationPage from "./app/sign-up/common/phone-verification/page";
import AdditionalUserInfoPage from "./app/sign-up/additional-info/page";
import SignupCompletePage from "./app/sign-up/success/page";
import LoginPage from "./app/login/page";
import AdditionalStoreInfoPage from "./app/sign-up/store-additional-info/page";
import MyStoreManagePage from "./app/store-settings/page";
import MenuEdit from "./app/store-settings/add-store-menu/page";
import StoreSettingsPage from "./app/store-settings/edit-store-info/page";
import CartPage from "./app/order/cart/page";
import OrderPage from "./app/order/select-payment/page";
import LoadingPage from "./app/loading/page";
import PayCompletePage from "./app/order/complete-pay/page";
import { StoreIcon } from "lucide-react";
import CoinDetailPage from "./app/store-coin/store-coin-detail/page";
import OrderStatusPage from "./app/store-order-manage/page";
import AddCoinAddress from "./components/coin/AddCoinAddress";
import CoinHomeTransaction from "./app/coin/show-coin-transaction/page";
import AdjustmentCoinPage from "./app/coin/settlement-coin/page";
import CoinHomePage from "./app/coin/page";
import CoinDepositPage from "./app/coin/show-coin-address/page";
import MallPage from "./app/shop/page";
import MallDetailPage from "./app/shop/store/page";
import StoreCoinPage from "./app/store-coin/page";
import StoreEditInfoPage from '@/app/store-settings/edit-store-info/page'




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

        {/* 회원가입 및 로그인 페이지 */}
        <Route path="/" element={<SplashPage/>} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/terms" element={<TermsAgreementPage />} />
        <Route path="/email" element={<EmailPasswordPage />} />
        <Route path="/phone" element={<PhoneNumberPage/>} />
        <Route path="/phone-number" element={<PhoneNumberPage />} />
        <Route path="/phone-verification" element={<PhoneVerificationPage />} />
        <Route path="/store/verification" element={<BusinessVerificationPage/>} />
        <Route path="/additional-info" element={<AdditionalUserInfoPage />} />
        <Route path="/signup-complete" element={<SignupCompletePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 가맹점 및 유저 정보 관리 및 수정 페이지 */}
        <Route path="/home/my" element={<MyPage/>} />
        <Route path="/home/my/edit-info" element={<EditInfo />} />

        <Route path="/store/my" element={<MyPage />} />
        <Route path="/store/my/settlement-report" element={<SettlementReport/>} />
        <Route path="/store/my/edit-info" element={<StoreEditInfoPage />} />


        {/* 가맹점 가게 및 주문 관리 페이지 */}
        <Route path="/store-info" element={<AdditionalStoreInfoPage/>} />
        <Route path="/store/manage" element={<MyStoreManagePage/>} />
        <Route path="/store/menu/add" element={<MenuEdit/>} />
        <Route path="/store/menu/edit" element={<MenuEdit/>} />
        <Route path="/store-settings" element={<StoreSettingsPage/>} />
        <Route path="/store" element={<OrderStatusPage />} />

        {/* 유저 쇼핑몰 페이지 */}
        <Route path="/mall" element={<MallPage/>} />
        <Route path="/mall/store/:id" element={<MallDetailPage/>} />
        <Route path="/mall/store/cart" element={<CartPage/>} />
        <Route path="/mall/store/order" element={<OrderPage/>} />
        <Route path="/mall/store/order-pending" element={<LoadingPage/>} />
        <Route path="/mall/store/pay-complete" element={<PayCompletePage/>} />


        {/*가맹점코인 내역*/}
        <Route path="/store-coin" element={<StoreCoinPage/>} />
        {/*유저 코인 내역*/}
        <Route path="/user-coin" element={<CoinHomePage/>} />
        {/*코인 상세내역 보여주는 페이지*/}
        <Route path="/coin-detail/:symbol" element={<CoinDetailPage/>} />
        {/*입금주소 보여주는 페이지*/}
        <Route path="/home-coin-address/:symbol" element={<CoinDepositPage/>} />
        {/*거래ID 입력 페이지*/}
        <Route path="/home-coin-transaction/:symbol" element={<CoinHomeTransaction />} />
        {/*입금 계좌 등록 페이지*/}
        <Route path="/add-coin-address" element={<AddCoinAddress/>} />
        {/*가맹점 코인 정산 페이지*/}
        <Route path="/adjustmentCoin" element={<AdjustmentCoinPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default Router
