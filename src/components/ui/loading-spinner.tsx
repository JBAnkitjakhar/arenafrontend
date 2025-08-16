// src/components/ui/loading-spinner.tsx

'use client';

import { motion } from 'framer-motion';
import { Code, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'pulse' | 'bounce' | 'dots' | 'gradient' | 'logo';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      
      case 'bounce':
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );
      
      case 'gradient':
        return (
          <motion.div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        );
      
      case 'logo':
        return (
          <motion.div
            className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center relative overflow-hidden`}
            animate={{ 
              rotate: 360,
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.7)",
                "0 0 0 10px rgba(59, 130, 246, 0)",
              ]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Code className={`${size === 'xl' ? 'h-8 w-8' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} text-white`} />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        );
      
      default:
        return (
          <motion.div
            className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="flex items-center justify-center">
        {renderSpinner()}
      </div>
      
      {text && (
        <motion.p
          className="text-gray-600 font-medium text-center"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
      
      {variant === 'logo' && (
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-500">Loading amazing features...</span>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </motion.div>
      )}
    </div>
  );
}