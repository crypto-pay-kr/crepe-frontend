import React, { useState } from "react";
import Header from "@/components/common/Header";
import PasswordChangeForm from "@/components/edit-info/PasswordChangeForm";
import NicknameChangeForm from "@/components/edit-info/NicknameChangeForm";
import PhoneChangeForm from "@/components/edit-info/PhoneChangeForm";
import Modal from "@/components/common/Modal";
import { changeNickname, changePassword, changePhone } from '@/api/user'
const BASE_URL = import.meta.env.VITE_API_SERVER_URL;



export default function EditInfo(): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");

  const token = localStorage.getItem("accessToken");


  const handlePasswordChangeSuccess = (): void => {
    setModalTitle("비밀번호 변경 완료");
    setIsModalOpen(true);
  };

  const handleNicknameChangeSuccess = (): void => {
    setModalTitle("닉네임 변경 완료");
    setIsModalOpen(true);
  };


  const handlePhoneChangeSuccess = (): void => {
    setModalTitle("휴대폰 변경 완료");
    setIsModalOpen(true);
  };

  const handlePasswordChange = async (data: { oldPassword: string; newPassword: string }) => {
    if (!token) throw new Error("로그인이 필요합니다.");
    await changePassword(token, data);
  };

  const handleNicknameChange = async (data: { newNickname: string }) => {
    if (!token) throw new Error("로그인이 필요합니다.");
    await changeNickname(token, data);
  };

  const handlePhoneChange = async (data: { phoneNumber: string }) => {
    if (!token) throw new Error("로그인이 필요합니다.");
    await changePhone(token, data);
  };


  return (
    <div className="flex flex-col h-screen">

      <Header title="내 정보 수정" />

      <main className="flex-1 p-4 bg-gray-50 overflow-auto">
        <PasswordChangeForm
          onSuccess={handlePasswordChangeSuccess}
          onSubmit={handlePasswordChange}
        />
        <NicknameChangeForm
          onSuccess={handleNicknameChangeSuccess}
          onSubmit={handleNicknameChange}
        />
        <PhoneChangeForm
          onSuccess={handlePhoneChangeSuccess}
          onSubmit={handlePhoneChange}
        />
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
}