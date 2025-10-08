
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { activityId, completed } = await req.json()

    if (!activityId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    // Update or create progress record
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: activityId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        activityId: activityId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    // Update user streak if activity was completed
    if (completed) {
      const userStreak = await prisma.userStreak.findUnique({
        where: { userId: session.user.id }
      })

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      let currentStreak = 1
      let bestStreak = 1

      if (userStreak) {
        const lastActivity = userStreak.lastActivity
        if (lastActivity) {
          const lastActivityDate = new Date(lastActivity)
          lastActivityDate.setHours(0, 0, 0, 0)
          
          const diffTime = today.getTime() - lastActivityDate.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays === 0) {
            // Same day, keep current streak
            currentStreak = userStreak.currentStreak
          } else if (diffDays === 1) {
            // Next day, increment streak
            currentStreak = userStreak.currentStreak + 1
          } else {
            // Gap in days, reset streak
            currentStreak = 1
          }
        }
        
        bestStreak = Math.max(currentStreak, userStreak.bestStreak)

        await prisma.userStreak.update({
          where: { userId: session.user.id },
          data: {
            currentStreak,
            bestStreak,
            lastActivity: new Date(),
          },
        })
      } else {
        await prisma.userStreak.create({
          data: {
            userId: session.user.id,
            currentStreak: 1,
            bestStreak: 1,
            lastActivity: new Date(),
          },
        })
      }

      return NextResponse.json({
        message: 'Progreso actualizado',
        progress,
        currentStreak,
        bestStreak,
      })
    }

    return NextResponse.json({
      message: 'Progreso actualizado',
      progress,
    })

  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
