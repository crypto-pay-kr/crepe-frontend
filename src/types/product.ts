import { BankProductType } from "@/constants/subscribe-condition";

export interface GetOnsaleProductListResponse {
  id: number;
  type: string;
  productName: string;
  bankName: string;
  totalBudget: number;
  remainingBudget: number;
  totalParticipants: number;
  currentParticipants: number;
  status: string;
  minInterestRate: number;
  maxInterestRate: number;
  imageUrl: string;
  tags: string[];
  guideFile: string;
  deadline: string;
}

export interface JoinConditionDto {
  ageGroups: string[];
  occupations: string[];
  incomeLevels: string[];
  allAges: boolean;
}

export interface PreferentialConditionDto {
  id: number;
  title: string;
  rate: number;
  description: string;
}

export interface GetOnsaleProductListResponse {
  id: number;
  type: string;
  productName: string;
  bankName: string;
  totalBudget: number;
  remainingBudget: number;
  totalParticipants: number;
  currentParticipants: number;
  status: string;
  minInterestRate: number;
  maxInterestRate: number;
  imageUrl: string;
  tags: string[];
  guideFile: string;
  deadline: string;
}

export interface GetProductDetailResponse {
  id: number;
  productName: string;
  bankName: string;
  type: BankProductType;
  baseInterestRate: number;
  joinCondition: JoinConditionDto;
  maxParticipants: number;
  maxMonthlyPayment: string;
  rateConditions: PreferentialConditionDto[];
  guideFile: string;
  imageUrl: string;
  budget: string;
  tags: string[];
  subscribeCount: number;
  startDate: string;
  endDate: string;
}