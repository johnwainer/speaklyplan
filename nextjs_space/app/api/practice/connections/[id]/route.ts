
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// DELETE - Remove practice connection
export async function DELETE(
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

    // Find connection
    const connection = await prisma.practiceConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Conexión no encontrada" },
        { status: 404 }
      );
    }

    // Validate user is part of connection
    if (connection.user1Id !== user.id && connection.user2Id !== user.id) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    // Soft delete - mark as inactive
    await prisma.practiceConnection.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Conexión eliminada" });
  } catch (error) {
    console.error("Error deleting connection:", error);
    return NextResponse.json(
      { error: "Error al eliminar conexión" },
      { status: 500 }
    );
  }
}
