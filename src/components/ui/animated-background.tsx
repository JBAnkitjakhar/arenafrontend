// src/components/ui/animated-background.tsx

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBackgroundProps {
  children: ReactNode;
  variant?: 'gradient' | 'particles' | 'waves' | 'grid';
  className?: string;
}

export function AnimatedBackground({ 
  children, 
  variant = 'gradient', 
  className = '' 
}: AnimatedBackgroundProps) {
  const renderBackground = () => {
    switch (variant) {
      case 'particles':
        return (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        );
      
      case 'waves':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        );
      
      case 'grid':
        return (
          <div className="absolute inset-0 bg-grid-small opacity-[0.02]" />
        );
      
      default: // gradient
        return (
          <>
            <motion.div 
              className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div 
              className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"
              animate={{
                y: [0, 15, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {renderBackground()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}