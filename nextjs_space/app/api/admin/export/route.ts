
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

    // Get all users with their stats
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            progress: true,
            conversations: true,
            practiceSessions: true,
            mistakes: true,
            vocabularyProgress: true,
            userAchievements: true
          }
        }
      }
    })

    // Create CSV content
    const headers = [
      "ID",
      "Nombre",
      "Email",
      "Rol",
      "Nivel",
      "Puntos",
      "Racha Actual",
      "Mejor Racha",
      "Actividades Completadas",
      "Conversaciones",
      "Sesiones de Práctica",
      "Errores Comunes",
      "Vocabulario",
      "Logros",
      "Fecha de Registro",
      "Última Actividad"
    ]

    const rows = users.map(user => [
      user.id,
      user.name || "",
      user.email,
      user.role,
      user.level,
      user.points,
      user.currentStreak,
      user.bestStreak,
      user._count.progress,
      user._count.conversations,
      user._count.practiceSessions,
      user._count.mistakes,
      user._count.vocabularyProgress,
      user._count.userAchievements,
      user.createdAt.toISOString(),
      user.lastActiveDate?.toISOString() || ""
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="admin-report-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
