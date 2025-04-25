import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import SplashPage from "@/app/splash/page";
import WelcomePage from "@/app/welcome/page";
import TermsAgreementPage from "@/app/terms/page";
import EmailPasswordPage from "@/app/email/page";
import PhoneNumberPage from "@/app/phone/page";
import PhoneVerificationPage from "@/app/verification/page";
import AdditionalInfoPage from "@/app/additional-info/page";
import SignupCompletePage from "@/app/signup-complete/page";
import CoinHomeAddressPage from "@/app/show-coin-address/page";
import AddCoinAddress from "@/app/add-coin-address/page";
import CoinHomeTransactionPage from "@/app/show-coin-transaction/page";
import LoginHomePage from "@/app/login/page";
import AdditionalStoreInfoPage from "./app/additional-store-info/page";
import ShoppingMallPage from "@/app/shoppingmall/page";
import ShoppingMallDetailPage from "@/app/shoppingmall/store/page";
import MyPage from "./app/mypage/page";
import EditInfo from "./app/edit-info/page";
import SettlementReport from "./app/store-report/page";
import StoreEditInfo from "./app/store-edit-info/page";
import MenuEdit from "./app/menu-add/page";
import BusinessVerification from "./app/store-verification/page";
import CartItemPage from "./app/shoppingmall/store/cart/page";
import OrderPage from "./app/shoppingmall/store/order/page";
import LoadingPage from "./app/loading/page";
import PayCompletePage from "./app/shoppingmall/store/pay-complete/page";
import StoreCoin from '@/app/store-coin/page';
import UserCoin from  '@/app/user-coin/page';
import CoinDetailPage from '@/app/store-coin-detail/page';
import AdjustmentCoin from "@/app/adjustment-coin/page";
import MyStoreManagePage from "./app/store-manage/page";


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
        <Route path="/store/verification" element={<BusinessVerification/>} />
        <Route path="/store/my" element={<MyPage />} />
        <Route path="/store/my/settlement-report" element={<SettlementReport />} />
        <Route path="/store/my/edit-info" element={<StoreEditInfo />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/terms" element={<TermsAgreementPage />} />
        <Route path="/email" element={<EmailPasswordPage />} />
        <Route path="/phone" element={<PhoneNumberPage />} />
        <Route path="/phone-verification" element={<PhoneVerificationPage />} />
        <Route path="/additional-info" element={<AdditionalInfoPage />} />
        <Route path="/signup-complete" element={<SignupCompletePage />} />
        <Route path="/login" element={<LoginHomePage />} />


        {/* 가맹점 가게 및 주문 관리 페이지 */}
        <Route path="/store-info" element={<AdditionalStoreInfoPage />} />
        <Route path="/store/manage" element={<MyStoreManagePage/>} />
        <Route path="/store/menu/add" element={<MenuEdit/>} />
        <Route path="/store/menu/edit" element={<MenuEdit/>} />
        <Route path="/phone-number" element={<PhoneNumberPage />} />

        {/* 유저 쇼핑몰 페이지 */}
        <Route path="/shoppingmall" element={<ShoppingMallPage/>} />
        <Route path="/shoppingmall/store/:id" element={<ShoppingMallDetailPage />} />
        <Route path="/shoppingmall/store/cart" element={<CartItemPage/>} />
        <Route path="/shoppingmall/store/order" element={<OrderPage/>} />
        <Route path="/shoppingmall/store/order-pending" element={<LoadingPage/>} />
        <Route path="/shoppingmall/store/pay-complete" element={<PayCompletePage/>} />

        {/*가맹점코인 내역*/}
        <Route path="/store-coin" element={<StoreCoin />} />
        {/*유저 코인 내역*/}
        <Route path="/user-coin" element={<UserCoin/>} />
        {/*코인 상세내역 보여주는 페이지*/}
        <Route path="/coin-detail/:symbol" element={<CoinDetailPage/>} />
        {/*입금주소 보여주는 페이지*/}
        <Route path="/home-coin-address/:symbol" element={<CoinHomeAddressPage />} />
        {/*거래ID 입력 페이지*/}
        <Route path="/home-coin-transaction/:symbol" element={<CoinHomeTransactionPage />} />
        {/*입금 계좌 등록 페이지*/}
        <Route path="/add-coin-address" element={<AddCoinAddress />} />
        {/*가맹점 코인 정산 페이지*/}
        <Route path="/adjustmentCoin" element={<AdjustmentCoin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
