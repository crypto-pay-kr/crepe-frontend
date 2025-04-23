import { useChangePhone } from '@/api/user/change/hooks/useChangePhone'
import { useGetUserMyInfo } from '@/api/user/my/hooks/useGetUserMyInfo'
import { useGetCounselorProfile } from '@/api/counselor/hooks/useGetCounselorProfile'
import FormItem from '@/components/ui/form/form-item'
import CodeInput from '@/components/ui/form/input/code-input'
import { inputContent } from '@/components/ui/form/input/input-content'
import { inputDefault } from '@/components/ui/form/input/input-default'
import PhoneInput from '@/components/ui/form/input/phone-input'
import TextInput from '@/components/ui/form/text-input'
import Modal from '@/components/ui/modal/modal'
import { useAuthStore } from '@/stores/useAuthStore'
import { InputProps, InputState } from '@/type/ui/input'
import { isValidPhoneNumber, returnOnlyNumber } from '@/utils/regex'
import { ChangeEvent, useEffect, useState } from 'react'

export default function ChangePhoneInput(
  props: InputProps & {
    onSuccess: () => void
  }
) {
  const [modalOpen, setModalOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<InputState>(inputDefault)
  const [code, setCode] = useState<InputState>(inputDefault)
  const { mutate: changePhone, isSuccess: isChangePhoneSuccess } =
    useChangePhone()
  const { userRole } = useAuthStore()
  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserMyInfo(
    userRole === 'USER'
  )
  const { data: counselorInfo, isLoading: isCounselorInfoLoading } =
    useGetCounselorProfile()

  useEffect(() => {
    setCode(inputDefault)
    setPhoneNumber(inputDefault)
  }, [modalOpen])

  useEffect(() => {
    if (isChangePhoneSuccess) setModalOpen(false)
  }, [isChangePhoneSuccess])

  if (isUserInfoLoading || isCounselorInfoLoading) return <></>

  return (
    <>
      <TextInput
        inputName="phone"
        input={{
          type: 'text',
          placeholder:
            userRole === 'USER'
              ? userInfo?.phone!
              : counselorInfo?.phoneNumber!,
          button: {
            value: '휴대전화 변경',
            onClick: () => {
              setModalOpen(true)
            },
          },
        }}
        inputState={{ value: props.value }}
        handleInputChange={() => {}}
        disabled
      />
      {modalOpen && (
        <Modal
          title="휴대전화 변경"
          buttonContent="변경하기"
          confirmEvent={() => {
            if (code.isSuccess) {
              changePhone(phoneNumber.value)
            }
          }}
          setOpen={setModalOpen}
          content={
            <div className="flex flex-col items-start gap-[20px] pb-[60px] pt-[20px] text-left">
              <FormItem
                title={inputContent.phone.title}
                message={inputContent.phone.message}
                state={{
                  isSuccess: phoneNumber.isSuccess,
                  regexValidation: phoneNumber.regexValidation,
                }}
                input={
                  <PhoneInput
                    value={phoneNumber.value}
                    smsType="CHANGE_PHONE"
                    regexValidation={phoneNumber.regexValidation}
                    buttonEnabled={true}
                    onSuccess={() => {
                      setPhoneNumber({
                        ...phoneNumber,
                        isSuccess: true,
                      })
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (phoneNumber.isSuccess) {
                        setPhoneNumber({
                          value: returnOnlyNumber(e.target.value),
                          regexValidation: isValidPhoneNumber(
                            returnOnlyNumber(e.target.value)
                          ),
                          isSuccess: undefined,
                        })
                      } else {
                        setPhoneNumber({
                          ...phoneNumber,
                          value: returnOnlyNumber(e.target.value),
                          regexValidation: isValidPhoneNumber(
                            returnOnlyNumber(e.target.value)
                          ),
                        })
                      }
                    }}
                  />
                }
              />
              <FormItem
                title={inputContent.code.title}
                message={inputContent.code.message}
                state={{
                  isSuccess: code.isSuccess,
                  regexValidation: code.regexValidation,
                }}
                input={
                  <CodeInput
                    value={code.value}
                    smsType="CHANGE_PHONE"
                    isMessageSent={!!phoneNumber.isSuccess}
                    phoneNumber={phoneNumber.value}
                    buttonEnabled={!!phoneNumber.isSuccess}
                    regexValidation={code.regexValidation}
                    onSuccess={() => {
                      setCode({
                        ...code,
                        isSuccess: true,
                      })
                    }}
                    onError={() => {
                      setCode({
                        ...code,
                        isSuccess: false,
                      })
                    }}
                    onChange={e => {
                      if (code.isSuccess) {
                        setCode({
                          value: e.target.value,
                          regexValidation: e.target.value.length > 0,
                          isSuccess: undefined,
                        })
                      } else {
                        setCode({
                          ...code,
                          value: e.target.value,
                          regexValidation: e.target.value.length > 0,
                        })
                      }
                    }}
                  />
                }
              />
            </div>
          }
        />
      )}
    </>
  )
}
