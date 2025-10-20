
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PATCH - Accept, reject, or cancel invitation
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

    const { action } = await req.json();
    const { id } = params;

    if (!["accept", "reject", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    // Find invitation
    const invitation = await prisma.practiceInvitation.findUnique({
      where: { id },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
        receiver: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitación no encontrada" },
        { status: 404 }
      );
    }

    // Validate permissions
    if (action === "cancel" && invitation.senderId !== user.id) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    if (["accept", "reject"].includes(action) && invitation.receiverId !== user.id) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    // Handle action
    if (action === "accept") {
      // Update invitation
      const updatedInvitation = await prisma.practiceInvitation.update({
        where: { id },
        data: {
          status: "ACCEPTED",
          respondedAt: new Date(),
        },
      });

      // Create connection
      const connection = await prisma.practiceConnection.create({
        data: {
          user1Id: invitation.senderId,
          user2Id: invitation.receiverId,
        },
      });

      // Create notification for sender
      await prisma.practiceNotification.create({
        data: {
          userId: invitation.senderId,
          type: "INVITATION_ACCEPTED",
          title: "¡Invitación aceptada!",
          message: `${invitation.receiver.name || invitation.receiver.email} aceptó tu invitación`,
          actionUrl: "/practice?tab=partners",
        },
      });

      return NextResponse.json({
        invitation: updatedInvitation,
        connection,
      });
    } else if (action === "reject") {
      const updatedInvitation = await prisma.practiceInvitation.update({
        where: { id },
        data: {
          status: "REJECTED",
          respondedAt: new Date(),
        },
      });

      // Create notification for sender
      await prisma.practiceNotification.create({
        data: {
          userId: invitation.senderId,
          type: "INVITATION_REJECTED",
          title: "Invitación rechazada",
          message: `${invitation.receiver.name || invitation.receiver.email} rechazó tu invitación`,
          actionUrl: "/practice?tab=invitations",
        },
      });

      return NextResponse.json({ invitation: updatedInvitation });
    } else {
      // cancel
      const updatedInvitation = await prisma.practiceInvitation.update({
        where: { id },
        data: {
          status: "CANCELLED",
        },
      });

      return NextResponse.json({ invitation: updatedInvitation });
    }
  } catch (error) {
    console.error("Error updating invitation:", error);
    return NextResponse.json(
      { error: "Error al actualizar invitación" },
      { status: 500 }
    );
  }
}
