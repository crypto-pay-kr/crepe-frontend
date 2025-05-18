// utils/exchangeCalculator.ts

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

export function calculateTokenPrice(
  totalCapital: number,
  totalSupply: number
): number {
  if (!totalSupply || totalSupply === 0) return 0;
  return totalCapital / totalSupply;
}

export function calculateTokenAmount(
  coinAmount: number,
  coinRate: number,
  tokenPrice: number
): number {
  if (!coinRate || !tokenPrice) return 0;
  const krwValue = coinAmount * coinRate;
  return krwValue / tokenPrice;
}

export function calculateCoinAmountFromToken(
  tokenAmount: number,
  tokenPrice: number,
  coinRate: number
): number {
  if (!tokenPrice || !coinRate) return 0;
  const krwValue = tokenAmount * tokenPrice;
  return krwValue / coinRate;
}

export function calculateMaxTokenExchangeable(
  availableAmount: number,
  coinRate: number,
  tokenPrice: number
): number {
  if (!coinRate || !tokenPrice) return 0;
  const krwValue = availableAmount * coinRate;
  return krwValue / tokenPrice;
}
