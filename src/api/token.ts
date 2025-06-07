import { ApiError } from '@/error/ApiError'

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080";

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

// 상품 구독 중도 해지
export const terminateSubscription = async (subscribeId: string) => {
  const token = sessionStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/api/expired/terminate/${subscribeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    console.warn("API 오류 응답 본문:", body);
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }

  return await res.text();
};


// 상품 예치
export const depositToken = async (subscribeId: string, amount: number) => {
  const accessToken = sessionStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE_URL}/api/deposit/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      subscribeId,
      amount,
      traceId,
    }),
  });

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }


  return await res.text();
};

// 내 가입 상품 목록 조회
export const GetMyTokenList = async () => {
  const token = sessionStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/api/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }

  return await res.json();
};

// 중도해지시 잔액 정보 조회
export  const GetTerminatePreview = async (subscribeId: string) => {
  const token = sessionStorage.getItem('accessToken');

  const res = await fetch(`${API_BASE_URL}/api/subscribe/preview/${subscribeId}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }


  return await res.json();
};

// 내 가입 상품 거래내역 조회
export const GetMySubscribeTransactionList = async (subscribeId: number, page:number, size: number = 3) => {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const res = await fetch(`${API_BASE_URL}/api/subscribe/history/${subscribeId}?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }


  return await res.json();
};

export const getTokenInfo = async (currency: string) => {
  const token = sessionStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}/api/exchange/info?currency=${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
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
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }

  return await res.text(); // 문자열 응답 처리
};



export const fetchTokenExchangeHistory = async (
  currency: string,
  page: number = 0,
  size: number = 5
) => {
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

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }


  return await res.json();
};

export async function fetchTokenBalance(currency: string): Promise<number> {
  const token = sessionStorage.getItem('accessToken');

  const res = await fetch(`${BASE_URL}/api/token/balance/${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }


  return await res.json();
};

export const requestTransfer = async (email: string, currency: string, amount: number) => {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/api/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      receiverEmail: email,
      currency,
      amount,
      traceId
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "송금 요청 실패");
  }

  return await response.text(); // "송금요청 완료"
};


export const fetchReceiverName = async (email: string, currency: string): Promise<string> => {
  const token = sessionStorage.getItem("accessToken");

  const params = new URLSearchParams();
  params.append("email", email);
  params.append("currency", currency);

  const response = await fetch(`${BASE_URL}/api/receiver-name?${params.toString()}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "수신자 이름 조회 실패");
  }

  return await response.text();
};
