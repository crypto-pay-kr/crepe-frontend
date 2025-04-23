import { COLORS } from "../../constants/colors";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-1 bg-gray-200 mt-10 mx-5">
      <div
        className={`h-full bg-[${COLORS.blue}]`}
        style={{
            width: `${Math.max((progress / 3) * 100, 30)}%`, 
          }}
      ></div>
    </div>
  );
}
