const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"


const token = localStorage.getItem("accessToken");


export async function signUpStore(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/store/signup`, {
    method: "POST",
    body: formData,
  });
  return response;
}

// 사업자등록증 OCR
export async function uploadBusinessLicense(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/ocr/business-license`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("사업자등록증 업로드 중 오류가 발생했습니다.");
  }
  return await response.json();
}




export async function fetchMyStoreAllDetails(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/store/my`, {
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

// 가맹점 메뉴 상세 조회
export async function fetchStoreMenuDetail(token: string, menuId: string) {
  const response = await fetch(`${API_BASE_URL}/api/store/menu/${menuId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("메뉴 상세 조회에 실패했습니다.");
  }
  return await response.json();
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

// 가맹점 메뉴 수정
export async function patchStoreMenu(
  token: string,
  menuId: string,
  formData: FormData
) {
  const response = await fetch(`${API_BASE_URL}/api/store/menu/${menuId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "메뉴 수정에 실패했습니다.");
  }
}



// 가맹점 메뉴 삭제
export async function deleteStoreMenu(token: string, menuId: string) {
  const response = await fetch(`${API_BASE_URL}/api/store/menu/${menuId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "메뉴 삭제에 실패했습니다.");
  }
}

// 가맹점 결제 수단 설정
export async function patchStoreCoin(token: string, supportedCoins: string[]) {
  const response = await fetch(`${API_BASE_URL}/api/store/select/coin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      supportedCoins,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "코인 지원 설정 업데이트 실패");
  }
  return await response.json();
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

