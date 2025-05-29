import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import SplashPage from "./app/splash/page";
import MyPage from "./app/mypage/page";
import EditInfo from "./app/mypage/edit-info/page";
import SettlementReport from "./app/store/store-coin/store-coin-report/page";
import WelcomePage from "./app/welcome/welcome";
import TermsAgreementPage from "./app/sign-up/common/terms/page";
import EmailPasswordPage from "./app/sign-up/common/email-input/page";
import PhoneNumberPage from "./app/sign-up/common/phone-number-input/page";
import PhoneVerificationPage from "./app/sign-up/common/phone-verification/page";
import AdditionalUserInfoPage from "./app/sign-up/additional-info/page";
import SignupCompletePage from "./app/sign-up/success/page";
import LoginPage from "./app/login/page";
import AdditionalStoreInfoPage from "./app/sign-up/store-register/business-verification/success/AdditionalStoreInfoPage";
import MyStoreManagePage from "./app/store/store-settings/page";
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
import ShoppingMall from "./app/shop/shopPage";
import TokenGroupDetailPage from "./app/token/my-product/detail/my-product-detail";
import TokenExchangePage from "./app/token/exchange/token-exchange";
import TokenExchangeCompletePage from "./app/token/exchange/exchange-complete/exchange-complete";
import TokenDepositPage from "./app/token/my-product/detail/deposit/product-deposit";
import TokenCancelPage from "./app/token/my-product/detail/cancel/product-cancel";
import MyOrderHistoryPage from "./app/order/order-history/page";
import IDVerificationStep1 from "./app/sign-up/common/idcard-verification/step01/page";
import IDVerificationStep2 from "./app/sign-up/common/idcard-verification/step02/page";
import IDVerificationStep3 from "./app/sign-up/common/idcard-verification/step03/page";
import TokenProductListPage from "./app/token/my-product/my-product-list";
import OnSaleTokenProductDetail from "./app/token/onsale-product/detail/onsale-product-detail";
import TokenProductSignup from "./app/token/onsale-product/signup/product-signup";
import OnSaleTokenProductListPage from "./app/token/onsale-product/onsale-product-list";
import BusinessCertificateVerifyPage from "./app/sign-up/store-register/business-verification/BusinessCertificateVerifyPage";
import MenuAddPage from "./app/store/store-settings/add-store-menu/page";
import MenuEditPage from "./app/store/store-settings/edit-store-menu/page";
import IDVerificationStep4 from "./app/sign-up/common/idcard-verification/step04/page";
import UnderDevelopment from "./app/develop/page";
import TokenProductSignupComplete from "./app/token/onsale-product/signup/product-signup-complete";
import ProtectedRoute from '@/routes/ProtectedRoute'
import PublicRoute from '@/routes/PublicRoute'
import MyPaymentHistoryPage from "./app/mypage/pay-history/page";
import StoreSettlementReportPage from "./app/mypage/settlement-report/page"
import OtpSetup from "./app/mypage/otp/page";
import { SellerOnlyRoute, UserOnlyRoute } from '@/routes/RoleProtectedRoute';
import CustomerSupportPage from "./app/center/page";

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
        {/* 스플래시 페이지는 항상 접근 가능 */}
        <Route path="/" element={<SplashPage />} />
        
        {/* 로그인하지 않은 사용자만 접근 가능한 페이지 */}
        <Route element={<PublicRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* 일반 회원가입 페이지 */}
          <Route path="/terms" element={<TermsAgreementPage />} />
          <Route path="/email" element={<EmailPasswordPage />} />
          <Route path="/phone" element={<PhoneNumberPage />} />
          <Route path="/phone/verification" element={<PhoneVerificationPage />} />
          <Route path="/additional/info" element={<AdditionalUserInfoPage />} />
          <Route path="/signup-complete" element={<SignupCompletePage />} />
          
          {/* 신분증 인증 */}
          <Route path="/id/verification" element={<IDVerificationStep1 />} />
          <Route path="/id/verification/step2" element={<IDVerificationStep2/>} />
          <Route path="/id/verification/step3" element={<IDVerificationStep3/>} />
          <Route path="/id/verification/step4" element={<IDVerificationStep4/>} />

          {/* 가맹점 회원가입 경로 */}
          <Route path="/store/terms" element={<TermsAgreementPage />} />
          <Route path="/store/email" element={<EmailPasswordPage />} />
          <Route path="/store/phone" element={<PhoneNumberPage />} />
          <Route path="/store/phone/verification" element={<PhoneVerificationPage />} />
          <Route path="/store/register" element={<BusinessCertificateVerifyPage/>} />
          <Route path="/store/register/info" element={<AdditionalStoreInfoPage />} />
        </Route>

        {/* SELLER 전용 페이지 - /store 경로 */}
        <Route element={<SellerOnlyRoute />}>
          <Route path="/store/my" element={<MyPage />} />
          <Route path="/store/my/edit" element={<StoreEditInfoPage />} />
          <Route path="/store/my/settlement-report" element={<StoreSettlementReportPage />} />
          <Route path="/store/manage" element={<MyStoreManagePage />} />
          <Route path="/store/menu/add" element={<MenuAddPage />} />
          <Route path="/store/menu/edit/:menuId" element={<MenuEditPage/>} />
          <Route path="/store" element={<OrderStatusPage />} />
         
        </Route>

        {/* USER 전용 페이지 - /user 경로 */}
        <Route element={<UserOnlyRoute />}>
          <Route path="/user/my" element={<MyPage />} />
          <Route path="/user/my/edit" element={<EditInfo />} />
          <Route path="/my/payments" element={<MyPaymentHistoryPage />} />
          <Route path="/my/orders" element={<MyOrderHistoryPage/>} />
        </Route>

        {/* 로그인한 사용자라면 누구나 접근 가능한 페이지 */}
        <Route element={<ProtectedRoute />}>
          {/* 쇼핑몰 관련 페이지 */}
          <Route path="/mall" element={<ShoppingMall />} />
          <Route path="/mall/store/:id" element={<MallDetailPage />} />
          <Route path="/mall/store/cart" element={<CartPage />} />
          <Route path="/mall/store/order" element={<SelectPaymentPage />} />
          <Route path="/mall/store/order-pending" element={<LoadingPage />} />
          <Route path="/mall/store/pay-complete/:orderId" element={<PayCompletePage />} />

          {/* 코인 관련 페이지 */}
          <Route path="/coin-detail/:symbol" element={<CoinDetailPage />} />
          <Route path="/coin/address/:symbol" element={<CoinDeposit />} />
          <Route path="/coin/transaction/:symbol" element={<CoinTransaction />} />
          <Route path="/coin/address/add" element={<AddCoinAddress />} />

          {/* 토큰 관련 페이지 */}
          <Route path="/token/product/detail/:subscribeId" element={<TokenProductListPage/>}/>
          <Route path="/token/product/deposit/:subscribeId" element={<TokenDepositPage/>} />
          <Route path="/token/product/cancel/:subscribeId" element={<TokenCancelPage/>} />
          <Route path="/token/detail/:bank" element={<TokenGroupDetailPage/>} />
          <Route path="/token/exchange/:bank" element={<TokenExchangePage/>} />
          <Route path="/token/exchange/complete" element={<TokenExchangeCompletePage/>} />
          <Route path="/token/onsale/products/:productId" element={<OnSaleTokenProductDetail />} />
          <Route path="/token/onsale/products/:productId/signup" element={<TokenProductSignup />} />
          <Route path="/token/onsale/products/:productId/signup-complete" element={<TokenProductSignupComplete/>} />
          <Route path="/token/onsale/products" element={<OnSaleTokenProductListPage />} />

          {/* 기타 공통 페이지 */}
          <Route path="/settlement" element={<SettlementCoin />} />
          <Route path="/my/coin" element={<CoinHome />} />
          <Route path="/under-development" element={<UnderDevelopment />} />
          <Route path="/otp/setup" element={<OtpSetup />} />
          <Route path="/crepe/cs" element={<CustomerSupportPage />} />
        </Route>
        
        {/* 404 처리 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router