import Button from '@/components/ui/button'
import { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputName: string
  input: {
    type: 'text' | 'password'
    placeholder: string
    button?: {
      value: string
      onClick: () => void
    }
  }
  inputState: {
    value?: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ref?: React.RefObject<HTMLInputElement>
}

export default function TextInput({
  inputName,
  input,
  inputState,
  handleInputChange,
  ref,
  ...props
}: TextInputProps) {
  return (
    <>
      <input
        name={inputName}
        type={input.type}
        value={inputState.value ?? undefined}
        placeholder={input.placeholder}
        onChange={handleInputChange}
        className="border-gray-09 h-[41px] flex-1 border-b-[1px] text-[16px] leading-[17px] placeholder:text-[12px] placeholder:leading-[17px] placeholder:text-gray06"
        ref={ref}
        {...props}
      />
      {input.button && (
        <Button
          type="button"
          value={input.button.value}
          onClick={input.button.onClick}
          theme="pink-outline"
          size="md"
          className="h-[41px]"
        />
      )}
    </>
  )
}
