import React from 'react';
import { CoinStatus } from '@/types/store';

interface CryptocurrencyTagsProps {
  coins: CoinStatus[];
}

const CryptocurrencyTags: React.FC<CryptocurrencyTagsProps> = ({ coins }) => {
  // coinStatus 데이터 구조 디버깅
  console.log('CoinStatus 데이터:', coins);
  
  // 암호화폐 아이콘 매핑
  const cryptoIcons: Record<string, string> = {
    'XRP': 'XRP',
    'USDT': 'USDT',
    'SOL': 'SOL',
  };

  // 암호화폐 배경색 매핑 
  const cryptoColors: Record<string, string> = {
    'XRP': 'bg-blue-100 text-blue-800',
    'USDT': 'bg-green-100 text-green-800',
    'SOL': 'bg-purple-100 text-purple-800',
    // 기본 스타일
    'default': 'bg-gray-100 text-gray-800',
  };

  if (!coins || coins.length === 0) {
    return <div className="text-xs text-gray-400">지원하는 암호화폐가 없습니다</div>;
  }

  // CoinStatus 객체에서 코인 코드 추출
  const getCoinCode = (coin: CoinStatus): string => {
    console.log('코인 데이터:', coin);
    
    // CoinStatus가 단순히 문자열이라면
    if (typeof coin === 'string') {
      return coin;
    }
    
    // 직접 코인 이름을 확인
    // Java enum을 직렬화할 때 종종 이름만 문자열로 보내는 경우가 있음
    if (coin.name === 'XRP' || coin.name === 'USDT' || coin.name === 'SOL') {
      return coin.name;
    }
    
    // code, type 필드 확인
    if (coin.code) {
      return coin.code;
    }
    if (coin.type) {
      return coin.type;
    }
    
    // 이름이 있지만 위에서 확인한 코인이 아닌 경우
    if (coin.name) {
      return coin.name;
    }
    
    // CoinStatus가 열거형(enum)이면 toString()이 이름을 반환할 수 있음
    // JSON으로 변환하면 열거형의 경우 이름만 남을 수 있음
    const coinString = String(coin);
    if (coinString === 'XRP' || coinString === 'USDT' || coinString === 'SOL') {
      return coinString;
    }
    
    // 기본값으로 객체를 문자열화
    return 'default';
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {coins.map((coin, index) => {
        const coinCode = getCoinCode(coin);
        console.log('추출된 코인 코드:', coinCode);
        
        // 추출된 코인 코드에 따라 스타일 적용
        return (
          <div 
            key={`coin-${index}-${coinCode}`}
            className={`text-xs px-2 py-1 rounded-full ${cryptoColors[coinCode] || cryptoColors.default}`}
          >
            <span className="font-semibold mr-1">{cryptoIcons[coinCode] || ''}</span>
            {coinCode}
          </div>
        );
      })}
    </div>
  );
};

export default CryptocurrencyTags;