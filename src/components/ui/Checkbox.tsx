'use client';

import { cn } from '@/lib/utils';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            'peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-white/20 bg-white/10 transition-all checked:border-indigo-500 checked:bg-indigo-500',
            className,
          )}
          {...props}
        />
        <div className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100">
          <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
        </div>
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
