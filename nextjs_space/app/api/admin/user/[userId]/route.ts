
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
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
          }
        },
        conversations: {
          include: {
            messages: true
          },
          orderBy: {
            startedAt: 'desc'
          }
        },
        practiceSessions: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        mistakes: {
          orderBy: {
            lastSeenAt: 'desc'
          }
        },
        vocabularyProgress: {
          include: {
            word: {
              include: {
                category: true
              }
            }
          }
        },
        userAchievements: {
          include: {
            achievement: true
          },
          orderBy: {
            unlockedAt: 'desc'
          }
        },
        sessionAnalytics: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        },
        learningContext: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { role, points, level } = body

    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        ...(role && { role }),
        ...(points !== undefined && { points }),
        ...(level !== undefined && { level })
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.user.delete({
      where: { id: params.userId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
