import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm shadow-primary/20 focus-visible:ring-primary border border-transparent',
  secondary:
    'bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm shadow-secondary/20 focus-visible:ring-secondary border border-transparent',
  accent:
    'bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm shadow-secondary/20 focus-visible:ring-secondary border border-transparent',
  outline:
    'border border-border bg-surface text-gray-700 hover:bg-surface-muted active:bg-gray-100 hover:text-gray-900 focus-visible:ring-primary shadow-sm',
  ghost:
    'bg-transparent text-gray-700 hover:bg-surface-muted active:bg-gray-200 hover:text-gray-900 focus-visible:ring-gray-400 border border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-500/20 focus-visible:ring-red-500 border border-transparent',
};

const sizeStyles = {
  sm: 'text-xs px-3 py-1.5 h-8 gap-1.5 rounded-md font-medium',
  md: 'text-sm px-4 py-2 h-10 gap-2 rounded-lg font-medium',
  lg: 'text-base px-6 py-2.5 h-12 gap-2.5 rounded-lg font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const spinnerVariant =
      variant === 'outline' || variant === 'ghost' ? 'primary' : 'white';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {isLoading && (
          <Spinner
            size={size === 'sm' ? 'xs' : 'sm'}
            variant={spinnerVariant}
            className="animate-spin"
          />
        )}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
