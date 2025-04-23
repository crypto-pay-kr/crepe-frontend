import TagButton, {
  TagButtonProps,
} from '@/components/ui/tag-input-container/tag'
import { useEffect, useState } from 'react'

interface TagInputContainerProps {
  name: string
  buttonList: TagButtonProps[]
}

export default function TagInputContainer<T>({
  name,
  buttonList,
  checkedValue,
  updateCheckedValue,
  onButtonInputChange,
}: TagInputContainerProps & {
  checkedValue?: T
  updateCheckedValue: (state: T | undefined) => void
  onButtonInputChange: (res: boolean) => void
}) {
  const [checkedResult, setCheckedResult] = useState<T | undefined>()

  useEffect(() => {
    updateCheckedValue(checkedResult)
  }, [checkedResult])

  return (
    <div className="flex w-full flex-row justify-between gap-[24px]">
      {buttonList.map(buttonProps => (
        <TagButton<T>
          value={buttonProps.value}
          label={buttonProps.label}
          name={name}
          checkedValue={checkedValue}
          updateCheckedValue={setCheckedResult}
          onButtonInputChange={onButtonInputChange}
        />
      ))}
    </div>
  )
}
