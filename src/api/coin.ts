import { ApiError } from '@/error/ApiError'

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

// 출금 계좌 등록 요청
export const registerAccountAddress = async ({ currency, address, tag, }: {
  currency: string;
  address: string;
  tag?: string;
}) => {
  const token = sessionStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/api/save/address`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currency, address, tag }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", res.status, body.message || "계좌 등록 실패");
  }
};


// 계좌등록 확인
export const isAccountAddressRegistered = async (currency: string) => {
  const token = sessionStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/api/address?currency=${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", res.status, body.message || "코인 주소 확인 실패");
  }

  return res.json();
};

// 계좌 재등록 요청
export const reRegisterAccountAddress = async (payload: {
  currency: string;
  address: string;
  tag?: string;
}) => {
  const token = sessionStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/api/resave/address`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", res.status, body.message || "계좌 재등록 실패");
  }
};


//전체 코인 잔액 조회
export const getCoinBalance = async () => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/api/balance`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "잔액 조회 실패");
  }
  return await response.json();
};


//특정 코인 잔액 조회
export const getCoinBalanceByCurrency = async (currency: string) => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/api/balance/${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "특정 코인 잔액 조회 실패");
  }

  return await response.json();
};

//코인 입금 요청
export const requestDeposit = async (currency: string, txid: string, traceId:string) => {
  const token = sessionStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}/api/deposit`, {
    method: 'POST',
    headers: {
      'Trace-Id': traceId,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ txid, currency }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }

  return res.text(); // 응답 메시지
};


// 코인 출금 요청
export const requestWithdraw = async (currency: string, amount: string, traceId:string) => {
  const token = sessionStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/api/withdraw`, {
    method: 'POST',
    headers: {
      'Trace-Id': traceId,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currency, amount }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }
  return await res.text();
};


//코인 내역조회
export const getCoinHistory = async ({ pageParam = 0, queryKey }: { pageParam?: number; queryKey: any }) => {
  const token = sessionStorage.getItem("accessToken");
  const symbol = queryKey[1];
  const res = await fetch(`${BASE_URL}/api/history/coin?currency=${symbol}&page=${pageParam}&size=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", res.status, body.message || "내역 조회 실패");
  }

  return res.json();
};



export async function unRegisterAccountAddress(currency: string): Promise<void> {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/api/unregister/address?currency=${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "계좌 등록 해제 실패");
  }
}

export const getCoinInfo = async (currency: string) => {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/api/coin/info/${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "코인 정보 조회 실패");
  }
  return await response.json();
}


