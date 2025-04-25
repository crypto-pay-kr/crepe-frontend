import React, { useState } from "react";

interface ProfileImageChangeFormProps {
  onSuccess: () => void;
}

export default function ProfileImageChangeForm({ onSuccess }: ProfileImageChangeFormProps): React.ReactElement {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const handleProfileImageAttach = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // 이미지 파일 검증 (선택적)
      if (!file.type.startsWith('image/')) {
        setImageError("이미지 파일만 업로드 가능합니다.");
        return;
      }
      
      // 파일 크기 검증 (선택적, 예: 5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("파일 크기는 5MB 이하여야 합니다.");
        return;
      }
      
      setProfileImage(file);
      setImageError("");
    }
  };

  const handleProfileImageChange = (): void => {
    if (!profileImage) {
      setImageError("변경할 사진을 선택해주세요.");
      return;
    }

    // 여기서 실제 API 호출 등을 통해 프로필 이미지 업로드
    // 성공 시 onSuccess 콜백 호출
    onSuccess();
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <h2 className="text-lg font-medium mb-2">대표사진 변경</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">대표사진을 선택해주세요.</label>
        <label htmlFor="profile-image" className="block w-full">
          <div className={`w-full border rounded p-2 text-center cursor-pointer ${imageError ? "border-red-500" : "border-gray-300"}`}>
            첨부하기
          </div>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleProfileImageAttach}
            className="hidden"
          />
        </label>
        {profileImage && (
          <p className="text-xs text-gray-600 mt-2">선택된 파일: {profileImage.name}</p>
        )}
        {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
      </div>

      <button 
        onClick={handleProfileImageChange} 
        className={`w-full py-3 rounded ${
          profileImage 
            ? "bg-[#0a2e65] text-white" 
            : "bg-gray-300 text-gray-500"
        }`}
        disabled={!profileImage}
      >
        변경하기
      </button>
    </div>
  );
}