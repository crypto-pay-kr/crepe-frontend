import { useState, useEffect } from "react"
import { Camera } from "lucide-react"

interface ImageUploaderProps {
  label?: string
  previewLabel?: string
  onChange: (file: File) => void
  value?: File | null
}

export default function ImageUploader({
  label = "대표 이미지",
  previewLabel = "첨부된 이미지",
  onChange,
  value
}: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 외부에서 전달된 파일이 변경되었을 때 미리보기 업데이트
  useEffect(() => {
    if (!value) {
      setImagePreview(null)
      return
    }

    // 이미 미리보기가 생성된 파일이라면 다시 처리하지 않음
    if (value === value && imagePreview) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
    }
    reader.readAsDataURL(value)
  }, [value])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // 부모 컴포넌트에 파일 전달
      onChange(file)
      
      // 로컬 미리보기 생성
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      {/* Upload Button */}
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

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-1">
          <p className="text-sm text-gray-500">{previewLabel}</p>
          <div className="border border-gray-300 rounded-lg overflow-hidden w-24 h-24 ">
            <img 
              src={imagePreview} 
              alt="업로드된 이미지" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  )
}