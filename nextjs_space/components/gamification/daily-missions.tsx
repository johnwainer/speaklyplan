
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Trophy, Zap, MessageSquare, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'special';
}

interface DailyMissionsProps {
  missions?: Mission[];
}

const defaultMissions: Mission[] = [
  {
    id: 'daily-practice',
    title: 'Práctica Diaria',
    description: 'Completa 3 actividades hoy',
    icon: Zap,
    progress: 0,
    target: 3,
    xpReward: 50,
    completed: false,
    category: 'daily'
  },
  {
    id: 'tutor-session',
    title: 'Sesión con el Tutor',
    description: 'Practica 10 minutos con el Tutor AI',
    icon: MessageSquare,
    progress: 0,
    target: 10,
    xpReward: 30,
    completed: false,
    category: 'daily'
  },
  {
    id: 'vocabulary',
    title: 'Vocabulario',
    description: 'Aprende 5 palabras nuevas',
    icon: BookOpen,
    progress: 0,
    target: 5,
    xpReward: 25,
    completed: false,
    category: 'daily'
  },
  {
    id: 'perfect-week',
    title: 'Semana Perfecta',
    description: 'Completa todas las actividades de esta semana',
    icon: Trophy,
    progress: 0,
    target: 15,
    xpReward: 200,
    completed: false,
    category: 'weekly'
  }
];

export function DailyMissions({ missions = defaultMissions }: DailyMissionsProps) {
  const dailyMissions = missions.filter(m => m.category === 'daily');
  const weeklyMissions = missions.filter(m => m.category === 'weekly');
  
  const totalXp = missions.reduce((acc, m) => acc + (m.completed ? m.xpReward : 0), 0);
  const possibleXp = missions.reduce((acc, m) => acc + m.xpReward, 0);

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              Misiones
            </CardTitle>
            <CardDescription>
              Completa misiones para ganar XP extra
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">{totalXp} XP</p>
            <p className="text-xs text-gray-500">de {possibleXp} XP</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Missions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Misiones Diarias
          </h3>
          {dailyMissions.map((mission, index) => (
            <MissionCard key={mission.id} mission={mission} index={index} />
          ))}
        </div>

        {/* Weekly Missions */}
        {weeklyMissions.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-500" />
              Misiones Semanales
            </h3>
            {weeklyMissions.map((mission, index) => (
              <MissionCard key={mission.id} mission={mission} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  const Icon = mission.icon;
  const percentage = (mission.progress / mission.target) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn(
        'transition-all duration-300',
        mission.completed 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
          : 'bg-white hover:shadow-md'
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              mission.completed
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-br from-blue-100 to-purple-100 text-purple-600'
            )}>
              {mission.completed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className={cn(
                    'font-semibold text-sm',
                    mission.completed ? 'text-green-700' : 'text-gray-800'
                  )}>
                    {mission.title}
                  </h4>
                  <p className="text-xs text-gray-600">{mission.description}</p>
                </div>
                <div className={cn(
                  'text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap',
                  mission.completed
                    ? 'bg-green-200 text-green-700'
                    : 'bg-purple-100 text-purple-700'
                )}>
                  +{mission.xpReward} XP
                </div>
              </div>

              {/* Progress bar */}
              {!mission.completed && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progreso</span>
                    <span>{mission.progress}/{mission.target}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )}

              {mission.completed && (
                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  ¡Completada!
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
