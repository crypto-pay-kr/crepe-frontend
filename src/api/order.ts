import { ApiError } from '@/error/ApiError'

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080";

import { OrderRequest } from "@/types/order";

export const createOrder = async (orderRequest: OrderRequest) => {
  const token = sessionStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE_URL}/api/orders/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderRequest),
  });

  if (!res.ok) {
    const body = await res.text(); // JSON 아님 대비
    console.error("주문 실패 응답 (text):", res.status, body);
    throw new ApiError('UNKNOWN', res.status, '요청 실패');
  }

  return res.text();
};


export async function getOrderDetails(orderId: string): Promise<any> {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch order details with status ${response.status}`);
    }
    return response.json();
  }

  export async function getOrderHistory() {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch order details with status ${response.status}`);
    }
    return response.json();
  }


// 가입 바우처 조회 API 호출
export async function getMyVouchers() {
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const res = await fetch(`${API_BASE_URL}/api/subscribe/vouchers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok)
  {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.code || 'UNKNOWN', res.status, body.message || '요청 실패');
  }


  return res.json();
}

