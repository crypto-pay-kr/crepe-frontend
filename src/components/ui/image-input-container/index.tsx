import ImageInput from '@/components/ui/image-input-container/image-input'

interface ImageInputContainerProps {
  desc: string
  tip?: string
  updateImageFiles: (state: File[]) => void
  maxLength: number
  onButtonInputChange: (res: boolean | undefined) => void
}

export default function ImageInputContainer({
  desc,
  tip,
  updateImageFiles,
  maxLength,
  onButtonInputChange,
}: ImageInputContainerProps) {
  return (
    <div className="flex w-full flex-col gap-[23px]">
      <div className="flex flex-col gap-[6px]">
        <p className="text-[12px] leading-[17px] text-gray06">{desc}</p>
        {tip && <p className="leadig-[17px] text-[12px] text-pink03">{tip}</p>}
      </div>
      <ImageInput
        maxLength={maxLength}
        updateImageFiles={updateImageFiles}
        onButtonInputChange={onButtonInputChange}
      />
    </div>
  )
}
