

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { userId } = params

    // Obtener información completa del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAchievements: {
          include: {
            achievement: true
          },
          orderBy: {
            unlockedAt: 'desc'
          },
          take: 10
        },
        progress: {
          include: {
            activity: {
              include: {
                week: true
              }
            }
          },
          orderBy: {
            completedAt: 'desc'
          },
          take: 5
        },
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Obtener conteos manualmente
    const [
      totalActivitiesCompleted,
      totalConversations,
      totalPracticeSessions,
      totalMistakes,
      totalVocabularyProgress,
      totalAchievements,
      totalNotes,
      totalStreaks,
      totalSessionAnalytics,
      totalVocabularyCards
    ] = await Promise.all([
      prisma.userProgress.count({ where: { userId } }),
      prisma.chatConversation.count({ where: { userId } }),
      prisma.practiceSession.count({ where: { userId } }),
      prisma.commonMistake.count({ where: { userId } }),
      prisma.userVocabularyProgress.count({ where: { userId } }),
      prisma.userAchievement.count({ where: { userId } }),
      prisma.userNote.count({ where: { userId } }),
      prisma.userStreak.count({ where: { userId } }),
      prisma.sessionAnalytics.count({ where: { userId } }),
      prisma.vocabularyCard.count({ where: { userId } })
    ])

    // Obtener conversaciones recientes con conteo de mensajes
    const recentConversationsData = await prisma.chatConversation.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { messages: true }
        }
      }
    })

    // Obtener sesiones de práctica recientes
    const recentPracticeSessionsData = await prisma.practiceSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Calcular días desde el registro
    const daysSinceRegistration = Math.floor(
      (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Calcular días desde última actividad
    const daysSinceLastActive = user.lastActiveDate
      ? Math.floor(
          (new Date().getTime() - new Date(user.lastActiveDate).getTime()) / (1000 * 60 * 60 * 24)
        )
      : null

    // Calcular tasa de actividad
    const activityRate = daysSinceRegistration > 0
      ? ((totalActivitiesCompleted + totalPracticeSessions) / daysSinceRegistration).toFixed(2)
      : "0"

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastActiveDate: user.lastActiveDate,
        points: user.points,
        level: user.level,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        emailVerified: user.emailVerified,
        image: user.image,
      },
      stats: {
        totalActivitiesCompleted,
        totalConversations,
        totalPracticeSessions,
        totalMistakes,
        totalVocabularyProgress,
        totalAchievements,
        totalNotes,
        totalStreaks,
        totalSessionAnalytics,
        totalVocabularyCards,
        daysSinceRegistration,
        daysSinceLastActive,
        activityRate: parseFloat(activityRate),
      },
      recentAchievements: user.userAchievements.map((ua: any) => ({
        id: ua.id,
        achievementId: ua.achievementId,
        achievementName: ua.achievement.name,
        achievementDescription: ua.achievement.description,
        achievementIcon: ua.achievement.icon,
        achievementPoints: ua.achievement.points,
        unlockedAt: ua.unlockedAt,
      })),
      recentProgress: user.progress.map((p: any) => ({
        id: p.id,
        activityId: p.activityId,
        activityTitle: p.activity.title,
        weekNumber: p.activity.week.number,
        completed: p.completed,
        completedAt: p.completedAt,
        timeSpent: p.timeSpent,
        score: p.score,
      })),
      recentConversations: recentConversationsData.map((c: any) => ({
        id: c.id,
        title: c.title || "Conversación sin título",
        createdAt: c.startedAt,
        messageCount: c._count.messages,
      })),
      recentPracticeSessions: recentPracticeSessionsData.map((ps: any) => ({
        id: ps.id,
        sessionType: ps.sessionType,
        topic: ps.topic,
        score: ps.overallScore,
        createdAt: ps.createdAt,
        duration: ps.duration,
      }))
    })

  } catch (error) {
    console.error("Error fetching user details:", error)
    return NextResponse.json(
      { error: "Error al obtener los detalles del usuario" },
      { status: 500 }
    )
  }
}
