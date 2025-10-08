
'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  levelProgress?: {
    current: number;
    needed: number;
    percentage: number;
  };
}

export function LevelBadge({ 
  level, 
  points, 
  size = 'md', 
  showProgress = true,
  levelProgress 
}: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-lg',
    lg: 'w-32 h-32 text-2xl'
  };

  const getLevelColor = (lvl: number) => {
    if (lvl >= 50) return 'from-purple-500 via-pink-500 to-red-500';
    if (lvl >= 30) return 'from-yellow-400 via-orange-500 to-red-500';
    if (lvl >= 15) return 'from-green-400 via-blue-500 to-purple-500';
    if (lvl >= 5) return 'from-blue-400 via-cyan-500 to-teal-500';
    return 'from-gray-400 via-gray-500 to-gray-600';
  };

  const getLevelIcon = (lvl: number) => {
    if (lvl >= 30) return Trophy;
    if (lvl >= 10) return Star;
    return Zap;
  };

  const Icon = getLevelIcon(level);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-br opacity-90',
            getLevelColor(level)
          )}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Glow effect */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-br blur-md',
            getLevelColor(level)
          )}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white font-bold">
          <Icon className={size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'} />
          <div>Nivel {level}</div>
        </div>

        {/* Sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${20 + i * 20}%`,
              right: `${10 + i * 10}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Progress bar */}
      {showProgress && levelProgress && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{levelProgress.current} XP</span>
            <span>{levelProgress.needed} XP</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={cn('h-full bg-gradient-to-r', getLevelColor(level))}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(levelProgress.percentage, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">
            {points.toLocaleString()} XP total
          </p>
        </div>
      )}
    </div>
  );
}
