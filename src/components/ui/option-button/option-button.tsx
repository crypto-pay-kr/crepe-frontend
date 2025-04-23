import ChevronBottomIcon from '@/assets/common/svg/chevron-bottom'
import CrossIcon from '@/assets/common/svg/cross-icon'
import useModal from '@/hooks/useModal'
import { colors } from '@/type/colors'
import { FILTER_SORT } from '@/type/post/filter-sort'
import { cn } from '@/utils/cn'
import { useEffect, useState } from 'react'

export default function OptionButton({
  optionName,
  optionId,
  updateValue,
  valueIndex,
  updateValueArray,
  valueArray,
  defaultValue,
}: {
  optionName: string
  optionId: keyof typeof FILTER_SORT
  updateValue?: React.Dispatch<React.SetStateAction<any>>
  valueIndex?: number
  updateValueArray?: React.Dispatch<React.SetStateAction<string[]>>
  valueArray?: string[]
  defaultValue?: string[]
}) {
  const { open, close } = useModal()
  const [value, setValue] = useState<string>(optionName)

  useEffect(() => {
    if (
      defaultValue &&
      valueIndex !== undefined &&
      valueIndex < defaultValue.length
    ) {
      setValue(defaultValue[valueIndex!])
    }
  }, [defaultValue])

  useEffect(() => {
    if (valueArray?.includes(value!) && !defaultValue) {
      open({
        title: '오류',
        content: '이미 선택하셨습니다.',
      })
      setValue(optionName)
      if (updateValueArray)
        updateValueArray(prev => [...prev.splice(valueIndex!, 1)])
    } else {
      if (updateValueArray && value)
        updateValueArray(prev => {
          const newArray = [...prev]
          newArray[valueIndex!] = value
          return newArray
        })
    }
    if (updateValue) updateValue(value ?? '')
  }, [value])

  const handleModalButtonClick = () => {
    const list = valueArray
      ? [
          value,
          ...Object.values(FILTER_SORT[optionId])
            .filter(item => !valueArray.includes(item.name))
            .map(item => item.name),
        ]
      : Object.values(FILTER_SORT[optionId]).map(item => item.name)
    open({
      title: optionName,
      content: (
        <div className="max-h-[240px] w-full overflow-auto">
          <div className="flex w-full flex-col items-start gap-[20px]">
            {list.map((name, index) =>
              name === optionName ? (
                <></>
              ) : (
                <button
                  className={cn(
                    'flex w-full items-center gap-[5px] text-left',
                    index === 0 && 'text-pink03'
                  )}
                  key={name}
                  onClick={() => {
                    close()
                    setValue(index === 0 ? optionName : name)
                  }}
                >
                  {name}
                  {index === 0 && <CrossIcon color={colors.pink03} />}
                </button>
              )
            )}
          </div>
        </div>
      ),
    })
  }
  return (
    <button
      onClick={handleModalButtonClick}
      className="flex h-[25px] w-[100px] items-center justify-center rounded-[20px] border-[1px] border-gray09 text-[12px]"
    >
      <span className={cn('w-[67px]', value === optionName && 'text-gray05')}>
        {value}
      </span>
      <ChevronBottomIcon color={colors.gray03} />
    </button>
  )
}
