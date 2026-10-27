import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-red-500 ml-1 font-bold">*</span>}
          </span>
        </label>
      )}

      <div className="w-full">{children}</div>

      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
};
