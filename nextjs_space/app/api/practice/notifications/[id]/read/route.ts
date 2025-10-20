
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PATCH - Mark notification as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Find notification
    const notification = await prisma.practiceNotification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notificación no encontrada" },
        { status: 404 }
      );
    }

    // Validate ownership
    if (notification.userId !== user.id) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    // Update notification
    const updatedNotification = await prisma.practiceNotification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ notification: updatedNotification });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Error al actualizar notificación" },
      { status: 500 }
    );
  }
}
