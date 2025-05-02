///////////////////////////////////// USER 도메인 관련 API  ///////////////////////////////////////////


const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080"



const API_ENDPOINTS = {

  // 회원가입 및 로그인
  SEND_SMS: `${API_BASE_URL}/sms/code`,
  VERIFY_SMS: `${API_BASE_URL}/sms/verify`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGIN: `${API_BASE_URL}/api/auth/login`

};

export default API_ENDPOINTS;