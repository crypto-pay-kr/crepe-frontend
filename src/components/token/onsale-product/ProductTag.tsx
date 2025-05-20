interface ProductTagProps {
    text: string
    color: "gray" | "purple" | "green"
  }
  
  export function ProductTag({ text, color }: ProductTagProps) {
    const bgColor = {
      gray: "bg-gray-300",
      purple: "bg-purple-200",
      green: "bg-green-200",
    }[color]
  
    return <div className={`${bgColor} px-3 py-1 rounded-md text-sm`}>{text}</div>
  }
  