///////////////////////////////////// USER 도메인 관련 API  ///////////////////////////////////////////


const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"
import { occupationMapping } from "@/constants/occupationMapping"; 
import { ApiError } from "@/error/ApiError";


// 인증 문자 전송 (SMS)
export async function sendSMS(phone: string, smsType: string) {
  const response = await fetch(`${API_BASE_URL}/api/sms/code`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, smsType }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }

  return response;
}

// 인증 코드 검증
export async function verifySMS(code: string, phone: string, smsType: string) {
  const response = await fetch(`${API_BASE_URL}/api/sms/verify`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, phone, smsType }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.code || "UNKNOWN", response.status, body.message || "요청 실패");
  }

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
export async function processIdentityCard(file: File): Promise<any> {
  const token = sessionStorage.getItem("accessToken"); // Bearer 토큰 가져오기

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/ocr/id`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Bearer 토큰 추가
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("잘못된 요청입니다. 파일을 확인해주세요.");
    } else if (response.status === 404) {
      throw new Error("사용자를 찾을 수 없습니다.");
    } else if (response.status === 500) {
      throw new Error("서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } else {
      const errorText = await response.text();
      throw new Error(errorText || "OCR 처리 중 오류가 발생했습니다.");
    }
  }

  return await response.json(); // 성공 시 JSON 응답 반환
}

// 직업 등록 API 호출
export async function addOccupation(occupation: string): Promise<string> {
  const token = sessionStorage.getItem("accessToken"); // Bearer 토큰 가져오기

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  // 입력된 직업을 서버의 Occupation enum 값으로 매핑
  const mappedOccupation = occupationMapping[occupation];
  if (!mappedOccupation) {
    throw new Error("유효하지 않은 직업입니다. 올바른 직업을 선택해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/api/add/occupation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Bearer 토큰 추가
    },
    body: JSON.stringify({ occupation: mappedOccupation }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "직업 등록 중 오류가 발생했습니다.");
  }

  return await response.text(); // 성공 시 서버에서 반환된 메시지 반환
}

// 소득 조회 API
export async function checkActorIncome(): Promise<{
  userId: number;
  annualIncome: number;
  totalAsset: number;
}> {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/api/check/income`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "소득 조회 중 오류가 발생했습니다.");
  }

  return await response.json();
}

// 가입 자격 확인 API 호출
export async function checkEligibility(productId: number): Promise<boolean> {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }
  const url = new URL(`${API_BASE_URL}/api/product/check-eligibility`);
  url.searchParams.append("productId", productId.toString());
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
          },
  });
    if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "자격 확인 중 오류가 발생했습니다.");
  }

  return await response.json();
}
      
     
// 사용자 결제 내역 조회
export async function fetchUserPayHistory(): Promise<any> {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/api/pay`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("사용자의 결제내역 정보를 불러오지 못했습니다.");
  }

  return await response.json();
}