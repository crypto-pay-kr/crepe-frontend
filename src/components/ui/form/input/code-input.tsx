import TextInput from '@/components/ui/form/text-input'
import { InputProps } from '@/type/ui/input'

export default function CodeInput(
  props: InputProps & {
    smsType: 'FIND_ID' | 'FIND_PWD' | 'CHANGE_PHONE'
    isMessageSent: boolean
    onSuccess: () => void
    onError: () => void
    phoneNumber: string
    buttonEnabled?: boolean
    loginId?: string
  }
) {
  return (
    <TextInput
      inputName="code"
      input={{
        type: 'text',
        placeholder: '인증번호를 입력해주세요.',
        button: {
          value: '인증번호 확인',
          onClick: () => {
            if (props.buttonEnabled === false) return
            // do nothing
          },
        },
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
