// src/components/ui/dialog.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog component');
  }
  return context;
};

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ children, asChild, ...props }: {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}) => {
  const { onOpenChange } = useDialog();
  
  const handleClick = () => {
    onOpenChange(true);
    props.onClick?.();
  };

  if (asChild) {
    if (React.isValidElement(children)) {
      const childProps = children.props as Record<string, unknown>;
      return React.cloneElement(children, {
        ...childProps,
        onClick: (e: React.MouseEvent) => {
          handleClick();
          // Check if the original element has an onClick handler
          const originalOnClick = childProps.onClick;
          if (typeof originalOnClick === 'function') {
            originalOnClick(e);
          }
        },
      } as React.HTMLAttributes<HTMLElement>);
    }
    return children;
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export const DialogContent = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, onOpenChange } = useDialog();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Content */}
      <div className={cn(
        'relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6',
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}>
    {children}
  </div>
);

export const DialogTitle = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </h2>
);

export const DialogDescription = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={cn('text-sm text-gray-600', className)}>
    {children}
  </p>
);