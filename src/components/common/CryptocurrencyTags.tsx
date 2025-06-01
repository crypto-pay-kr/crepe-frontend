import React from 'react';
import { CoinList } from '@/types/store';

type CoinLike = string | CoinList;

interface CryptocurrencyTagsProps {
  coins:  CoinLike[];
}

const CryptocurrencyTags: React.FC<CryptocurrencyTagsProps> = ({ coins }) => {

  // 암호화폐 아이콘 매핑
  const cryptoIcons: Record<string, string> = {
    'XRP': 'XRP',
    'USDT': 'USDT',
    'SOL': 'SOL',
  };

  // 암호화폐 배경색 매핑
  const cryptoStyles: Record<string, { bg: string; text: string; border: string }> = {
    XRP: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-100",
    },
    USDT: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-100",
    },
    SOL: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-100",
    },
    default: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },
  };

  if (!coins || coins.length === 0) {
    return <div className="text-xs text-gray-400">지원하는 암호화폐가 없습니다</div>;
  }

  // CoinStatus 객체에서 코인 코드 추출
  const getCoinCode = (coin: CoinLike): string => {

    // CoinStatus가 단순히 문자열이라면
    if (typeof coin === 'string') {
      return coin;
    }

    if (coin.currency) return coin.currency;

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

  const uniqueCoinCodes = Array.from(
    new Set(coins.map((coin) => getCoinCode(coin)))
  );

  return (
    <div className="flex flex-wrap gap-1.5">
      {uniqueCoinCodes.map((coinCode, index) => {
        const style = cryptoStyles[coinCode] || cryptoStyles.default;

        return (
          <div
            key={`coin-${index}-${coinCode}`}
            className={`flex items-center justify-center text-xs px-2 h-6 rounded-full border ${style.bg} ${style.border}`}
          >
            <span className={`${style.text}`}>{coinCode}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CryptocurrencyTags;