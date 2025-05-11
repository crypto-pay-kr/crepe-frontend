const BASE_URL = import.meta.env.VITE_API_SERVER_URL;
const COIN_PRICE_URL = import.meta.env.VITE_COIN_PRICE_URL;
const token = localStorage.getItem("accessToken");


// 출금 계좌 등록 요청
export const registerAccountAddress = async ({ currency, address, tag, }: {
  currency: string;
  address: string;
  tag?: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/save/address`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currency, address, tag }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`계좌 등록 실패: ${res.status} - ${text}`);
  }
};


// 계좌등록 확인
export const isAccountAddressRegistered = async (currency: string) => {
  const res = await fetch(`${BASE_URL}/api/address?currency=${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('코인 주소 확인 실패');
  }

  return res.json();
};

// 계좌 재등록 요청
export const reRegisterAccountAddress = async (payload: {
  currency: string;
  address: string;
  tag?: string;
}) => {
  return await fetch(`${BASE_URL}/api/resave/address`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};


//전체 코인 잔액 조회
export const getCoinBalance = async () => {
  const response = await fetch(`${BASE_URL}/api/balance`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('잔액 조회 실패: ' + response.status);
  }
  return await response.json();
};


//특정 코인 잔액 조회
export const getCoinBalanceByCurrency = async (currency: string) => {
  const response = await fetch(`${BASE_URL}/api/balance/${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('특정 코인 잔액 조회 실패: ' + response.status);
  }

  return await response.json();
};

//코인 입금 요청
export const requestDeposit = async (currency: string, txid: string) => {

  const response = await fetch(`${BASE_URL}/api/deposit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ txid, currency }),
  });

  if (!response.ok) {
    throw new Error("입금 요청 실패: " + response.status);
  }

  return response.text(); // 응답 메시지
};


// 코인 출금 요청
export const requestWithdraw = async (currency: string, amount: string) => {
  const res = await fetch(`${BASE_URL}/api/withdraw`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currency, amount }),
  });

  if (!res.ok) {
    throw new Error('정산 요청 실패');
  }

  return await res.text();
};


//코인 내역조회
export const getCoinHistory = async ({ pageParam = 0, queryKey }: { pageParam?: number; queryKey: any }) => {
  const symbol = queryKey[1];
  const res = await fetch(`${BASE_URL}/api/history?currency=${symbol}&page=${pageParam}&size=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('입금 내역 조회 실패');
  return res.json(); // Slice 형태의 응답 객체
};



// 코인 시세 가져오기
export const fetchCoinPrices = async () => {
  try {
    const response = await fetch(`${COIN_PRICE_URL}`);
    if (!response.ok) {
      throw new Error(`시세 조회 실패: ${response.status}`);
    }

    const data = await response.json();

    // 시세 데이터를 객체 형태로 변환
    const updatedPrices = data.reduce((acc: any, item: any) => {
      acc[item.market] = item.trade_price;
      return acc;
    }, {});

    return updatedPrices; // 시세 데이터 반환
  } catch (err) {
    console.error("Error fetching coin prices:", err);
    throw err; // 에러를 호출한 쪽으로 전달
  }
};