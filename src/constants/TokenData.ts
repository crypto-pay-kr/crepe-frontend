// components/token/tokenData.ts
import { BankLogoProps } from '@/components/common/BankLogo'

export interface TokenItem {
  name: string;
  code: string;
  amount: string;
  evaluated: string;
  rate: string;
}

export interface TokenGroup {
  groupName: string;
  bank: BankLogoProps["bank"];
  total: string;
  tokens: TokenItem[];
}


export const dummyTokenData: TokenGroup[] = [
  {
    groupName: "우리-토큰",
    bank: "woori",
    total: "5000 KRW", // 전체 보유량 (상품 포함 + 예치 안 된 잔액 포함)
    tokens: [
      {
        name: "우리청년도약토큰",
        code: "Minor-jump-TWmj2",
        amount: "2000 KRWT",
        evaluated: "2100 KRWT", // 이자 반영
        rate: "5.0%",
      },
      {
        name: "우리서울사랑토큰",
        code: "Seoul-love-cui2kd",
        amount: "1000 KRWT",
        evaluated: "1020 KRWT",
        rate: "2.0%",
      },
    ],
  },
  {
    groupName: "신한-토큰",
    bank: "shinhan",
    total: "1000 KRW",
    tokens: [
      {
        name: "신한청년도약토큰",
        code: "Minor-jump-Tsmj2",
        amount: "1000 KRWT",
        evaluated: "1010 KRWT",
        rate: "5.6%",
      },
    ],
  },
];
