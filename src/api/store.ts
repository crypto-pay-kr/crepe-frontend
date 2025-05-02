const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

// 가맹점 호원가입
export async function signUpStore(formData: FormData) {
  const response = await fetch(API_BASE_URL + "/store/signup", {
    method: "POST",
    body: formData,
  });
  return response;
}