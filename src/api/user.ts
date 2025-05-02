///////////////////////////////////// USER 도메인 관련 API  ///////////////////////////////////////////


const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

// 인증 문자 전송 (SMS)
export async function sendSMS(phone: string, smsType: string) {
  const response = await fetch(API_BASE_URL + "/sms/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, smsType }),
  });
  return response; 
}

// 인증 코드 검증
export async function verifySMS(code: string, phone: string, smsType: string) {
  const response = await fetch(API_BASE_URL + "/sms/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, phone, smsType }),
  });
  return response;
}

//  회원가입
export async function signUpUser(requestBody: any) {
  const response = await fetch(API_BASE_URL + "/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  return response;
}


// 로그인(가맹점 및 일반회원 공통)
export async function loginUser(email: string, password: string) {
  const response = await fetch(API_BASE_URL + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response;
}