import { ApiError } from "@/error/ApiError";

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

export async function signUpStore(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/store/signup`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', response.status, body.message || '요청 실패');
  }
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

    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', response.status, body.message || '요청 실패');
  }
  return await response.json();
}

export async function fetchMyStoreAllDetails() {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/store/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
  return await response.json();
}


// 가맹점 정보 수정
export async function updateStoreName(newStoreName: string) {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/change/name`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ newStoreName }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', response.status, body.message || '요청 실패');
  }
  return response;
}


// 가맹점 주소 수정
export async function updateStoreAddress(newAddress: string) {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/change/address`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ newAddress }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', response.status, body.message || '요청 실패');
  }
  return response;
}

// 가맹점 메뉴 상세 조회
export async function fetchStoreMenuDetail(menuId: string) {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/menu/${menuId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
  return await response.json();
}


// 가맹점 메뉴 등록
export async function storeMenuAdd(formData: FormData) {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/menu`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', response.status, body.message || '요청 실패');
  }
  return response;
}

// 가게 영업상태 변경
export const changeStoreStatus = async (newStatus: "OPEN" | "CLOSED") => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/change/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ storeStatus: newStatus }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
};

// 가게 좋아요
export const likeStore = async (storeId: number) => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/like/${storeId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', response.status, body.message || '요청 실패');
  }
  return response;
};

// 가게 좋아요 취소
export const unlikeStore = async (storeId: number) => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/like/${storeId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', response.status, body.message || '요청 실패');
  }
  return response;
};

// 가맹점 메뉴 수정
export async function patchStoreMenu(
  menuId: string,
  formData: FormData
) {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/menu/${menuId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
}

// 가맹점 메뉴 삭제
export async function deleteStoreMenu(menuId: string) {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/menu/${menuId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
}

// 가맹점 결제 수단 설정
export async function patchStoreCoin(supportedCoins: string[]) {
  const token = sessionStorage.getItem("accessToken");
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
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
  return await response.json();
}

// ------------------------------------
//   STORE ORDER MANAGE API
// ------------------------------------

// 주문상태  목록 조회
export async function fetchOrders() {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
  const data = await response.json();
  return data;
}

export async function handleOrderAction(

  orderId: string,
  action: "accept" | "refuse" | "complete" | "cancel",
  additionalData?: Record<string, any> 
): Promise<any> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const body = {
    action,
    ...additionalData, // 추가 데이터 병합
  };

  const response = await fetch(`${API_BASE_URL}/api/store/orders/${orderId}/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = await response.json().catch(() => ({}));
    throw new ApiError(
      responseBody.code || "UNKNOWN",
      response.status,
      responseBody.message || "요청 실패"
    );
  }

  return await response.json(); // 성공 시 JSON 응답 반환
}

// 내 가게 월별 결제 내역 총합 조회
export async function getStorePayment() {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/my/settlement`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
  return await response.json();
}

// 내 가게 결제내역 상태별 수 조회
export async function getStatusCount() {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/store/my/transaction/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }
  return await response.json();
}

