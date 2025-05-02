interface AddressInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

export default function AddressInput({
  label,
  value,
  onChange,
  placeholder,
  className = "mb-6"
}: AddressInputProps) {
  return (
    <div className={className}>
      <h3 className="text-base font-medium mb-2">{label}</h3>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#0a2158]"
      />
    </div>
  );
}