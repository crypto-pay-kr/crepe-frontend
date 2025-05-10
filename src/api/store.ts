const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"


const token = localStorage.getItem("accessToken");


export async function signUpStore(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/store/signup`, {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function fetchMyStoreAllDetails(token: string) {
  const response = await fetch(API_BASE_URL + "/store/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("내 가게 정보를 불러올 수 없습니다.");
  }

  return await response.json();
}


// 가맹점 정보 수정
export async function updateStoreName(token: string, newStoreName: string) {
  const response = await fetch(`${API_BASE_URL}/api/store/change/name`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ newStoreName }),
  });
  return response;
}


// 가맹점 주소 수정
export async function updateStoreAddress(token: string, newAddress: string) {
  const response = await fetch(`${API_BASE_URL}/api/store/change/address`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ newAddress }),
  });
  return response;
}



// 가맹점 메뉴 등록
export async function storeMenuAdd(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/store/menu`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  return response;
}






// ------------------------------------
//   STORE ORDER MANAGE API
// ------------------------------------


// 주문상태  목록 조회
export async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/api/store/orders`, {
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
  const response = await fetch(`${API_BASE_URL}/api/store/orders/${orderId}/action`, {
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
  const response = await fetch(`${API_BASE_URL}/api/store/orders/${orderId}/action`, {
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
  const response = await fetch(`${API_BASE_URL}api//store/orders/${orderId}/action`, {
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

