import React, { useState } from "react";
import Header from "@/components/common/Header";
import PasswordChangeForm from "@/components/edit-info/PasswordChangeForm";
import NicknameChangeForm from "@/components/edit-info/NicknameChangeForm";
import PhoneChangeForm from "@/components/edit-info/PhoneChangeForm";
import Modal from "@/components/common/Modal";
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

  // Password change API integration
  const handlePasswordChange = async (data: { oldPassword: string; newPassword: string }): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/auth/change/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "비밀번호 변경에 실패했습니다.");
    }
  };


  const handlePhoneChange = async (data: { phoneNumber: string }): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/auth/change/phone`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        phoneNumber: data.phoneNumber,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "전화번호 변경에 실패했습니다.");
    }

  };

  const handleNicknameChange = async (data: { newNickname: string }): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/auth/change/nickname`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({

        newNickname: data.newNickname
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "닉네임 변경에 실패했습니다.");
    }



  };




  return (
    <div className="flex flex-col h-screen">

      <Header title="내 정보 수정"/>

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
