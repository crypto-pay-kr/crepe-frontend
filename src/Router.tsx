import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import SplashPage from "./app/splash/page";
import MyPage from "./app/mypage/page";
import EditInfo from "./app/mypage/edit-info/page";
import BusinessVerificationPage from "./app/sign-up/store-verification/page";
import SettlementReport from "./app/store/store-coin/store-coin-report/page";
import WelcomePage from "./app/welcome/welcome";
import TermsAgreementPage from "./app/sign-up/common/terms/page";
import EmailPasswordPage from "./app/sign-up/common/email-input/page";
import PhoneNumberPage from "./app/sign-up/common/phone-number-input/page";
import PhoneVerificationPage from "./app/sign-up/common/phone-verification/page";
import AdditionalUserInfoPage from "./app/sign-up/additional-info/page";
import SignupCompletePage from "./app/sign-up/success/page";
import LoginPage from "./app/login/page";
import AdditionalStoreInfoPage from "./app/sign-up/store-additional-info/page";
import MyStoreManagePage from "./app/store/store-settings/page";
import MenuEdit from "./app/store/store-settings/add-store-menu/page";
import LoadingPage from "./app/loading/page";
import CoinDetailPage from "./app/store/store-coin/store-coin-detail/page";
import OrderStatusPage from "./app/store/store-order-manage/page";
import MallDetailPage from "./app/shop/detail/shopDetailPage";
import StoreEditInfoPage from '@/app/store/store-settings/edit-store-info/page'
import AddCoinAddress from "./app/coin/adress/addCoinAddress";
import SettlementCoin from "./app/coin/settlement/settlementCoin";
import CoinDeposit from "./app/coin/deposit/depositCoin";
import CoinTransaction from "./app/coin/transaction/coinTransaction";
import CoinHome from "./app/coin/home/CoinHome";
import SelectPaymentPage from "./app/order/payment/selectPayment";
import CartPage from "./app/order/cart/cartPage";
import PayCompletePage from "./app/order/complete-pay/payComplete";
import StoreCoinHome from "./app/store/store-coin/page";
import ShoppingMall from "./app/shop/shopPage";
import OrderHistoryPage from "./app/order/user/orderHistoryPage";
import TokenDetailPage from "./app/token/product/product-detail";
import TokenGroupDetailPage from "./app/token/token-detail";
import TokenExchangePage from "./app/token/token-exchange";
import TokenExchangeCompletePage from "./app/token/exchangecomplete";
import TokenDepositPage from "./app/token/product/product-deposit";
import TokenCancelPage from "./app/token/product/product-cancel";
import KTokenProductDetail from "./app/k-token/products/detail/page";
import KTokenProductSignup from "./app/k-token/products/signup/page";
import KTokenProductSignupComplete from "./app/k-token/products/signup-complete/page";
import KTokenHomePage from "./app/k-token/products/page";





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
        <Route path="/phone/verification" element={<PhoneVerificationPage />} />
        <Route path="/additional/info" element={<AdditionalUserInfoPage />} />
        <Route path="/signup-complete" element={<SignupCompletePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* 가맹점 회원가입 경로 */}
        <Route path="/store/terms" element={<TermsAgreementPage />} />
        <Route path="/store/email" element={<EmailPasswordPage />} />
        <Route path="/store/phone" element={<PhoneNumberPage/>} />
        <Route path="/store/phone/verification" element={<PhoneVerificationPage />} />
        <Route path="/store/verification" element={<BusinessVerificationPage/>} />


        {/* 가맹점 및 유저 정보 관리 및 수정 페이지 */}
        <Route path="/home/my" element={<MyPage/>} />
        <Route path="/home/my/edit" element={<EditInfo />} />
        <Route path="/store/my" element={<MyPage />} />
        <Route path="/store/my/settlement-report" element={<SettlementReport/>} />
        <Route path="/store/my/edit" element={<StoreEditInfoPage />} />


        {/* 가맹점 가게 및 주문 관리 페이지 */}
        <Route path="/store/info" element={<AdditionalStoreInfoPage/>} />
        <Route path="/store/manage" element={<MyStoreManagePage/>} />
        <Route path="/store/menu/add" element={<MenuEdit/>} />
        <Route path="/store/menu/edit" element={<MenuEdit/>} />
        <Route path="/store" element={<OrderStatusPage />} />

        {/* 유저 주문 관리 페이지 */}
        <Route path="/user/order-history" element={<OrderHistoryPage />} />


        {/* 유저 쇼핑몰 페이지 */}
        <Route path="/mall" element={<ShoppingMall/>} />
        <Route path="/mall/store/:id" element={<MallDetailPage/>} />
        <Route path="/mall/store/cart" element={<CartPage/>} />
        <Route path="/mall/store/order" element={<SelectPaymentPage/>} />
        <Route path="/mall/store/order-pending" element={<LoadingPage/>} />
        <Route path="/mall/store/pay-complete/:orderId" element={<PayCompletePage/>} />


        {/*가맹점코인 내역*/}
        <Route path="/store/coin" element={<StoreCoinHome/>} />
        {/*유저 코인 내역*/}
        <Route path="/user/coin" element={<CoinHome/>} />
        {/*코인 상세내역 보여주는 페이지*/}
        <Route path="/coin-detail/:symbol" element={<CoinDetailPage/>} />
        {/*입금주소 보여주는 페이지*/}
        <Route path="/coin/address/:symbol" element={<CoinDeposit/>} />
        {/*거래ID 입력 페이지*/}
        <Route path="/coin/transaction/:symbol" element={<CoinTransaction />} />
        {/*입금 계좌 등록 페이지*/}
        <Route path="/coin/address/add" element={<AddCoinAddress/>} />
        {/*가맹점 코인 정산 페이지*/}
        <Route path="/settlement" element={<SettlementCoin/>} />

        /*토큰 관련 페이지*/
        {/*토큰 상품 페이지*/}
        <Route path="/token/product/detail/:tokenCode" element={<TokenDetailPage/>} />
        <Route path="/token/product/deposit/:tokenCode" element={<TokenDepositPage/>} />
        <Route path="/token/product/cancel/:tokenCode" element={<TokenCancelPage/>} />

        {/*토큰 상세 페이지*/}
        <Route path="/token/detail/:bank" element={<TokenGroupDetailPage/>} />
        <Route path="/token/exchange/:bank" element={<TokenExchangePage/>} />
        <Route path="/token/exchange/complete" element={<TokenExchangeCompletePage/>} />
        <Route path="/token/exchange/complete" element={<TokenExchangeCompletePage/>} />


        {/* K-Token 관련 페이지 */}
        <Route path="/k-token/products/detail" element={<KTokenProductDetail/>} />
        <Route path="/k-token/products/signup" element={<KTokenProductSignup/>} />
        <Route path="/k-token/products/signup-complete" element={<KTokenProductSignupComplete/>} />
        <Route path="/k-token/products" element={<KTokenHomePage/>} />

      </Routes>
    </BrowserRouter>
  )
} 

export default Router
