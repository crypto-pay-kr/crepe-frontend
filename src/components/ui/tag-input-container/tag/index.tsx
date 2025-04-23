import { useEffect } from 'react'

export interface TagButtonProps {
  value: string
  label: string
}

export default function TagButton<T>({
  name,
  value,
  label,
  checkedValue,
  updateCheckedValue,
  onButtonInputChange,
}: TagButtonProps & {
  name: string
  checkedValue?: T
  updateCheckedValue: React.Dispatch<React.SetStateAction<T | undefined>>
  onButtonInputChange: (res: boolean) => void
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    updateCheckedValue(value as T)
  }

  useEffect(() => {
    onButtonInputChange(!!checkedValue)
  }, [checkedValue])

  return (
    <label className="flex w-full">
      <input
        type="radio"
        name={name}
        value={value}
        className="peer hidden"
        onChange={handleInputChange}
      />
      <div className="flex h-fit w-full items-center justify-center rounded-[20px] border-[1px] border-gray09 py-[4px] text-[12px] font-bold leading-[17px] text-gray06 peer-checked:border-pink03 peer-checked:bg-pink03 peer-checked:text-white">
        {label}
      </div>
    </label>
  )
}
