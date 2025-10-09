
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import DashboardClient from './_components/dashboard-client'

async function getDashboardData(userId: string) {
  try {
    // Get user progress data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          include: {
            activity: {
              include: {
                week: {
                  include: {
                    phase: true
                  }
                }
              }
            }
          }
        },
        streaks: true,
      }
    })

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    // Get all plan weeks with activities
    const planWeeks = await prisma.planWeek.findMany({
      include: {
        phase: true,
        activities: {
          orderBy: { dayNumber: 'asc' }
        }
      },
      orderBy: { number: 'asc' }
    })

    // Calculate user progress
    const totalActivities = await prisma.planActivity.count()
    const completedActivities = user.progress?.filter(p => p.completed)?.length || 0
    const currentStreak = user.streaks?.[0]?.currentStreak || 0
    const bestStreak = user.streaks?.[0]?.bestStreak || 0

    // Find current week (first week with incomplete activities)
    let currentWeek = 1
    for (const week of planWeeks) {
      const weekActivities = await prisma.planActivity.count({
        where: { weekId: week.id }
      })
      const weekCompleted = await prisma.userProgress.count({
        where: {
          userId: userId,
          activity: { weekId: week.id },
          completed: true
        }
      })

      if (weekCompleted < weekActivities) {
        currentWeek = week.number
        break
      }
    }

    return {
      user: {
        id: user?.id || '',
        name: user?.name || '',
        email: user?.email || '',
        image: user?.image || null,
      },
      planWeeks: (planWeeks || []).map(week => ({
        id: week?.id || '',
        number: week?.number || 0,
        month: week?.month || 0,
        phase: week?.phase?.name || '',
        objective: week?.objective || '',
        activities: (week?.activities || []).map(activity => ({
          id: activity?.id || '',
          day: activity?.day || '',
          dayNumber: activity?.dayNumber || 0,
          title: activity?.title || '',
          description: activity?.description || '',
          duration: activity?.duration || 0,
          category: activity?.category || '',
          completed: user?.progress?.find(p => p?.activityId === activity?.id)?.completed || false,
          completedAt: user?.progress?.find(p => p?.activityId === activity?.id)?.completedAt || null,
        }))
      })),
      progress: {
        totalActivities: totalActivities || 0,
        completedActivities: completedActivities || 0,
        currentWeek: currentWeek || 1,
        currentStreak: currentStreak || 0,
        bestStreak: bestStreak || 0,
        percentageCompleted: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0
      }
    }
  } catch (error) {
    console.error('Error getting dashboard data:', error)
    // Return safe fallback data
    return {
      user: { id: userId, name: '', email: '', image: null },
      planWeeks: [],
      progress: {
        totalActivities: 0,
        completedActivities: 0,
        currentWeek: 1,
        currentStreak: 0,
        bestStreak: 0,
        percentageCompleted: 0
      }
    }
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const dashboardData = await getDashboardData(session.user.id)
  
  return (
    <DashboardClient 
      initialData={dashboardData}
      userId={session.user.id}
    />
  )
}
