// src/types/store.ts

// CoinStatus 타입 정의
export interface CoinStatus {
  // 실제 필드는 백엔드 정의에 따라 추가
  name?: string;
  code?: string;
  currency?: string;
  type?: string;
}

// 지원되는 코인 종류 문자열 리터럴 타입
export type SupportedCoinType = 'XRP' | 'USDT' | 'SOL';

// 가게 목록 조회 응답 타입
export interface Store {
  storeId: number; // ID 필드 이름 변경: id → storeId
  storeName: string;
  storeImage: string;
  likeCount: number;
  storeType: string;
  coinStatus: CoinStatus[]; // 타입을 string[] → CoinStatus[]로 변경
}

// 가게 상세 조회 응답 타입
export interface StoreDetail {
  likeCount: number;
  storeName: string;
  storeAddress: string;      // 추가
  storeImageUrl: string;     // 추가
  coinStatus: CoinStatus[];
  menuList: GetMenuDetailResponse[]; // 추가
}

// 상품 타입
export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

interface GetMenuDetailResponse {
  menuId: number;
  menuName: string;
  menuPrice: number;
  menuImage: string;
}

export interface GetOneStoreDetailResponse {
  likeCount: number;
  storeName: string;
  storeAddress: string;
  storeImageUrl: string;
  coinStatus: CoinStatus[];
  menuList: GetMenuDetailResponse[];
}