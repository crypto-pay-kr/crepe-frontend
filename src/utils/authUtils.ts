export function parseJwt(token: string) {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("JWT 파싱 중 오류 발생:", error);
      return null;
    }
  }
  
  export function getUserRoleFromToken(token: string | null): string {
    if (!token) return "";
    const decoded = parseJwt(token);
    return decoded && decoded.role ? decoded.role : "";
  }
  
  export function isSellerToken(token: string | null): boolean {
    return getUserRoleFromToken(token) === "SELLER";
  }