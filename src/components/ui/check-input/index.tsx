import CheckIcon from '@/assets/check-input/check-icon'
import { colors } from '@/type/colors'

export default function CheckInput({
  name,
  checked,
  label,
  value,
  required,
  onChange,
  size,
}: {
  name: string
  checked: boolean
  value: string
  label?: string
  required?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  size?: number
}) {
  return (
    <label
      style={{ height: size ? `${size}px` : 'fit-content' }}
      className="flex flex-1 cursor-pointer gap-[10px] py-[13px] font-bold"
    >
      <input
        name={name}
        className="hidden"
        type="checkbox"
        checked={checked}
        value={value}
        onChange={onChange}
      />
      <div
        className={`flex h-[20px] w-[20px] items-center justify-center rounded-full border-[1px] ${checked ? 'border-pink03 bg-pink03' : 'border-gray09 bg-gray12'}`}
      >
        <CheckIcon color={colors[checked ? 'gray13' : 'gray09']} />
      </div>
      <p style={{ fontSize: size ?? '14px' }} className="leading-[1.3]">
        {label}
        {required && (
          <span className="text-pink03" style={{ fontSize: size ?? '14px' }}>
            {' '}
            (필수)
          </span>
        )}
      </p>
    </label>
  )
}
