
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get active users (active in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const activeUsers = await prisma.user.count({
      where: {
        lastActiveDate: {
          gte: sevenDaysAgo
        }
      }
    })

    // Get new users this week
    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Get total practice sessions
    const totalSessions = await prisma.practiceSession.count()

    // Get average session duration
    const avgDuration = await prisma.practiceSession.aggregate({
      _avg: {
        duration: true
      }
    })

    // Get total messages
    const totalMessages = await prisma.chatMessage.count()

    // Get completion rate (users with at least 1 completed activity / total users)
    const usersWithProgress = await prisma.user.count({
      where: {
        progress: {
          some: {
            completed: true
          }
        }
      }
    })

    const completionRate = totalUsers > 0 ? (usersWithProgress / totalUsers) * 100 : 0

    // Calculate retention rate (active users / total users)
    const retentionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalSessions,
      avgSessionDuration: avgDuration._avg.duration || 0,
      totalMessages,
      completionRate,
      newUsersThisWeek,
      retentionRate
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
