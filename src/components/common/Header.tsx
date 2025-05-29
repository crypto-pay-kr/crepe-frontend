import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import ProgressBar from "./ProgressBar";

interface HeaderProps {
  title: string;
  progress?: number; // 0-3 for progress bar
  isStore?: boolean;
  onBackClick?: () => void;// 커스텀 뒤로가기 함수 추가
  disableBack?: boolean;
}

export default function Header({
                                 title,
                                 progress,
                                 isStore = false,
                                 onBackClick,
                                 disableBack
                               }: HeaderProps) {
  const navigate = useNavigate();

  // 뒤로가기 처리 함수
  const handleBackClick = () => {
    if (onBackClick) {
      // 커스텀 뒤로가기 함수가 있으면 그것을 사용
      onBackClick();
    } else {
      // 없으면 기본 브라우저 뒤로가기 실행
      navigate(-1);
    }
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-lg ">
        <div className="h-14 flex items-center px-6 relative">
          {!disableBack && (
            <button
              className="
                mr-4 p-1 rounded-lg
                transition-all duration-200 ease-out
                hover:bg-gray-100 active:scale-95 active:bg-gray-200
              "
              onClick={handleBackClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-colors duration-200"
              >
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
          )}
          <h1 className="
            text-lg font-semibold flex-1 text-center
            text-gray-800 tracking-tight
            pr-8
          ">
            {title}
          </h1>
        </div>
      </div>
      {progress !== undefined && <ProgressBar progress={progress} isStore={isStore} />}
    </>
  );
}