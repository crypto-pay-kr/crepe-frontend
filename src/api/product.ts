import { ApiError } from '@/error/ApiError'

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

import { GetOnsaleProductListResponse } from "@/types/product";

export async function fetchOnSaleTokenProducts(): Promise<GetOnsaleProductListResponse[]> {
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  console.log("Access token:", sessionStorage.getItem("accessToken"));
  const res = await fetch(`${API_BASE_URL}/api/product`, {
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


  return await res.json();
}

import { GetProductDetailResponse } from "@/types/product";

export async function fetchProductDetail(productId: number): Promise<GetProductDetailResponse> {
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("인증 토큰이 없습니다.");
  const res = await fetch(`${API_BASE_URL}/api/product/${productId}`, {
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

  return await res.json();
}
