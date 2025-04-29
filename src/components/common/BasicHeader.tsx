import { COLORS } from "../../constants/colors";

interface HeaderProps {
  title: string
}

export default function BasicHeader({ title}: HeaderProps) {
  return (
    <>
      <div className={`bg-[${COLORS.blue}] text-white`}>
        <div className="h-14 flex items-center px-4">
          <button className="mr-4">
              <path d="M15 18l-6-6 6-6"></path>
          </button>
          <h1 className="text-lg font-medium flex-1 text-center pr-8 text-white">{title}</h1>
        </div>
      </div>
    </>
  )
}
