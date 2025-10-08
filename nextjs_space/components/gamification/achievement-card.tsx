
'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface AchievementCardProps {
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    total: number;
  };
}

export function AchievementCard({
  name,
  description,
  icon,
  points,
  unlocked,
  unlockedAt,
  progress
}: AchievementCardProps) {
  const percentage = progress ? (progress.current / progress.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: unlocked ? 1.05 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300',
        unlocked 
          ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 border-yellow-300 shadow-lg' 
          : 'bg-gray-50 border-gray-200 opacity-70'
      )}>
        {/* Shine effect for unlocked achievements */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }}
          />
        )}

        <div className="p-4 relative z-10">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl',
              unlocked
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                : 'bg-gray-300'
            )}>
              {unlocked ? icon : <Lock className="w-6 h-6 text-gray-500" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-bold text-lg mb-1',
                unlocked ? 'text-orange-900' : 'text-gray-600'
              )}>
                {name}
              </h3>
              <p className={cn(
                'text-sm mb-2',
                unlocked ? 'text-orange-700' : 'text-gray-500'
              )}>
                {description}
              </p>

              {/* Progress bar for locked achievements */}
              {!unlocked && progress && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{progress.current}/{progress.total}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Points and date */}
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-sm font-semibold',
                  unlocked ? 'text-orange-600' : 'text-gray-500'
                )}>
                  +{points} XP
                </span>
                {unlocked && unlockedAt && (
                  <span className="text-xs text-orange-600">
                    {new Date(unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
