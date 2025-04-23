import ChevronRightIcon from '@/assets/common/svg/chevron-right-icon'
import { colors } from '@/type/colors'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface FormItemProps {
  title: string
  input?: ReactNode
  desc?: string
  state?: {
    isSuccess?: boolean | null
    regexValidation?: boolean | null
  }
  message?: {
    regexValidate?: string
    regexError?: string
    success?: string
    fail?: string
  }
  link?: string
}
export default function FormItem({
  title,
  desc,
  input,
  state,
  message,
  link,
}: FormItemProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      {!!link ? (
        <Link
          to={link}
          className="flex justify-between border-b-[1px] border-[#70737C38] pb-[20px]"
        >
          <label className="text-[14px] font-bold">{title}</label>
          <ChevronRightIcon color={colors.gray01} />
        </Link>
      ) : (
        <>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-bold">{title}</label>
            {desc && <p className="text-[12px] text-gray06">{desc}</p>}
          </div>
          <div className="flex gap-[7px]">{input}</div>
          {state && (
            <p className="text-[12px] text-pink03">
              {state!.isSuccess === undefined || state!.isSuccess === null ? (
                <>
                  {state!.regexValidation === true && message?.regexValidate}
                  {state!.regexValidation === false && message?.regexError}
                </>
              ) : (
                <>
                  {state!.isSuccess === true && message?.success}
                  {state!.isSuccess === false && message?.fail}
                </>
              )}
            </p>
          )}
        </>
      )}
    </div>
  )
}
