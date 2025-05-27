export async function customFetch(input: RequestInfo | URL, init?: RequestInit) {
    const token = sessionStorage.getItem("accessToken");
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  
    const mergedInit = {
      ...init,
      headers: {
        ...defaultHeaders,
        ...(init?.headers || {}),
      },
    };
  
    const response = await fetch(input, mergedInit);
  
    if (response.status === 401) {
      // 토큰 지우고 로그인 페이지로 이동
      alert("로그인이 필요합니다. 다시 로그인 해주세요.");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      window.location.href = "/login";
      throw new Error("401 Unauthorized");
    }
  
    return response;
  }