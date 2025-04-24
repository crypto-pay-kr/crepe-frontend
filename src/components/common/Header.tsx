import { COLORS } from "../../constants/colors";
import ProgressBar from "./ProgressBar";

interface HeaderProps {
  title: string
  progress?: number // 0-3 for progress bar
  isStore?: boolean
}

export default function Header({ title, progress, isStore = false }: HeaderProps) {
  return (
    <>
      <div className={`bg-[${COLORS.blue}] text-white`}>
        <div className="h-14 flex items-center px-4">
          <button className="mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>
          <h1 className="text-lg font-medium flex-1 text-center pr-8 text-white">{title}</h1>
        </div>
      </div>
      {progress !== undefined && <ProgressBar progress={progress} isStore={isStore} />}
    </>
  );
}
