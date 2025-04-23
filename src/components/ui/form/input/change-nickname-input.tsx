import { useChangeNickname } from '@/api/user/change/hooks/useChangeNickname'
import { useGetUserMyInfo } from '@/api/user/my/hooks/useGetUserMyInfo'
import FormItem from '@/components/ui/form/form-item'
import { inputContent } from '@/components/ui/form/input/input-content'
import { inputDefault } from '@/components/ui/form/input/input-default'
import TextInput from '@/components/ui/form/text-input'
import Modal from '@/components/ui/modal/modal'
import { InputProps, InputState } from '@/type/ui/input'
import { isValidNickname } from '@/utils/regex'
import { useEffect, useState } from 'react'

export default function ChangeNicknameInput(props: InputProps) {
  const [nickname, setNickname] = useState<InputState>(inputDefault)
  const { mutate: changeNickname } = useChangeNickname(setNickname)
  const [modalOpen, setModalOpen] = useState(false)
  const { data: userInfo, isLoading } = useGetUserMyInfo()

  useEffect(() => {
    setNickname(inputDefault)
    if (modalOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [modalOpen])

  if (isLoading) return <></>

  return (
    <>
      <TextInput
        inputName="phone"
        input={{
          type: 'text',
          placeholder: userInfo!.nickname,
          button: {
            value: '닉네임 변경',
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
          title="닉네임 변경"
          buttonContent="변경하기"
          confirmEvent={() => {
            if (nickname.regexValidation) {
              changeNickname(nickname.value)
            }
          }}
          setOpen={setModalOpen}
          content={
            <div className="flex flex-col items-start gap-[20px] pb-[60px] pt-[20px] text-left">
              <p className="text-center text-[13px] font-[350] text-gray03">
                닉네임 재변경은 1주일 후 가능합니다.
              </p>
              <FormItem
                title="닉네임"
                message={inputContent.nickname.message}
                input={
                  <TextInput
                    inputName="닉네임"
                    input={{
                      type: 'text',
                      placeholder: '한글, 영어, 숫자만 입력 가능',
                    }}
                    inputState={{
                      value: nickname.value,
                    }}
                    handleInputChange={e => {
                      setNickname({
                        value: e.target.value,
                        regexValidation: isValidNickname(e.target.value),
                      })
                    }}
                  />
                }
                state={{
                  isSuccess: nickname.isSuccess,
                  regexValidation: nickname.regexValidation,
                }}
              />
            </div>
          }
        />
      )}
    </>
  )
}
