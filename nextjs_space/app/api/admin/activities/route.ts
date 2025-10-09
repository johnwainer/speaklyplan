
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

    // Get recent user progress completions
    const recentProgress = await prisma.userProgress.findMany({
      where: {
        completed: true,
        completedAt: {
          not: null
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        activity: {
          select: {
            title: true,
            category: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 50
    })

    // Get recent practice sessions
    const recentSessions = await prisma.practiceSession.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    // Get recent conversations
    const recentConversations = await prisma.chatConversation.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: 50
    })

    // Combine and format activities
    const activities = [
      ...recentProgress.map(p => ({
        id: `progress-${p.id}`,
        userName: p.user.name || "Usuario",
        userEmail: p.user.email,
        action: `Completó actividad: ${p.activity.title}`,
        timestamp: p.completedAt?.toISOString() || new Date().toISOString(),
        details: `Categoría: ${p.activity.category}`
      })),
      ...recentSessions.map(s => ({
        id: `session-${s.id}`,
        userName: s.user.name || "Usuario",
        userEmail: s.user.email,
        action: `Completó sesión de práctica: ${s.sessionType}`,
        timestamp: s.createdAt.toISOString(),
        details: `Duración: ${Math.floor(s.duration / 60)} minutos • ${s.messagesCount} mensajes`
      })),
      ...recentConversations.map(c => ({
        id: `conversation-${c.id}`,
        userName: c.user.name || "Usuario",
        userEmail: c.user.email,
        action: `Inició conversación con Tutor AI`,
        timestamp: c.startedAt.toISOString(),
        details: c.context ? `Contexto: ${c.context}` : ""
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 100)

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
