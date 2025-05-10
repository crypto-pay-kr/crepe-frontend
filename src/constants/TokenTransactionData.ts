export interface TokenTransaction {
  code: string;
  history: {
    status:
      | "입금 완료"
      | "출금 완료"
      | "충전 완료"
      | "예치 완료"
      | "이자 지급";
    type: "group" | "product";
    amount: number;
    date: string;
    krw: number;
  }[];
}

export const dummyTokenTransactions: TokenTransaction[] = [
  // 그룹 토큰 거래 내역 (예치, 환전, 출금 등)
  {
    code: "woori-token",
    history: [
      {
        status: "충전 완료",
        type: "group",
        amount: 5000,
        date: "2025-05-01 09:00",
        krw: 5000000,
      },
      {
        status: "출금 완료",
        type: "group",
        amount: -1000,
        date: "2025-05-06 10:00",
        krw: 1000000,
      },
    ],
  },

  // 상품 토큰 거래 내역
  {
    code: "Minor-jump-TWmj2",
    history: [
      {
        status: "예치 완료",
        type: "product",
        amount: 2000,
        date: "2025-05-02 11:00",
        krw: 2000000,
      },
      {
        status: "이자 지급",
        type: "product",
        amount: 100,
        date: "2025-05-08 09:00",
        krw: 100000,
      },
    ],
  },
  {
    code: "Seoul-love-cui2kd",
    history: [
      {
        status: "예치 완료",
        type: "product",
        amount: 1000,
        date: "2025-05-03 12:00",
        krw: 1000000,
      },
      {
        status: "이자 지급",
        type: "product",
        amount: 20,
        date: "2025-05-08 09:00",
        krw: 20000,
      },
    ],
  },
];
