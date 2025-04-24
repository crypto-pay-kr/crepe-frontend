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
  type?: 'submit' | 'button'
}

const Button: FC<ButtonProps> = ({ 
  theme, 
  size, 
  shadow, 
  onClick, 
  disabled, 
  value, 
  type = 'button',
  customContent,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
      className={cn(ButtonVariants({ theme, size }), props.className)}
      style={{
        width: props.width ? props.width : '',
        boxShadow: shadow ? '0px 1px 2px 0px #0000004D' : '',
        ...props.style,
      }}
    >
      {customContent ? customContent : value}
    </button>
  )
}

export default Button