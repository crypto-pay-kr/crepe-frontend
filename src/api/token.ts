const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080";

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
