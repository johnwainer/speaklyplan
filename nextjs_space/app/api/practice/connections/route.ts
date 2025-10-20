
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Get all practice connections
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Find all connections where user is either user1 or user2
    const connections = await prisma.practiceConnection.findMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
        isActive: true,
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            level: true,
            practiceAvailable: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            level: true,
            practiceAvailable: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format response to show partner info
    const formattedConnections = connections.map((conn) => {
      const partner = conn.user1Id === user.id ? conn.user2 : conn.user1;

      return {
        id: conn.id,
        partner,
        totalSessions: conn.totalSessions,
        lastSessionAt: conn.lastSessionAt,
        createdAt: conn.createdAt,
      };
    });

    return NextResponse.json({ connections: formattedConnections });
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Error al obtener conexiones" },
      { status: 500 }
    );
  }
}
