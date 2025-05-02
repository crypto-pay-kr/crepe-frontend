const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"


const token = localStorage.getItem("accessToken");



export async function signUpStore(formData: FormData) {
  const response = await fetch(API_BASE_URL + "/store/signup", {
    method: "POST",
    body: formData,
  });
  return response;
}


export async function updateStoreName(token: string, newStoreName: string) {
  const response = await fetch(API_BASE_URL + "/store/change/name", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ newStoreName }),
  });
  return response;
}

export async function updateStoreAddress(token: string, newAddress: string) {
  const response = await fetch(API_BASE_URL + "/store/change/address", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ newAddress }),

// 가맹점 메뉴 등록
export async function storeMenuAdd(formData: FormData)  {
const response = await fetch(`${API_BASE_URL}/store/menu`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return response;
}