import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import PasswordChangeForm from "@/components/edit-info/PasswordChangeForm";
import NicknameChangeForm from "@/components/edit-info/NicknameChangeForm";
import EmailChangeForm from "@/components/edit-info/EmailChangeForm";
import PhoneChangeForm from "@/components/edit-info/PhoneChangeForm";
import Modal from "@/components/common/Modal";



export default function EditInfo(): React.ReactElement {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");

  const handlePasswordChangeSuccess = (): void => {
    setModalTitle("비밀번호 변경 완료");
    setIsModalOpen(true);
  };

  const handleNicknameChangeSuccess = (): void => {
    setModalTitle("닉네임 변경 완료");
    setIsModalOpen(true);
  };

  const handleEmailChangeSuccess = (): void => {
    setModalTitle("이메일 변경 완료");
    setIsModalOpen(true);
  };

  const handlePhoneChangeSuccess = (): void => {
    setModalTitle("휴대폰 변경 완료");
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <Header title="내 정보 수정"/>
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-4 bg-gray-50 overflow-auto">
        <PasswordChangeForm onSuccess={handlePasswordChangeSuccess} />
        <NicknameChangeForm onSuccess={handleNicknameChangeSuccess} />
        <EmailChangeForm onSuccess={handleEmailChangeSuccess} />
        <PhoneChangeForm onSuccess={handlePhoneChangeSuccess} />
      </main>

      {/* 완료 모달 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
}