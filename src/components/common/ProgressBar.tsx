import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants/colors";

interface ProgressBarProps {
  progress: number;
  isStore?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  isStore = false,
  className = ""
}: ProgressBarProps) {
  const totalSteps = isStore ? 6 : 5;
  const [displayPercentage, setDisplayPercentage] = useState<number>(0);
  
  // 현재 상태의 퍼센트 계산
  const targetPercentage: number = Math.min(100, Math.max(0, (progress / (totalSteps - 1)) * 100));
  
  // 이전 상태의 퍼센트 계산 (progress가 1보다 작으면 0으로 설정)
  const previousPercentage: number = progress > 1 
    ? Math.min(100, Math.max(0, ((progress - 1) / (totalSteps - 1)) * 100))
    : 0;
  
  useEffect(() => {
    // 먼저 이전 상태의 퍼센트로 설정
    setDisplayPercentage(previousPercentage);
    
    // 짧은 지연 후 현재 상태의 퍼센트로 애니메이션
    const timer = setTimeout(() => {
      setDisplayPercentage(targetPercentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress, previousPercentage, targetPercentage]);
  
  
  // 키프레임 스타일을 생성하는 함수
  const getKeyframeStyle = (): string => {
    return `
      @keyframes shimmer {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
        }
      }
    `;
  };
  
  return (
    <div className={`w-full py-4 px-6 mt-4 ${className}`}>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden relative">
        {/* 기본 프로그레스 바 - 부드러운 애니메이션 */}
        <div 
          className="h-full absolute transition-all duration-1000 ease-out"
          style={{ 
            width: `${displayPercentage}%`,
            backgroundColor: COLORS.blue,
          }}
        ></div>
        
        {/* 물결 효과 오버레이 (선택 사항) */}
        {displayPercentage > 0 && (
          <div 
            className="absolute h-full opacity-30"
            style={{ 
              width: `${displayPercentage}%`,
              backgroundColor: COLORS.blue,
              backgroundImage: `
                linear-gradient(
                  90deg, 
                  transparent, 
                  rgba(255, 255, 255, 0.5), 
                  transparent
                )
              `,
              backgroundSize: '200px 100%',
              animation: 'shimmer 2s infinite linear',
            }}
          ></div>
        )}
        
        {/* 애니메이션 키프레임을 위한 스타일 */}
        <style dangerouslySetInnerHTML={{ __html: getKeyframeStyle() }} />
      </div>
    </div>
  );
}