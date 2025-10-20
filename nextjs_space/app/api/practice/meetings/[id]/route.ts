
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PATCH - Update meeting status
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

    const { action, feedback, rating } = await req.json();
    const { id } = params;

    // Find meeting
    const meeting = await prisma.practiceMeeting.findUnique({
      where: { id },
      include: {
        connection: true,
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: "Sesión no encontrada" },
        { status: 404 }
      );
    }

    // Validate user is part of meeting
    if (meeting.initiatorId !== user.id && meeting.partnerId !== user.id) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const isInitiator = meeting.initiatorId === user.id;

    // Handle different actions
    if (action === "start") {
      const updatedMeeting = await prisma.practiceMeeting.update({
        where: { id },
        data: {
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
      });

      return NextResponse.json({ meeting: updatedMeeting });
    } else if (action === "complete") {
      const now = new Date();
      const startTime = meeting.startedAt || meeting.scheduledFor || now;
      const durationMinutes = Math.round(
        (now.getTime() - startTime.getTime()) / 60000
      );

      const updateData: any = {
        status: "COMPLETED",
        endedAt: now,
        durationMinutes,
      };

      if (isInitiator) {
        updateData.initiatorFeedback = feedback;
        updateData.initiatorRating = rating;
      } else {
        updateData.partnerFeedback = feedback;
        updateData.partnerRating = rating;
      }

      const updatedMeeting = await prisma.practiceMeeting.update({
        where: { id },
        data: updateData,
      });

      // Update connection stats
      await prisma.practiceConnection.update({
        where: { id: meeting.connectionId },
        data: {
          totalSessions: { increment: 1 },
          lastSessionAt: now,
        },
      });

      // Create notification for partner if they haven't submitted feedback yet
      const partnerId = isInitiator ? meeting.partnerId : meeting.initiatorId;
      const partnerHasFeedback = isInitiator
        ? meeting.partnerFeedback
        : meeting.initiatorFeedback;

      if (!partnerHasFeedback) {
        await prisma.practiceNotification.create({
          data: {
            userId: partnerId,
            type: "FEEDBACK_REQUESTED",
            title: "Deja tu feedback",
            message: "Comparte tu experiencia de la sesión de práctica",
            actionUrl: `/practice?tab=history`,
            meetingId: meeting.id,
          },
        });
      }

      return NextResponse.json({ meeting: updatedMeeting });
    } else if (action === "cancel") {
      const updatedMeeting = await prisma.practiceMeeting.update({
        where: { id },
        data: {
          status: "CANCELLED",
        },
      });

      return NextResponse.json({ meeting: updatedMeeting });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (error) {
    console.error("Error updating meeting:", error);
    return NextResponse.json(
      { error: "Error al actualizar sesión" },
      { status: 500 }
    );
  }
}
