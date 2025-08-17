// src/components/dashboard/ConnectionStatus.tsx

'use client';

import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusProps {
  isConnected: boolean;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export function ConnectionStatus({ isConnected, status }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'bg-green-500',
          text: 'Live',
          variant: 'default' as const,
        };
      case 'connecting':
        return {
          icon: Wifi,
          color: 'bg-yellow-500',
          text: 'Connecting',
          variant: 'secondary' as const,
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'bg-red-500',
          text: 'Error',
          variant: 'destructive' as const,
        };
      default:
        return {
          icon: WifiOff,
          color: 'bg-gray-500',
          text: 'Offline',
          variant: 'secondary' as const,
        };
    }
  };

  const { icon: Icon, color, text, variant } = getStatusConfig();

  return (
    <Badge variant={variant} className="flex items-center gap-1.5">
      <motion.div
        className={`w-2 h-2 rounded-full ${color}`}
        animate={{
          scale: isConnected ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isConnected ? Infinity : 0,
        }}
      />
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{text}</span>
    </Badge>
  );
}