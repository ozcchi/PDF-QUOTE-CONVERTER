import React from 'react';

export function Alert({ children, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }) {
  const baseClasses = "p-4 rounded-md";
  const variantClasses = variant === 'destructive' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";

  return (
    <div className={`${baseClasses} ${variantClasses}`} {...props}>
      {children}
    </div>
  );
}

export function AlertCircle({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}

export function AlertTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className="text-lg font-medium" {...props}>{children}</h5>
  );
}

export function AlertDescription({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="text-sm" {...props}>{children}</p>
  );
}