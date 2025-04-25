import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { stores } from "../../mocks/stores";
import BottomNav from "../common/BottomNavigate";
import { Home, ShoppingBag, User } from "lucide-react";
import CryptocurrencyTags from "./CryptocurrencyTags";

export default function ShoppingMall() {


  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체");
  const navigate = useNavigate();


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 기능 구현
  };

  return (
    <>
      <Header title="쇼핑몰" isStore={false} />

      <div className="page-container bg-white">
        <div className="p-4">
          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="상품 검색어를 입력해 주세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-gray-100 rounded-full pl-4 pr-12 focus:outline-none"
            />
            <button type="submit" className="absolute right-4 top-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          {/* 탭 영역 */}
          <div className="flex border-b border-gray-200 mb-4">
            {["전체", "음식", "카페", "옷"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium ${activeTab === tab
                  ? "text-[#002169] border-b-2 border-[#002169]"
                  : "text-gray-500"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
            <button className="px-4 py-2 text-sm font-medium text-gray-500 ml-auto">
              최신순 ▼
            </button>
          </div>
 
          {/* 스크롤 가능한 리스트 */}
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-270px)]">
            {stores.map((store) => (
              <div
                key={store.id}
                className="border-b pb-4"
                onClick={() => navigate(`/shoppingmall/store/${store.id}`)} // Updated path
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{store.name}</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <img
                        src={store.image}
                        alt={store.name}
                        width={80}
                        height={60}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <CryptocurrencyTags tags={store.tags} />
               
                <div className="flex justify-between items-center">
                  <div></div>
                  <div className="flex items-center text-gray-500">
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
                    <span className="text-sm">{store.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />

    </>
  );
}