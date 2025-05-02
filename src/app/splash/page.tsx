import React, { useEffect, useState } from 'react';

export default function SplashPage() {
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // 로고 애니메이션
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

    // 텍스트 애니메이션 (로고 이후에 나타남)
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 1000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col relative bg-white">
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div 
            className={`transform transition-all duration-1000 ease-out ${
              logoVisible 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-90'
            }`}
          >
            <img 
              src="/crepe-newlogo2.png" 
              alt="Crepe 메인 로고" 
              className="w-65 h-60"
            />
          </div>
        </div>
        <div 
          className={`absolute bottom-10 left-0 right-0 flex justify-center text-lg text-slate-700 transition-all duration-1000 ease-in-out ${
            textVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <span>편리한 블록체인 토큰결제,</span>
          <span className="text-[#1C355E] font-semibold ml-1">Crepe</span>
        </div>
      </div>
    </div>
  );
}