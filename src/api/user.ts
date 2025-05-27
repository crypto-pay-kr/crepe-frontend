///////////////////////////////////// USER 도메인 관련 API  ///////////////////////////////////////////


const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"

// 인증 문자 전송 (SMS)
export async function sendSMS(phone: string, smsType: string) {
  const response = await fetch(`${API_BASE_URL}/api/sms/code`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, smsType }),
  });
  return response;
}

// 인증 코드 검증
export async function verifySMS(code: string, phone: string, smsType: string) {
  const response = await fetch(`${API_BASE_URL}/api/sms/verify`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, phone, smsType }),
  });
  return response;
}

// 이메일 중복 확인
export async function checkEmailDuplicate(email: string): Promise<string | null> {
  const response = await fetch(`${API_BASE_URL}/api/check/email-duplicate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (response.status === 200) {
    return null; 
  } else if (response.status === 403) {
    const errorData = await response.json();
    return errorData.message; 
  } else {
    // 기타 오류 처리
    const errorText = await response.text();
    throw new Error(errorText || "이메일 중복 확인 중 오류가 발생했습니다.");
  }
}

// 닉네임 중복 확인
export async function checkNicknameDuplicate(nickname: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/check/nickname-duplicate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });

  if (response.status === 200) {
    return false;
  } else if (response.status === 403) {
    const errorData = await response.json();
    return errorData.message; 
  } else {
    const errorText = await response.text();
    throw new Error(errorText || "닉네임 중복 확인 중 오류가 발생했습니다.");
  }
}


//  회원가입
export async function signUpUser(requestBody: any) {
  const response = await fetch(`${API_BASE_URL}/api/user/signup`, {
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
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, captchaKey, captchaValue }),
  });

  return response;
}

// 비밀번호 변경
export async function changePassword(
  data: { oldPassword: string; newPassword: string }
): Promise<void> {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/change/password`, {
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
  data: { phoneNumber: string }
): Promise<void> {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/change/phone`, {
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
  data: { newNickname: string }
): Promise<void> {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/change/nickname`, {
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
export async function fetchMyUserInfo() {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/user/my`, {
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

// 신분증/면허증 OCR 처리 API 호출
export async function processIdentityCard(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/ocr/id-card`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("OCR 처리 중 오류가 발생했습니다.");
  }
  return await response.json();
}


// 사용자 결제 내역 조회
export async function fetchUserPayHistory() {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/pay`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    throw new Error("사용자의 결제내역 정보를 불러오지 못했습니다.");
  }

  return await response.json();
}



