import { useSendSMSToFind } from '@/api/user/find/hooks/useSendSMSToFind'
import TextInput from '@/components/ui/form/text-input'
import { InputProps } from '@/type/ui/input'

export default function PhoneInput(
  props: InputProps & {
    smsType: 'FIND_ID' | 'FIND_PWD' | 'CHANGE_PHONE'
    buttonEnabled?: boolean
    onSuccess: () => void
  }
) {
  const { mutate: sendSMS } = useSendSMSToFind({ onSuccess: props.onSuccess })

  return (
    <TextInput
      inputName="phone"
      input={{
        type: 'text',
        placeholder: "'-'구분 없이 입력",
        button: {
          value: '인증번호 전송',
          onClick: () => {
            if (props.buttonEnabled === false) return
            if (props.regexValidation) {
              sendSMS({
                smsType: props.smsType,
                phone: props.value!,
              })
            }
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
