const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"


const token = localStorage.getItem("accessToken");
export async function signUpStore(formData: FormData) {
  const response = await fetch(API_BASE_URL + "/store/signup", {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function storeMenuAdd(formData: FormData)  {
  const response = await fetch(API_BASE_URL + "/store/menu", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
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
  });
  return response;
}

export async function fetchMyStoreAllDetails(token: string) {
  const response = await fetch(API_BASE_URL + "/store/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("내 가게 정보를 불러올 수 없습니다.");
  }

  return await response.json();
}
