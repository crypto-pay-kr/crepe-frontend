import { TickerData } from '@/hooks/useTickerData'


export const calculateConversion = (
  isCoinToToken: boolean,
  coinAmount: number,
  tokenAmount: number,
  rate: number,
  tokenPrice: number
) => {
  if (isCoinToToken) {
    if (!coinAmount) return 0;
    return (coinAmount * rate) / tokenPrice;
  } else {
    if (!tokenAmount) return 0;
    return (tokenAmount * tokenPrice) / rate;
  }
};

// 실시간 시세 기반 자본금 계산
export function calculateAvailableCapital(
  portfolios: any[],
  tickerData: Record<string, TickerData>
): number {
  return portfolios.reduce((sum, p) => {
    const rate = tickerData[`KRW-${p.currency}`]?.trade_price ?? 0;
    const available = p.amount - (p.nonAvailableAmount || 0);
    return sum + available * rate;
  }, 0);
}

export function calculateTokenPrice(
  totalCapital: number,
  totalSupply: number
): number {
  if (!totalSupply || totalSupply === 0) return 0;
  return totalCapital / totalSupply;
}

// 최대 교환 가능한 코인 수량 계산
export function calculateMaxExchangeCoin({
                                           tokenInfo,
                                           selectedCurrency,
                                         }: {
  tokenInfo: any;
  selectedCurrency: string;
  tokenCapital: number;
  tickerData: Record<string, TickerData>;
}): string {
  if (!tokenInfo || !selectedCurrency) return '-';

  const portfolio = tokenInfo.portfolios.find(
    (p: any) => p.currency === selectedCurrency && p.nonAvailableAmount != null
  );
  if (!portfolio) return '-';
  const result = Math.max(0,portfolio.nonAvailableAmount);
  return result.toFixed(2);

}

// 최대 교환 가능한 토큰 수량 계산
export function calculateMaxExchangeToken({
                                            tokenInfo,
                                            selectedCurrency,
                                            tokenCapital,
                                            tickerData,
                                          }: {
  tokenInfo: any;
  selectedCurrency: string;
  tokenCapital: number;
  tickerData: Record<string, TickerData>;
}): string {
  if (!tokenInfo || !selectedCurrency || !tokenCapital || !tokenInfo.tokenBalance) return '-';

  const tokenPrice = tokenCapital / tokenInfo.tokenBalance;
  const coinRate = tickerData[`KRW-${selectedCurrency}`]?.trade_price ?? 0;

  const portfolio = tokenInfo.portfolios.find((p: any) => p.currency === selectedCurrency);
  const available = (portfolio?.amount ?? 0) - (portfolio?.nonAvailableAmount ?? 0);

  if (coinRate === 0 || tokenPrice === 0) return '-';

  const availableCapital = Math.max(0, available * coinRate);
  return availableCapital.toFixed(2);
}