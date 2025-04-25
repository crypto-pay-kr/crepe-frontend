import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import ProgressBar from "./ProgressBar";

interface HeaderProps {
  title: string;
  progress?: number; // 0-3 for progress bar
  isStore?: boolean;
  onBackClick?: () => void; // 커스텀 뒤로가기 함수 추가
}

export default function Header({
  title,
  progress,
  isStore = false,
  onBackClick
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
      <div style={{ backgroundColor: COLORS.blue }} className="text-white">
        <div className="h-14 flex items-center px-6">
          <button className="mr-4" onClick={handleBackClick}>
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