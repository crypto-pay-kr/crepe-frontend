// 가게 정보 타입
export interface Store {
  id: number;
  name: string;
  image: string;
  tags: string[];
  likes: number;
}

// 메뉴 아이템 타입
export interface MenuItem {
  id: number;
  name: string;
  price: string;
  currency: string;
  image: string;
}

// 장바구니 아이템 타입
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeId: number;
}