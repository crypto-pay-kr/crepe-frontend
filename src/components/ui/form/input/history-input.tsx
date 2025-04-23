import { useEffect } from 'react'

export default function HistoryInput({
  value,
  updateValue,
  defaultValue,
}: {
  value: string[]
  updateValue: (data: string, index: number) => void
  defaultValue?: string[]
}) {
  useEffect(() => {
    if (defaultValue) {
      defaultValue.forEach((item, index) => {
        updateValue(item, index)
      })
    }
  }, [defaultValue])
  return (
    <div className="flex w-full flex-col gap-[6px]">
      <p className="text-[12px] text-gray06">약력을 작성해주새요.</p>
      {Array.from({ length: 5 }).map((_, index) => (
        <input
          key={`hitsory-input-${index}`}
          type="text"
          className="h-[40px] w-full rounded-[10px] border-[1px] border-gray09 px-[16px] py-[13px] text-[12px] placeholder:text-[12px]"
          placeholder="내용 작성"
          value={value[index]}
          onChange={e => {
            updateValue(e.target.value, index)
          }}
        />
      ))}
    </div>
  )
}
