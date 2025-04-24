export type Period = "이번달" | "지난달" | "3개월" | "6개월" | "12개월";

export interface CryptoAsset {
  name: string;
  code: string;
  logo: string;
  percentage: number;
  amount: number;
  value: number;
}