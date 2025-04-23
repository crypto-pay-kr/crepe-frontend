export default function CounselorIntroInput({
  value,
  updateValue,
}: {
  value: string
  updateValue: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <textarea
      className="h-[200px] w-full resize-none rounded-[10px] border-[1px] border-gray09 px-[16px] py-[13px] text-[13px]"
      maxLength={300}
      onChange={e => {
        updateValue(e.target.value)
      }}
      value={value}
    ></textarea>
  )
}
