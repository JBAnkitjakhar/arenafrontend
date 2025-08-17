// src/components/dashboard/StreakCounter.tsx

'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StreakCounterProps {
  days: number;
}

export function StreakCounter({ days }: StreakCounterProps) {
  if (days === 0) return null;

  return (
    <Badge variant="secondary" className="flex items-center gap-1.5">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <Flame className="h-3 w-3 text-orange-500" />
      </motion.div>
      <span className="text-xs font-medium">{days} day streak</span>
    </Badge>
  );
}