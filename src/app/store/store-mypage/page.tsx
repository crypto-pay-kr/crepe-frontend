import Header from "@/components/common/Header";
import Modal from "@/components/common/Modal";
import BusinessCertificateForm from "@/components/edit-info/BusinessCertificationForm";
import PasswordChangeForm from "@/components/edit-info/PasswordChangeForm";
import PhoneChangeForm from "@/components/edit-info/PhoneChangeForm";
import ProfileImageChangeForm from "@/components/edit-info/ProfileImageChangeFromProps";
import React, { useState, ChangeEvent, useEffect } from 'react'
import { changeNickname, changePassword, changePhone } from '@/api/user'

export default function StoreEditInfo(): React.ReactElement {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [businessCertificate, setBusinessCertificate] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");

  const token = sessionStorage.getItem("accessToken");

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

  const handlePasswordChange = async (data: { oldPassword: string; newPassword: string }) => {

    await changePassword(data);
  };

  const handleNicknameChange = async (data: { newNickname: string }) => {

    await changeNickname(data);
  };

  const handlePhoneChange = async (data: { phoneNumber: string }) => {

    await changePhone(data);
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