import React from 'react';
import { cn } from '@/src/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'cyan' | 'violet' | 'none';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = 'none', children, ...props }, ref) => {
    const glowStyles = {
      cyan: "hover:shadow-[0_0_30px_rgba(53,212,255,0.15)] border-primary/20 hover:border-primary/50 transition-all duration-300",
      violet: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] border-secondary/20 hover:border-secondary/50 transition-all duration-300",
      none: "border-surface-3",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-1 border rounded-2xl p-6 overflow-hidden relative",
          glowStyles[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
