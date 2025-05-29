import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import CryptocurrencyTags from "@/components/common/CryptocurrencyTags";
import BottomNav from "@/components/common/BottomNavigate";
import { getStoreList } from "@/api/shop";
import { Store } from "@/types/store";

const ShoppingMall: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("전체");
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [storeData, setStoreData] = useState<Store[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoaded(true);
    document.body.style.overflow = 'hidden';
    document.body.classList.remove('page-transition');
    
    // API에서 가게 목록 데이터 가져오기
    const fetchStores = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await getStoreList();
        setStoreData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("가게 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    // 검색 기능 구현
  };

  // 탭 필터링 로직
  const filteredStores = storeData.filter((store) => {
    // 검색어로 필터링
    const matchesSearch = searchTerm === "" || 
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 카테고리로 필터링
    const matchesCategory = activeTab === "전체" || store.storeType === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  // 실제 표시할 가게 목록 (에러 상태일 경우 빈 배열)
  const displayStores = error ? [] : filteredStores;

  // 전역 스타일 정의
  const globalStyles = `
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
  `;

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="쇼핑몰" isStore={false} />

      <main className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm">
          <div className="px-5 pt-5 pb-3">
            <form onSubmit={handleSearch} className="relative mb-5">
              <input
                type="text"
                placeholder="상품 검색어를 입력해 주세요."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 bg-gray-100 rounded-full pl-5 pr-12 focus:outline-none focus:ring-2 text-[#4B5EED] focus:ring-[#4B5EED] focus:ring-opacity-10 transition-all"
              />
              <button type="submit" className="absolute right-4 top-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#4B5EED]"
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
              {["전체", "음식점", "카페"].map((tab) => (
                <button
                  key={`tab-${tab}`}
                  className={`px-5 py-3 text-sm font-medium relative transition-all ${
                    activeTab === tab
                      ? "text-[#4B5EED] font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4B5EED] rounded-t-full"></span>
                  )}
                </button>
              ))}
              <button className="ml-auto px-4 py-3 text-sm font-medium text-[#4B5EED] flex items-center">
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
   
        {/* 로딩 상태 표시 */}
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4B5EED]"></div>
          </div>
        ) : error ? (
          // 에러 메시지 표시
          <div className="px-5 py-10 text-center text-gray-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#4B5EED] text-white rounded-lg hover:bg-opacity-90"
            >
              새로고침
            </button>
          </div>
        ) : (
          // 스크롤 가능한 리스트
          <div className="bg-gray-50 py-3">
            <div className="px-5 space-y-4">
              {displayStores.length > 0 ? (
                displayStores.map((store) => (
                  <div
                    key={`store-${store.storeId}`}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md"
                    onClick={() => {
                      // 페이지 전환 시 부드러운 처리를 위한 클래스 추가
                      document.body.classList.add('page-transition');
                      navigate(`/mall/store/${store.storeId}`);
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-gray-900">{store.storeName}</h3>
                      <div className="flex items-center">
                        <img
                          src={store.storeImage}
                          alt={store.storeName}
                          width={80}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </div>

                    <CryptocurrencyTags coins={store.coinList || []} />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-gray-500">
                        {store.storeType && (
                          <span className="bg-gray-100 px-2 py-1 rounded-full">
                            {store.storeType}
                          </span>
                        )}
                      </div>
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
                        <span className="text-sm font-medium">{store.likeCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-600">
                  <p>표시할 가게가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />

      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
    </div>
  );
};

export default ShoppingMall;