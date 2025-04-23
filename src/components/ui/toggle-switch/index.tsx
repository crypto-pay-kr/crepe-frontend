export default function ToggleSwitch({
  value,
  handleInputChange,
}: {
  value: boolean
  updateValue: React.Dispatch<React.SetStateAction<boolean>>
  handleInputChange: () => void
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        id="switch"
        type="checkbox"
        className="peer sr-only"
        onChange={handleInputChange}
        checked={value}
      />
      <label htmlFor="switch" className="hidden"></label>
      <div className="peer h-[25px] w-[48px] rounded-full bg-gray09 after:absolute after:left-[5px] after:top-[3.5px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:shadow-lg after:transition-all after:content-[''] peer-checked:bg-pink03 peer-checked:after:translate-x-full"></div>
    </label>
  )
}
