import { TAG_GROUPS, TAG_COLORS } from "@/constants/subscribe-condition";

export function getTagColor(tag: string): string {
  if (TAG_GROUPS.BENEFIT.includes(tag)) {
    return TAG_COLORS.BENEFIT;
  }
  if (TAG_GROUPS.HIGH_INTEREST.includes(tag)) {
    return TAG_COLORS.HIGH_INTEREST;
  }
  if (TAG_GROUPS.SAVING.includes(tag)) {
    return TAG_COLORS.SAVING;
  }
  return TAG_COLORS.DEFAULT; // 상수에 없는 태그는 기본 색상(보라색)
}