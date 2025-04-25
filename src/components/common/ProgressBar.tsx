import { COLORS } from "../../constants/colors"; 

interface ProgressBarProps {
  progress: number; 
  isStore?: boolean;
  className?: string; 
}

export default function ProgressBar({ 
  progress, 
  isStore= false,
  className = "" 
}: ProgressBarProps) {
  const totalSteps = isStore ? 6 : 5;
  
  const percentage = Math.min(100, Math.max(0, (progress / (totalSteps - 1)) * 100));
  console.log('Progress value:', progress, 'Percentage:', percentage, '%');
  
  return (
    <div className={`w-full py-4 px-6 mt-4 ${className}`}>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-in-out" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: COLORS.blue
          }}
        ></div>
      </div>
    </div>
  );
}