import CameraIcon from '@/assets/common/svg/camera-icon'
import CrossIcon from '@/assets/common/svg/cross-icon'
import { useEffect, useState } from 'react'

export default function ImageInput({
  maxLength,
  updateImageFiles,
  onButtonInputChange,
}: {
  maxLength: number
  updateImageFiles: (state: File[]) => void
  onButtonInputChange: (res: boolean | undefined) => void
}) {
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [images])

  useEffect(() => {
    updateImageFiles(imageFiles)
    if (imageFiles.length > 0 && imageFiles.length <= maxLength) {
      onButtonInputChange(true)
    }
    if (imageFiles.length === 0) {
      onButtonInputChange(undefined)
    }
  }, [imageFiles])

  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > maxLength || images.length + files.length > maxLength) {
      setError(true)
      return
    }
    files.forEach(f => {
      setImages(prev => {
        return [...prev, URL.createObjectURL(f)]
      })
      setImageFiles(prev => [...prev, f])
    })
  }

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <label className="flex w-full items-center justify-center gap-[9px] rounded-[10px] border-[1px] border-pink03 py-[13px]">
        <input
          className="hidden"
          multiple
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageUploaded}
        />
        <CameraIcon />
        <p className="text-[12px] text-pink03">
          이미지 업로드 ({images.length}/{maxLength})
        </p>
      </label>

      <div className="flex gap-[10px]">
        {images.length > 0 &&
          images.map((item, index) => (
            <div
              key={item}
              className="flex h-[80px] w-[80px] justify-end rounded-[10px] bg-cover bg-center"
              style={{ backgroundImage: `url('${item}')` }}
            >
              <button
                type="button"
                className="mr-[5px] mt-[5px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#0000009E]"
                onClick={() => {
                  setImages(images.filter((_, idx) => idx !== index))
                  setImageFiles(imageFiles.filter((_, idx) => idx !== index))
                }}
              >
                <CrossIcon />
              </button>
            </div>
          ))}
      </div>
      {error && (
        <p className="text-[12px] text-pink03">
          최대 {maxLength}장까지 업로드 가능합니다.
        </p>
      )}
    </div>
  )
}
