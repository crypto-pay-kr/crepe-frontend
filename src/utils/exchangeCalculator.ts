// utils/exchangeCalculator.ts

/**
 *  교환 로직 가능 한 수량 계산
 */
export const calculateConversion = (
  isCoinToToken: boolean,
  coinAmount: number,
  tokenAmount: number,
  rate: number,
  tokenPrice: number
) => {
  if (isCoinToToken) {
    if (!coinAmount) return 0;
    return coinAmount* rate / tokenPrice;
  } else {
    if (!tokenAmount) return 0;
    return tokenAmount * tokenPrice / rate;
  }
};



/**
 * 실시간 시세와 포트폴리오를 기반으로 자본금(총 원화 가치)을 계산
 */
export function calculateAvailableCapital(
  portfolios: any[],
  coinPrice: Record<string, number>
): number {
  return portfolios.reduce((sum, p) => {
    const rate = coinPrice[`KRW-${p.currency}`] || 0;
    const available = p.amount - (p.nonAvailableAmount || 0);
    return sum + available * rate;
  }, 0);
}


/**
 * 토큰 단가 = 총 자본금 / 현재 토큰양
 */
export function calculateTokenPrice(
  totalCapital: number,
  totalSupply: number
): number {
  if (!totalSupply || totalSupply === 0) return 0;
  return totalCapital / totalSupply;
}




/**
 * 코인으로 교환가능한 최대 갯수
 */
export function calculateMaxExchangeCoin({ tokenInfo, selectedCurrency,tokenCapital, coinPrice, }: {
  tokenInfo: any;
  selectedCurrency: string;
  tokenCapital: number;
  coinPrice: Record<string, number>;
}): string {
  if (!tokenInfo || !selectedCurrency || !tokenCapital || !tokenInfo.totalSupply) return '-';

  const tokenPrice = tokenCapital / tokenInfo.totalSupply;
  const coinRate = coinPrice[`KRW-${selectedCurrency}`] || 0;

  const portfolio = tokenInfo.portfolios.find((p: any) => p.currency === selectedCurrency);
  if (!portfolio) return '-';

  const availableKRW = (portfolio.amount ?? 0) - (portfolio.nonAvailableAmount ?? 0);
  const availableCapital = availableKRW * coinRate;

  const maxToken = availableCapital / tokenPrice;
  const maxCoin = (maxToken * tokenPrice) / coinRate;

  return maxCoin.toFixed(2);
}


/**
* 토큰으로 교환 가능한 최대갯수
 */

 export function calculateMaxExchangeToken({ tokenInfo, selectedCurrency, tokenCapital, coinPrice, }: {
  tokenInfo: any;
  selectedCurrency: string;
  tokenCapital: number;
  coinPrice: Record<string, number>;
}): string {
  if (!tokenInfo || !selectedCurrency || !tokenCapital || !tokenInfo.tokenBalance) return '-';

  const tokenPrice = tokenCapital / tokenInfo.tokenBalance;
  const coinRate = coinPrice[`KRW-${selectedCurrency}`] || 0;

  const portfolio = tokenInfo.portfolios.find((p: any) => p.currency === selectedCurrency);
  const available = (portfolio?.amount ?? 0) - (portfolio?.nonAvailableAmount ?? 0);

  if (coinRate === 0 || tokenPrice === 0) return '-';

  const availableCapital = available * coinRate;
  const maxToken = availableCapital / tokenPrice;

  return maxToken.toFixed(2);
}
