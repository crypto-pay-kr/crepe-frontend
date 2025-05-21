
const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080";
// import { GetTransactionHistoryResponse, SliceResponse } from '@/app/token/my-product/detail/my-product-detail'

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

// 상품 구독 중도 해지
export const terminateSubscription = async (subscribeId: string) => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/expired/terminate/${subscribeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.warn("상품 목록 조회 실패:", e);
    }

    throw new Error(errorMessage);
  }


  return await response.text();
};


// 상품 예치
export const depositToken = async (subscribeId: string, amount: number) => {
  const accessToken = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/deposit/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      subscribeId,
      amount,
    }),
  });

  if (!response.ok) {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.warn("상품 목록 조회 실패:", e);
    }

    throw new Error(errorMessage);
  }


  return await response.text();
};

// 내 가입 상품 목록 조회
export const GetMyTokenList = async () => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.warn("상품 목록 조회 실패:", e);
    }

    throw new Error(errorMessage);
  }

  return await response.json();
};

// 내 가입 상품 거래내역 조회
export const GetMySubscribeTransactionList = async (subscribeId: string, page:number, size: number = 3) => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/subscribe/history/${subscribeId}?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
=======
// import { GetTransactionHistoryResponse, SliceResponse } from '@/app/token/my-product/detail/my-product-detail'

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;


export const getTokenInfo = async (currency: string) => {
  const token = sessionStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}/api/exchange/info?currency=${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`토큰 정보 조회 실패: ${res.status}`);
  }

  return await res.json();
};


export const requestExchange = async (
  isCoinToToken: boolean,
  requestData: {
    fromCurrency: string;
    toCurrency: string;
    coinRates: Record<string, number>;
    tokenAmount: number;
    coinAmount: number;
  }
) => {
  const token = sessionStorage.getItem("accessToken");
  const endpoint = isCoinToToken ? "/api/exchange/token" : "/api/exchange/coin";

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });

  if (!res.ok) {
    throw new Error(`환전 요청 실패: ${res.status}`);
  }

  return await res.text(); // 문자열 응답 처리
};



export const fetchTokenExchangeHistory = async (
  currency: string,
  page: number = 0,
  size: number = 5
)=> {
  const token = sessionStorage.getItem("accessToken");

  const params = new URLSearchParams();
  params.append("currency", currency);
  params.append("page", page.toString());
  params.append("size", size.toString());

  const res = await fetch(`${BASE_URL}/api/history/token?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`환전 내역 조회 실패: ${res.status}`);
  }

  return await res.json();
};

export async function fetchTokenBalance(currency: string): Promise<number> {
  const token = sessionStorage.getItem('accessToken');

  const response = await fetch(`/api/token/balance/${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.warn("상품 목록 조회 실패:", e);
    }

    throw new Error(errorMessage);
  }


  return await response.json();
};

    throw new Error(`잔액 조회 실패: ${response.status}`);
  }

  const balance = await response.json();
  return balance;
}

