
'use client';

import { motion } from 'framer-motion';
import { Flame, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StreakDisplayProps {
  currentStreak: number;
  bestStreak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakDisplay({ currentStreak, bestStreak, size = 'md' }: StreakDisplayProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 14) return 'from-orange-500 to-red-500';
    if (streak >= 7) return 'from-yellow-500 to-orange-500';
    if (streak >= 3) return 'from-blue-500 to-cyan-500';
    return 'from-gray-400 to-gray-500';
  };

  const flameSize = size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6';
  const textSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl';

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Current Streak */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className={`${flameSize} text-orange-500`}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [-5, 5, -5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Flame className="w-full h-full" />
            </motion.div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Racha Actual</h3>
              <p className="text-xs text-gray-500">¡Sigue así!</p>
            </div>
          </div>

          <div className="text-center">
            <motion.div
              className={`${textSize} font-bold bg-gradient-to-r ${getStreakColor(currentStreak)} bg-clip-text text-transparent`}
              key={currentStreak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {currentStreak}
            </motion.div>
            <p className="text-sm text-gray-600 mt-1">
              {currentStreak === 1 ? 'día' : 'días'} consecutivos
            </p>
          </div>

          {/* Progress indicators */}
          <div className="mt-4 flex justify-center gap-1">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-8 rounded-full ${
                  i < (currentStreak % 7) ? 'bg-orange-500' : 'bg-gray-200'
                }`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Best Streak */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`${flameSize} text-purple-500`}>
              <Award className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Mejor Racha</h3>
              <p className="text-xs text-gray-500">Tu récord personal</p>
            </div>
          </div>

          <div className="text-center">
            <div className={`${textSize} font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
              {bestStreak}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {bestStreak === 1 ? 'día' : 'días'}
            </p>
          </div>

          {currentStreak === bestStreak && currentStreak > 0 && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                🎉 ¡Nuevo récord!
              </span>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}
