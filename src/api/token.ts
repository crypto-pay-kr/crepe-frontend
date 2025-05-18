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