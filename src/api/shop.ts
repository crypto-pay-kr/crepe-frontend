///////////////////////////////////// 쇼핑몰 도메인 관련 API  ///////////////////////////////////////////

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080";

// 특정 가게의 전체 정보 조회
export async function fetchStoreDetail(storeId: number) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/store/${storeId}`, {
    method: "GET",
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

