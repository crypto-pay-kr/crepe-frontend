import OptionButton from '@/components/ui/option-button/option-button'
import { FILTER_SORT } from '@/type/post/filter-sort'

export default function OptionGroupInput({
  id,
  name,
  value,
  updateValue,
  defaultValue,
}: {
  id: keyof typeof FILTER_SORT
  name: string
  value: string[]
  updateValue: React.Dispatch<React.SetStateAction<string[]>>
  defaultValue?: string[]
}) {
  return (
    <div>
      <div className="flex gap-[10px]">
        <OptionButton
          optionName={name}
          optionId={id}
          updateValueArray={updateValue}
          valueIndex={0}
          valueArray={value}
          defaultValue={defaultValue}
        />
        <OptionButton
          optionName={name}
          optionId={id}
          updateValueArray={updateValue}
          valueIndex={1}
          valueArray={value}
          defaultValue={defaultValue}
        />
        <OptionButton
          optionName={name}
          optionId={id}
          updateValueArray={updateValue}
          valueIndex={2}
          valueArray={value}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  )
}
