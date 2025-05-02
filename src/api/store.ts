const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

const token = localStorage.getItem("accessToken");

// 가맹점 호원가입
export async function signUpStore(formData: FormData) {
  const response = await fetch(API_BASE_URL + "/store/signup", {
    method: "POST",
    body: formData,
  });
  return response;
}

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