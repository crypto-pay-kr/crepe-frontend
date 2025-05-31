import { FreeDepositCountPreferentialRate } from "@/types/FreeDepositCountPreferentialRate ";

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"


export interface SubscribeProductRequest {
  productId: number;
  initialDepositAmount?: number;
  selectedFreeDepositRate?: FreeDepositCountPreferentialRate;
  voucherQuantity?: number;
  purpose?: string;    // backend field name is purpose
}

export interface SubscribeProductResponse {
  subscribeId: number;
  productName: string;
  productId : number;
  bankName: string;
  productType: string; 
  status: string; 
  subscribeDate: string; 
  expiredDate: string;
  balance: number;
  baseRate: number; 
  interestRate: number;
  message: string;
  voucherCode?: string;
  additionalMessage?: string;
  preferentialRate?: string;
  appliedRatesJson?: string;
  potentialMaxRate?: number;
}

// 상품 가입(구독) API 호출
export async function subscribeProduct(request: SubscribeProductRequest): Promise<SubscribeProductResponse> {
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const response = await fetch(`${API_BASE_URL}/api/product/subscribe`, {  
    method: "POST", 
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "상품 가입(구독) 요청 실패");
  }

  return response.json();
}