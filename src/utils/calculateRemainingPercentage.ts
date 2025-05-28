export function calculateRemainingPercentage(
    totalParticipants: number,
    currentParticipants: number
  ): number {
    if (totalParticipants === 0) return 100; // 총 참여자가 0일 경우 100% 반환
    return ((totalParticipants - currentParticipants) / totalParticipants) * 100;
  }