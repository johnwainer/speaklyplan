
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LevelBadge } from './level-badge';
import { StreakDisplay } from './streak-display';
import { AchievementCard } from './achievement-card';
import { Loader2 } from 'lucide-react';

interface GamificationPanelProps {
  userId: string;
}

export function GamificationPanel({ userId }: GamificationPanelProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tutor/gamification');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading gamification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Level and Progress */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>Tu Progreso</CardTitle>
          <CardDescription>Nivel actual y experiencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <LevelBadge
              level={stats.level}
              points={stats.points}
              size="lg"
              showProgress={true}
              levelProgress={stats.levelProgress}
            />
          </div>
        </CardContent>
      </Card>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <CardTitle>Rachas</CardTitle>
          <CardDescription>Mantén tu consistencia diaria</CardDescription>
        </CardHeader>
        <CardContent>
          <StreakDisplay
            currentStreak={stats.currentStreak}
            bestStreak={stats.bestStreak}
            size="md"
          />
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Logros</CardTitle>
          <CardDescription>
            {stats.unlockedAchievements} de {stats.totalAchievements} desbloqueados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unlocked">
                Desbloqueados ({stats.unlockedAchievements})
              </TabsTrigger>
              <TabsTrigger value="locked">
                Bloqueados ({stats.totalAchievements - stats.unlockedAchievements})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unlocked" className="space-y-3">
              {stats.achievements.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  ¡Empieza a practicar para desbloquear logros!
                </p>
              ) : (
                stats.achievements.map((ua: any) => (
                  <AchievementCard
                    key={ua.achievement.code}
                    name={ua.achievement.name}
                    description={ua.achievement.description}
                    icon={ua.achievement.icon}
                    points={ua.achievement.points}
                    unlocked={true}
                    unlockedAt={ua.unlockedAt}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="locked" className="space-y-3">
              {/* You can add locked achievements here with progress */}
              <p className="text-center text-gray-500 py-8">
                Más logros disponibles próximamente...
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
