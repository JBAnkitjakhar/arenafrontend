// src/components/ui/select.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select component');
  }
  return context;
};

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, onOpenChange: setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, onOpenChange } = useSelect();

  return (
    <button
      onClick={() => onOpenChange(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
};

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value } = useSelect();
  return <span>{value || placeholder}</span>;
};

export const SelectContent = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, onOpenChange } = useSelect();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
      <div className={cn(
        'absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto',
        className
      )}>
        {children}
      </div>
    </>
  );
};

export const SelectItem = ({ children, value }: {
  children: React.ReactNode;
  value: string;
}) => {
  const { onValueChange, onOpenChange } = useSelect();

  return (
    <div
      onClick={() => {
        onValueChange(value);
        onOpenChange(false);
      }}
      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
    >
      {children}
    </div>
  );
};