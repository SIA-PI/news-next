import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { Slot } from './Slot';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 text-white',
        primary:
          'bg-gradient-to-r from-[rgb(var(--primary))] to-purple-600 hover:from-[rgb(var(--primary))]/90 hover:to-purple-700 text-white',
        secondary: 'bg-[rgb(var(--secondary))] hover:bg-[rgb(var(--secondary))]/80 text-[rgb(var(--secondary-foreground))]',
        danger: 'bg-[rgb(var(--destructive))] hover:bg-[rgb(var(--destructive))]/90 text-white',
        ghost: 'bg-transparent hover:bg-[rgb(var(--muted))]/50 text-[rgb(var(--text-primary))]',
      },
      size: {
        default: 'py-3 px-6',
        sm: 'py-2 px-4 text-xs',
        lg: 'py-4 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
