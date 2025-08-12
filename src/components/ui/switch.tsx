import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, checked, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            onChange={onChange}
            className={cn(
              "sr-only",
              className
            )}
            {...props}
          />
          <label 
            htmlFor={inputId} 
            className={cn(
              "relative h-5 w-9 cursor-pointer rounded-full transition-colors duration-200 ease-in-out block",
              "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
              checked 
                ? "bg-blue-600 dark:bg-blue-500" 
                : "bg-gray-200 dark:bg-gray-700",
              props.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white dark:bg-gray-200 shadow-sm transition-transform duration-200 ease-in-out pointer-events-none block",
              checked ? "translate-x-4 left-0.5" : "left-0.5"
            )}></span>
          </label>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer text-gray-700 dark:text-gray-300",
              props.disabled && "cursor-not-allowed opacity-70"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
