// ✅ Page 컴포넌트에서 props를 구조분해 할당으로 받아야 해
interface CryptoWalletProps {
  isUser?: boolean;
}

import CoinDetailPage from "@/components/common/CoinDetail";

export default function Page({ isUser }: CryptoWalletProps) {
  return <CoinDetailPage isUser={isUser} />;
}