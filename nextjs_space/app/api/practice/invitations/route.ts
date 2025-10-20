
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Get all invitations (sent or received)
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

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type") || "received";

    if (type === "sent") {
      const invitations = await prisma.practiceInvitation.findMany({
        where: { senderId: user.id },
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              level: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ invitations });
    } else {
      const invitations = await prisma.practiceInvitation.findMany({
        where: { receiverId: user.id },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              level: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ invitations });
    }
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Error al obtener invitaciones" },
      { status: 500 }
    );
  }
}

// POST - Send new invitation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!sender) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const { receiverEmail, message } = await req.json();

    if (!receiverEmail) {
      return NextResponse.json(
        { error: "Email del destinatario es requerido" },
        { status: 400 }
      );
    }

    // Find receiver
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Usuario destinatario no encontrado" },
        { status: 404 }
      );
    }

    if (receiver.id === sender.id) {
      return NextResponse.json(
        { error: "No puedes enviarte una invitación a ti mismo" },
        { status: 400 }
      );
    }

    // Check if already connected
    const existingConnection = await prisma.practiceConnection.findFirst({
      where: {
        OR: [
          { user1Id: sender.id, user2Id: receiver.id },
          { user1Id: receiver.id, user2Id: sender.id },
        ],
      },
    });

    if (existingConnection) {
      return NextResponse.json(
        { error: "Ya están conectados como compañeros de práctica" },
        { status: 400 }
      );
    }

    // Check if pending invitation exists
    const existingInvitation = await prisma.practiceInvitation.findFirst({
      where: {
        OR: [
          { senderId: sender.id, receiverId: receiver.id, status: "PENDING" },
          { senderId: receiver.id, receiverId: sender.id, status: "PENDING" },
        ],
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "Ya existe una invitación pendiente entre ustedes" },
        { status: 400 }
      );
    }

    // Create invitation
    const invitation = await prisma.practiceInvitation.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        message,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Create notification for receiver
    await prisma.practiceNotification.create({
      data: {
        userId: receiver.id,
        type: "INVITATION_RECEIVED",
        title: "Nueva invitación de práctica",
        message: `${sender.name || sender.email} te ha invitado a practicar inglés`,
        actionUrl: "/practice?tab=invitations",
        invitationId: invitation.id,
      },
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Error al crear invitación" },
      { status: 500 }
    );
  }
}
