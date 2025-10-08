
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface XpToastProps {
  points: number;
  reason: string;
  show: boolean;
  onHide: () => void;
}

export function XpToast({ points, reason, show, onHide }: XpToastProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onHide, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-20 right-4 z-50"
          initial={{ opacity: 0, x: 100, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-yellow-300">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <div>
                <p className="font-bold text-lg">+{points} XP</p>
                <p className="text-sm opacity-90">{reason}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
