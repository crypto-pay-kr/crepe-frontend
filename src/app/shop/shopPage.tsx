import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { stores } from "../../mocks/stores";
import Header from "@/components/common/Header";
import CryptocurrencyTags from "@/components/shoppingmall/CryptocurrencyTags";
import BottomNav from "@/components/common/BottomNavigate";

export default function ShoppingMall() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체");
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // 컴포넌트 마운트 시 스크롤 위치 조정 및 로딩 상태 처리
  useEffect(() => {
    // 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    // 페이지 로딩 상태 설정
    setIsLoaded(true);
    
    // 스크롤 방지
    document.body.style.overflow = 'hidden';
    
    return () => {
      // 컴포넌트 언마운트 시 원래 상태로 복원
      document.body.style.overflow = '';
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 기능 구현
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="쇼핑몰" isStore={false} />

      <main className="flex-1 overflow-auto">
        {/* 상단 고정 영역 */}
        <div className="bg-white shadow-sm">
          <div className="px-5 pt-5 pb-3">
            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="relative mb-5">
              <input
                type="text"
                placeholder="상품 검색어를 입력해 주세요."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 bg-gray-100 rounded-full pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#002169] focus:ring-opacity-30 transition-all"
              />
              <button type="submit" className="absolute right-4 top-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>

            {/* 탭 영역 */}
            <div className="flex border-b border-gray-200">
              {["전체", "음식", "카페", "옷"].map((tab) => (
                <button
                  key={tab}
                  className={`px-5 py-3 text-sm font-medium relative transition-all ${
                    activeTab === tab
                      ? "text-[#002169] font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#002169] rounded-t-full"></span>
                  )}
                </button>
              ))}
              <button className="ml-auto px-4 py-3 text-sm font-medium text-gray-600 flex items-center">
                최신순
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path 
                    d="M6 9L12 15L18 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
   
        {/* 스크롤 가능한 리스트 */}
        <div className="bg-gray-50 py-3">
          <div className="px-5 space-y-4">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md"
                onClick={() => {
                  // 페이지 전환 시 부드러운 처리를 위한 클래스 추가
                  document.body.classList.add('page-transition');
                  navigate(`/mall/store/${store.id}`);
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900">{store.name}</h3>
                  <div className="flex items-center">
                    <img
                      src={store.image}
                      alt={store.name}
                      width={80}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>

                <CryptocurrencyTags tags={store.tags} />
               
                <div className="flex justify-between items-center mt-2">
                  <div></div>
                  <div className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm font-medium">{store.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />

      {/* 아래에 전역 스타일을 추가하여 페이지 전환 애니메이션을 처리합니다 */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        #root {
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .page-transition {
          opacity: 0.8;
          transition: opacity 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}