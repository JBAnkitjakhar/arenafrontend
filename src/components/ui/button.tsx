// // src/components/ui/button.tsx
// import React from 'react';
// import { cn } from '@/lib/utils';

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'default' | 'outline' | 'ghost' | 'destructive';
//   size?: 'default' | 'sm' | 'lg';
// }

// export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant = 'default', size = 'default', ...props }, ref) => {
//     const variants = {
//       default: 'bg-blue-600 text-white hover:bg-blue-700',
//       outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
//       ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
//       destructive: 'bg-red-600 text-white hover:bg-red-700',
//     };

//     const sizes = {
//       default: 'h-10 px-4 py-2',
//       sm: 'h-8 px-3 py-1 text-sm',
//       lg: 'h-12 px-6 py-3 text-lg',
//     };

//     return (
//       <button
//         ref={ref}
//         className={cn(
//           'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
//           variants[variant],
//           sizes[size],
//           className
//         )}
//         {...props}
//       />
//     );
//   }
// );

// Button.displayName = 'Button';

// src/components/ui/button.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'gradient' | 'glow' | 'glass' | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animate?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    loading = false,
    icon,
    rightIcon,
    animate = true,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      // New enhanced variants
      gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl',
      glow: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl relative overflow-hidden',
      glass: 'backdrop-blur-sm bg-white/10 border border-white/20 text-gray-900 hover:bg-white/20 shadow-lg',
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 py-1 text-sm',
      lg: 'h-12 px-6 py-3 text-lg',
      xl: 'h-14 px-8 py-4 text-xl',
      icon: 'h-10 w-10 p-0',
    };

    const buttonContent = (
      <>
        {loading && (
          <motion.div
            className="mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.div>
        )}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
        
        {/* Glow effect for glow variant */}
        {variant === 'glow' && (
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 hover:opacity-20 transition-opacity duration-300" />
        )}
        
        {/* Shimmer effect for gradient variants */}
        {(variant === 'gradient' || variant === 'primary') && (
          <div className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-500 overflow-hidden rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
          </div>
        )}
      </>
    );

    const baseClasses = cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
      variants[variant],
      sizes[size],
      className
    );

    if (animate && !isDisabled) {
      return (
        <motion.button
          ref={ref}
          className={baseClasses}
          disabled={isDisabled}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...(props as any)}
        >
          {buttonContent}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';