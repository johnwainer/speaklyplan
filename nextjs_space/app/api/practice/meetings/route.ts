
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateJitsiRoomName, generateJitsiMeetUrl } from "@/lib/jitsi";

// GET - Get meetings (scheduled or completed)
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
    const status = searchParams.get("status") || "scheduled";

    const meetings = await prisma.practiceMeeting.findMany({
      where: {
        OR: [{ initiatorId: user.id }, { partnerId: user.id }],
        status: status === "scheduled" ? "SCHEDULED" : "COMPLETED",
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { scheduledFor: status === "scheduled" ? "asc" : "desc" },
    });

    // Format to show partner info
    const formattedMeetings = meetings.map((meeting) => {
      const partner =
        meeting.initiatorId === user.id ? meeting.partner : meeting.initiator;
      const isInitiator = meeting.initiatorId === user.id;

      return {
        ...meeting,
        partner,
        isInitiator,
      };
    });

    return NextResponse.json({ meetings: formattedMeetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Error al obtener sesiones" },
      { status: 500 }
    );
  }
}

// POST - Schedule new meeting
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const initiator = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!initiator) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const { partnerId, scheduledFor, topic } = await req.json();

    if (!partnerId || !scheduledFor) {
      return NextResponse.json(
        { error: "partnerId y scheduledFor son requeridos" },
        { status: 400 }
      );
    }

    // Find connection between users
    const connection = await prisma.practiceConnection.findFirst({
      where: {
        OR: [
          { user1Id: initiator.id, user2Id: partnerId },
          { user1Id: partnerId, user2Id: initiator.id },
        ],
        isActive: true,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "No hay conexión con este usuario" },
        { status: 400 }
      );
    }

    // Generate unique Jitsi room
    const jitsiRoomName = generateJitsiRoomName(initiator.id, partnerId);
    const jitsiMeetUrl = generateJitsiMeetUrl(jitsiRoomName);

    // Create meeting
    const meeting = await prisma.practiceMeeting.create({
      data: {
        connectionId: connection.id,
        initiatorId: initiator.id,
        partnerId,
        scheduledFor: new Date(scheduledFor),
        topic,
        jitsiRoomName,
        externalLink: jitsiMeetUrl,
        status: "SCHEDULED",
      },
      include: {
        initiator: {
          select: { id: true, name: true, email: true, image: true },
        },
        partner: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Create notification for partner
    await prisma.practiceNotification.create({
      data: {
        userId: partnerId,
        type: "SESSION_SCHEDULED",
        title: "Nueva sesión programada",
        message: `${initiator.name || initiator.email} programó una sesión de práctica${topic ? `: ${topic}` : ''}`,
        actionUrl: "/one-on-one?tab=sessions",
        meetingId: meeting.id,
      },
    });

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Error al crear sesión" },
      { status: 500 }
    );
  }
}
