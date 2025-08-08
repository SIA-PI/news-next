import { cn } from '@/lib/utils';
import * as React from 'react';

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) {
      return null;
    }

    const child = children as React.ReactElement<Record<string, any>>;

    return React.cloneElement(child, {
      ...props,
      ...child.props,
      ref,
      className: cn(props.className, child.props.className),
      style: {
        ...props.style,
        ...child.props.style,
      },
    });
  },
);

Slot.displayName = 'Slot';

export { Slot };
