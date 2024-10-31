import React from 'react';

export function Progress({ value, max = 100, ...props }: React.ProgressHTMLAttributes<HTMLProgressElement>) {
  return (
    <progress
      className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
      value={value}
      max={max}
      {...props}
    >
      {value}%
    </progress>
  );
}