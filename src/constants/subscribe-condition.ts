export interface InterestRateCategory {
    id: string;
    name: string;
    description: string;
    rate: string;
    type: string;
  }
  
  /**
   * 금액 카테고리
   */
  export const AMOUNT_CATEGORIES: InterestRateCategory[] = [
    { id: "SMALL", name: "소액", description: "1천만원 미만", rate: "0", type: "AMOUNT" },
    { id: "MEDIUM", name: "중액", description: "1천만원 이상 5천만원 미만", rate: "0.2", type: "AMOUNT" },
    { id: "LARGE", name: "고액", description: "5천만원 이상 1억원 미만", rate: "0.3", type: "AMOUNT" },
    { id: "PREMIUM", name: "프리미엄", description: "1억원 이상", rate: "0.5", type: "AMOUNT" },
  ];
  
  /**
   * 자유납입 카테고리
   */
  export const DEPOSIT_CATEGORIES: InterestRateCategory[] = [
    { id: "NONE", name: "없음", description: "자유 납입 없음", rate: "0", type: "DEPOSIT" },
    { id: "LEVEL1", name: "초급", description: "월 3회 이상 자유 납입", rate: "0.1", type: "DEPOSIT" },
    { id: "LEVEL2", name: "중급", description: "월 5회 이상 자유 납입", rate: "0.2", type: "DEPOSIT" },
    { id: "LEVEL3", name: "고급", description: "월 10회 이상 자유 납입", rate: "0.3", type: "DEPOSIT" },
  ];
  
  // 자격 조건 옵션
  export const AGE_OPTIONS = [
    { id: "YOUTH", label: "청년" },
    { id: "MIDDLE_AGED", label: "중장년" },
    { id: "SENIOR", label: "노년" },
    { id: "ALL_AGES", label: "전연령대" },
  ];
  
  export const OCCUPATION_OPTIONS = [
    { id: "ALL_OCCUPATIONS", label: "제한 없음" },
    { id: "EMPLOYEE", label: "직장인" },
    { id: "SELF_EMPLOYED", label: "자영업자" },
    { id: "PUBLIC_SERVANT", label: "공무원" },
    { id: "MILITARY", label: "군인" },
    { id: "STUDENT", label: "학생" },
    { id: "HOUSEWIFE", label: "주부" },
    { id: "UNEMPLOYED", label: "무직" },
  ];
  
  export const INCOME_OPTIONS = [
    { id: "LOW_INCOME", label: "저소득층" },
    { id: "LIMITED_INCOME", label: "소득제한(월 5천 이하)" },
    { id: "NO_LIMIT", label: "제한없음" },
  ];


export type BankProductType = "SAVING" | "VOUCHER" | "INSTALLMENT";
  
  /**
   * 태그 목록
   */
export const TAG_COLORS = {
  BENEFIT: "bg-red-100 text-red-800", // 세제혜택, 청년우대, 노년층우대
  HIGH_INTEREST: "bg-yellow-100 text-yellow-800", // 고금리, 단기예금, 장기예금, 외화예금
  SAVING: "bg-green-100 text-green-800", // 자유적금, 정기적금, 주택청약, 연금저축
  DEFAULT: "bg-purple-100 text-purple-800", // 기본 색상 (상수에 없는 태그)
};

export const TAG_GROUPS = {
  BENEFIT: ["세제혜택", "청년우대", "노년층우대"],
  HIGH_INTEREST: ["고금리", "단기예금", "장기예금", "외화예금"],
  SAVING: ["자유적금", "정기적금", "주택청약", "연금저축"],
};

export const AVAILABLE_TAGS: string[] = [
  ...TAG_GROUPS.BENEFIT,
  ...TAG_GROUPS.HIGH_INTEREST,
  ...TAG_GROUPS.SAVING,
];