import Header from "@/components/common/Header";
import Modal from "@/components/common/Modal";
import BusinessCertificateForm from "@/components/edit-info/BusinessCertificationForm";
import PasswordChangeForm from "@/components/edit-info/PasswordChangeForm";
import PhoneChangeForm from "@/components/edit-info/PhoneChangeForm";
import ProfileImageChangeForm from "@/components/edit-info/ProfileImageChangeFromProps";
import React, { useState, ChangeEvent } from "react";
const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export default function StoreEditInfo(): React.ReactElement {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [businessCertificate, setBusinessCertificate] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");

  const token = localStorage.getItem("accessToken");

  const handlePhoneChangeSuccess = (): void => {
    setModalTitle("휴대폰 변경 완료");
    setIsModalOpen(true);
  };

  const handlePasswordChangeSuccess = (): void => {
    setModalTitle("비밀번호 변경 완료");
    setIsModalOpen(true);
  };

  const handleProfileImageChange = (): void => {
    if (profileImage) {
      setModalTitle("프로필 이미지 변경 완료");
      setIsModalOpen(true);
    }
  };

  const handleBusinessCertificateChange = (): void => {
    if (businessCertificate) {
      setModalTitle("사업자 등록증 변경 완료");
      setIsModalOpen(true);
    }
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

  return (
    <div className="flex flex-col h-screen">
        <Header title="내 정보 수정" />
        <main className="flex-1 p-4 bg-gray-50 overflow-auto min-h-screen">
          <PasswordChangeForm
            onSuccess={handlePasswordChangeSuccess}
            onSubmit={handlePasswordChange}
            />
          <PhoneChangeForm
            onSuccess={handlePhoneChangeSuccess}
            onSubmit={handlePhoneChange}
          />
          <ProfileImageChangeForm onSuccess={handleProfileImageChange} />
          <BusinessCertificateForm onSuccess={handleBusinessCertificateChange} />
          <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              title={modalTitle}
              />
    </main>
    </div>
      
  );
}