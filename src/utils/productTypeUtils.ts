export function mapProductTypeToFrontend(productType: string): string {
    // 백엔드에서 받은 타입을 프론트엔드에서 읽기 쉬운 한국어로 변환
    switch (productType) {
      case "SAVING":
        return "예금";
      case "INSTALLMENT":
        return "적금";
      case "VOUCHER":
        return "상품권";
      default:
        return "알 수 없음";
    }
  }