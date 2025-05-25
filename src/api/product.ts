const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

import { GetOnsaleProductListResponse } from "@/types/product";

export async function fetchOnSaleTokenProducts(): Promise<GetOnsaleProductListResponse[]> {
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  console.log("Access token:", sessionStorage.getItem("accessToken"));
  const response = await fetch(`${API_BASE_URL}/api/product`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "상품 목록 조회 실패");
  }

  return await response.json();
}

import { GetProductDetailResponse } from "@/types/product";

export async function fetchProductDetail(productId: number, token: string): Promise<GetProductDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/api/product/${productId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "상품 상세 조회 실패");
  }

  return await response.json();
}
