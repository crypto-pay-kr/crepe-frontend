import { Phone, MessageCircle, Clock, Mail } from "lucide-react";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useState } from "react";

interface ContactItem {
  title: string;
  content: string;
  time?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function CustomerSupportPage(): React.ReactElement {
  const [isSeller, setIsSeller] = useState(false);

  // 고객센터 연락처 정보
  const contactItems: ContactItem[] = [
    {
      title: "전화문의",
      content: "1661-5443",
      time: "09:00 ~ 18:00 (토,일,공휴일 휴무)",
      icon: <Phone size={24} />,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "상담톡 문의",
      content: "카카오톡 채팅문의 바로가기",
      time: "09:00 ~ 18:00 (토,일,공휴일 휴무)",
      icon: <MessageCircle size={24} />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  

  const handlePhoneCall = (): void => {
    window.location.href = "tel:1661-5443";
  };

  const handleKakaoTalk = (): void => {
    // 카카오톡 상담톡 연결 로직
    window.open("https://pf.kakao.com/_example", "_blank");
  };

  const handleFaqClick = (question: string): void => {
    // FAQ 상세 페이지로 이동하는 로직
    console.log("FAQ 클릭:", question);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="고객센터" />

      {/* 스크롤 가능한 메인 컨테이너 */}
      <main className="flex-1 p-4 overflow-auto">
        {/* 연락처 정보 섹션 */}
        <div className="space-y-4 mb-6">
          {contactItems.map((item, index) => (
            <div
              key={index}
              onClick={index === 0 ? handlePhoneCall : handleKakaoTalk}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${item.bgColor}`}>
                  <div className={item.color}>
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className={`font-medium mb-2 ${
                    index === 0 ? "text-red-600 text-lg" : "text-gray-800"
                  }`}>
                    {item.content}
                  </p>
                  {item.time && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {item.time}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        
        {/* 이메일 문의 섹션 */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue rounded-full">
                <Mail size={20} className="text-blue-600 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">이메일 문의</h3>
                <p className="text-sm text-gray-600">24시간 접수 가능</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              전화 상담이 어려우시거나 자세한 문의사항이 있으시면 이메일로 연락주세요.
            </p>
            <button
              onClick={() => window.location.href = "mailto:support@example.com"}
              className="w-full bg-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              이메일 보내기
            </button>
          </div>
        </div>

        {/* 운영시간 안내 */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Clock size={20} className="text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-2">운영시간 안내</h4>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• 평일: 09:00 ~ 18:00</p>
                  <p>• 토요일, 일요일, 공휴일: 휴무</p>
                  <p>• 점심시간: 12:00 ~ 13:00</p>
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  * 운영시간 외 문의는 이메일을 이용해 주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}