// // src/components/ui/card.tsx

// import React from 'react';
// import { cn } from '@/lib/utils';

// export const Card = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn('rounded-lg border bg-white shadow-sm', className)}
//     {...props}
//   />
// ));
// Card.displayName = 'Card';

// export const CardHeader = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn('flex flex-col space-y-1.5 p-6', className)}
//     {...props}
//   />
// ));
// CardHeader.displayName = 'CardHeader';

// export const CardTitle = React.forwardRef<
//   HTMLParagraphElement,
//   React.HTMLAttributes<HTMLHeadingElement>
// >(({ className, ...props }, ref) => (
//   <h3
//     ref={ref}
//     className={cn('text-lg font-semibold leading-none tracking-tight', className)}
//     {...props}
//   />
// ));
// CardTitle.displayName = 'CardTitle';

// export const CardDescription = React.forwardRef<
//   HTMLParagraphElement,
//   React.HTMLAttributes<HTMLParagraphElement>
// >(({ className, ...props }, ref) => (
//   <p
//     ref={ref}
//     className={cn('text-sm text-gray-600', className)}
//     {...props}
//   />
// ));
// CardDescription.displayName = 'CardDescription';

// export const CardContent = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
// ));
// CardContent.displayName = 'CardContent';

// src/components/ui/card.tsx

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'glow' | 'minimal';
  animate?: boolean;
  hover?: boolean;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const Card = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', animate = false, hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'rounded-lg border bg-white shadow-sm',
      elevated: 'rounded-xl border bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
      glass: 'rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg',
      gradient: 'rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl border border-gray-200',
      glow: 'rounded-xl border bg-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 border-blue-200',
      minimal: 'rounded-lg border-0 bg-transparent',
    };

    const cardClasses = cn(
      variants[variant],
      hover && 'cursor-pointer transition-all duration-300 hover:scale-[1.02]',
      className
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';