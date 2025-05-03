const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

const token = localStorage.getItem("accessToken");

// 가맹점 호원가입
export async function signUpStore(formData: FormData) {
  const response = await fetch(API_BASE_URL + "/store/signup", {
    method: "POST",
    body: formData,
  });
  return response;
}

// 가맹점 메뉴 등록
export async function storeMenuAdd(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/store/menu`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return response;
}







// ------------------------------------
//   STORE ORDER API
// ------------------------------------


// 주문상태  목록 조회
export async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/store/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}


// 주문 수락
export async function acceptOrder(orderId: string, preparationTime: string) {
  const response = await fetch(`${API_BASE_URL}/store/orders/${orderId}/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: "accept",
      preparationTime,
    }),
  });
  return response;
}

// 주문 거절
export async function rejectOrder(orderId: string, refusalReason: string) {
  const response = await fetch(`${API_BASE_URL}/store/orders/${orderId}/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: "refuse",
      refusalReason,
    }),
  });
  return response;
}

// 준비 완료
export async function completeOrder(orderId: string) {
  const response = await fetch(`${API_BASE_URL}/store/orders/${orderId}/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: "complete",
    }),
  });
  return response;
}