///////////////////////////////////// USER 도메인 관련 API  ///////////////////////////////////////////


const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

// 인증 문자 전송 (SMS)
export async function sendSMS(phone: string, smsType: string) {
  const response = await fetch(API_BASE_URL + "/api/sms/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, smsType }),
  });
  return response;
}

// 인증 코드 검증
export async function verifySMS(code: string, phone: string, smsType: string) {
  const response = await fetch(API_BASE_URL + "/api/sms/verify", {
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
export async function loginUser({ email, password, captchaKey, captchaValue }: {
  email: string;
  password: string;
  captchaKey: string;
  captchaValue: string;
}) {
  return fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, captchaKey, captchaValue }),
  });
}

// 비밀번호 변경
export async function changePassword(
  token: string,
  data: { oldPassword: string; newPassword: string }
): Promise<void> {
  const response = await fetch(API_BASE_URL + "/api/auth/change/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "비밀번호 변경에 실패했습니다.");
  }
}

// 전화번호 변경
export async function changePhone(
  token: string,
  data: { phoneNumber: string }
): Promise<void> {
  const response = await fetch(API_BASE_URL +"/api/auth/change/phone", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "전화번호 변경에 실패했습니다.");
  }
}

// 닉네임 변경
export async function changeNickname(
  token: string,
  data: { newNickname: string }
): Promise<void> {
  const response = await fetch(API_BASE_URL +"/api/auth/change/nickname", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "닉네임 변경에 실패했습니다.");
  }
}

// 사용자 정보 조회
export async function fetchMyUserInfo(token: string) {
  const response = await fetch(API_BASE_URL +"/api/auth/myInfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }

  return await response.json();
}


