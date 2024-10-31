import React, { forwardRef } from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, showLabel = true, variant = 'primary', className, ...props }, ref) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

    const variantStyles = {
      primary: 'bg-blue-500 text-blue-100',
      secondary: 'bg-gray-500 text-gray-100',
      success: 'bg-green-500 text-green-100',
      danger: 'bg-red-500 text-red-100',
    };

    return (
      <div
        ref={ref}
        className={`w-full bg-gray-200 rounded overflow-hidden ${className || ''}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={`${variantStyles[variant]} text-xs font-medium text-center p-0.5 leading-none h-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        >
          {showLabel && `${Math.round(percentage)}%`}
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export default Progress;