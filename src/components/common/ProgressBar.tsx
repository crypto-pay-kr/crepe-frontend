import { COLORS } from "../../constants/colors";

interface ProgressBarProps {
  progress: number;
  isStore?: boolean;
}

export default function ProgressBar({ progress, isStore=false }: ProgressBarProps) {
  const maxSteps = isStore ? 4 : 3; 
  const calculatedWidth = Math.max((progress / maxSteps) * 100, maxSteps*10);

  return (
    <div className="h-1 bg-gray-200 mt-10 mx-5">
      <div
        className={`h-full bg-[${COLORS.blue}]`}
        style={{
          width: `${calculatedWidth}%`,
        }}
      ></div>
    </div>
  );
}
