import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, disabled, id, checked, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className={cn(
            'inline-flex items-start gap-2.5 cursor-pointer select-none',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={id}
              disabled={disabled}
              checked={checked}
              aria-invalid={!!error}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'w-4 h-4 rounded border flex items-center justify-center transition-all duration-150',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-primary-500',
                'peer-checked:bg-primary-600 peer-checked:border-primary-600 text-transparent peer-checked:text-white',
                error
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400 bg-white',
                className,
              )}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <span className="text-sm font-medium text-gray-800">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-xs text-gray-500">{description}</span>
              )}
            </div>
          )}
        </label>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
