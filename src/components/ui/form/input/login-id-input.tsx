import TextInput from '@/components/ui/form/text-input'
import { InputProps } from '@/type/ui/input'

export default function LoginIdInput(
  props: InputProps & { disabled?: boolean; placeholder?: string }
) {
  return (
    <TextInput
      inputName="code"
      input={{
        type: 'text',
        placeholder: props.disabled
          ? props.placeholder!
          : '아이디를 입력해주세요.',
      }}
      disabled={props.disabled}
      inputState={{ value: props.value }}
      handleInputChange={e => {
        if (props.handleInputChange) {
          props.handleInputChange(e)
        }
        if (props.onChange) {
          props.onChange(e)
        }
      }}
    />
  )
}
