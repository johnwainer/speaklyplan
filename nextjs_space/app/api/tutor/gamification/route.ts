
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getGamificationStats,
  updateStreak,
  awardPoints,
  checkAchievements,
  ACHIEVEMENTS,
} from '@/lib/ai/gamification-service';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const stats = await getGamificationStats(user.id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting gamification stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const { action, points, reason, metrics } = await req.json();

    let result: any = {};

    switch (action) {
      case 'update_streak':
        result.streak = await updateStreak(user.id);
        break;

      case 'award_points':
        result.points = await awardPoints(user.id, points, reason);
        break;

      case 'check_achievements':
        result.achievements = await checkAchievements(user.id, metrics);
        break;

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in gamification action:', error);
    return NextResponse.json(
      { error: 'Error al procesar acción' },
      { status: 500 }
    );
  }
}
