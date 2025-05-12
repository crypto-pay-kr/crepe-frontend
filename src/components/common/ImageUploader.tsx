import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

interface ImageUploaderProps {
  label?: string;
  previewLabel?: string;
  onChange: (file: File) => void;
  // File 또는 문자열(이미지 URL)도 받을 수 있도록 수정
  value?: File | string | null;
}

export default function ImageUploader({
  label = "대표 이미지",
  previewLabel = "첨부된 이미지",
  onChange,
  value
}: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // value가 변경될 때마다 미리보기 설정
  useEffect(() => {
    if (!value) {
      setImagePreview(null);
      return;
    }

    if (typeof value === "string") {
      // 문자열(이미지 URL)이 넘어온 경우
      setImagePreview(value);
    } else {
      // File 객체가 넘어온 경우
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(value);
    }
  }, [value]);

  // 파일 업로드 시 부모로 전달, 로컬 미리보기 생성
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">{label}</p>
      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-center">
          <div className="flex items-center text-gray-500">
            <Camera className="mr-2" size={20} />
            <span>컴퓨터에서 업로드</span>
          </div>
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>

      {imagePreview && (
        <div className="mt-1">
          <p className="text-sm text-gray-500">{previewLabel}</p>
          <div className="border border-gray-300 rounded-lg overflow-hidden w-24 h-24">
            <img
              src={imagePreview}
              alt="업로드된 이미지 미리보기"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}