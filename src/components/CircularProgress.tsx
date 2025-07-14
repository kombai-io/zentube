interface CircularProgressProps {
  value?: number; // Current value
  max?: number; // Maximum value
  progress?: number; // 0-100 percentage (alternative to value/max)
  size?: number; // diameter in pixels
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  className?: string;
  children?: React.ReactNode; // Content to display in the center
}

function CircularProgress({
  value,
  max,
  progress,
  size = 40,
  strokeWidth = 3,
  color = 'rgb(34 197 94)', // green-500
  backgroundColor = 'rgb(229 231 235)', // gray-200
  showPercentage = false,
  className = '',
  children
}: CircularProgressProps) {
  // Calculate progress percentage
  let progressPercentage: number;
  if (progress !== undefined) {
    progressPercentage = progress;
  } else if (value !== undefined && max !== undefined && max > 0) {
    progressPercentage = (value / max) * 100;
  } else {
    progressPercentage = 0;
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progressPercentage, 100) / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children ? (
          children
        ) : showPercentage ? (
          <span 
            className="text-xs font-medium"
            style={{ color, fontSize: `${size * 0.25}px` }}
          >
            {Math.round(Math.min(progressPercentage, 100))}%
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default CircularProgress;
export { CircularProgress };