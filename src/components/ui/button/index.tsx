import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

export const ButtonVariants = cva(
  `
 rounded-[10px] text-[18px] font-bold disabled:bg-gray09
  `,
  {
    variants: {
      theme: {
        default: 'bg-pink03 text-white',
        'pink-outline': 'bg-white13 border-pink03 border-[1px] text-pink03',
        gray: 'bg-gray09 text-[#909499] border-gray09',
      },
      size: {
        full: 'w-full py-[10.5px]',
        md: 'text-[14px] h-full w-[94px]',
        fit: 'w-fit h-fit',
      },
    },
    defaultVariants: {
      theme: 'default',
      size: 'full',
    },
  }
)
interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  width?: number | string
  value?: string | number | readonly string[] | undefined
  customContent?: ReactNode
  shadow?: boolean
}

const Button: FC<ButtonProps> = ({ theme, size, shadow, ...props }) => {
  return (
    <button
      {...props}
      className={cn(ButtonVariants({ theme, size }), props.className)}
      style={{
        width: props.width ? props.width : '',
        boxShadow: shadow ? '0px 1px 2px 0px #0000004D' : '',
        ...props.style,
      }}
    >
      {props.customContent ? props.customContent : props.value}
    </button>
  )
}

export default Button

export function Buttonn({
  onClick,
  disabled,
  value,
  type,
}: {
  onClick?: () => void
  disabled?: boolean
  value: string
  type?: 'submit' | 'button'
}) {
  return (
    <button
      onClick={onClick}
      className="height-[38px] w-full rounded-[10px] bg-pink03 py-[10.5px] text-[18px] font-bold text-white disabled:bg-gray09"
      disabled={disabled}
      type={type ?? 'button'}
    >
      {value}
    </button>
  )
}
