import TextInput from '@/components/ui/form/text-input'
import { InputProps } from '@/type/ui/input'

export default function PasswordInput(
  props: InputProps & { name?: string; placeholder?: string }
) {
  return (
    <TextInput
      inputName={props.name ?? 'password'}
      input={{
        type: 'password',
        placeholder: props.placeholder ?? '비밀번호를 입력하세요.',
      }}
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
