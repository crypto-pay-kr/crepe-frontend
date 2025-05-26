export interface CartItemType {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
  }
  
  export interface StoreInfoType {
    name: string;
    address: string;
    likes: number;
    isOpen: boolean;
    supportedCoins: Array<{
      name: string;
      className: string;
    }>;
  }
  