import { Store, StoreDetail } from "@/types/store";

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

// 열려있는 가게 목록 조회
export async function getStoreList(): Promise<Store[]> {
  const response = await fetch(`${API_BASE_URL}/store`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJUeXBlIjoiVVNFUiIsImVtYWlsIjoidXNlckBjcmVwZS5jby5rciIsInN1YiI6InVzZXJAY3JlcGUuY28ua3IiLCJpYXQiOjE3NDYyNTY1NzUsImV4cCI6MTc0NjI2MDE3NX0.3aPjQftJ8eV-eComQaJhA0YhVF9vdPapL7L3eZYCqpu8Z8j949LwR5wtCi3JsuWt`
    },
  });

  if (!response.ok) {
    throw new Error("가게 목록을 불러오는데 실패했습니다");
  }
  return response.json();
}

// 특정 가게(id) 정보조회
export async function getStoreDetail(storeId: number | string): Promise<StoreDetail> {
  const response = await fetch(`${API_BASE_URL}/store/${storeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJUeXBlIjoiVVNFUiIsImVtYWlsIjoidXNlckBjcmVwZS5jby5rciIsInN1YiI6InVzZXJAY3JlcGUuY28ua3IiLCJpYXQiOjE3NDYyNTY1NzUsImV4cCI6MTc0NjI2MDE3NX0.3aPjQftJ8eV-eComQaJhA0YhVF9vdPapL7L3eZYCqpu8Z8j949LwR5wtCi3JsuWt`
    },
  });

  if (!response.ok) {
    throw new Error("가게 상세 정보를 불러오는데 실패했습니다");
  }

  return response.json();
}
