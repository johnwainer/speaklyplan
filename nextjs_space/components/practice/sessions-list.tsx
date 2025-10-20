
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isFuture, isToday, isTomorrow, differenceInMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Video, X, Clock, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { JitsiMeeting } from "./jitsi-meeting";
import { useSession } from "next-auth/react";

interface SessionsListProps {
  meetings: any[];
  onUpdate: () => void;
}

export function SessionsList({ meetings, onUpdate }: SessionsListProps) {
  const [activeMeeting, setActiveMeeting] = useState<any>(null);
  const [showJitsiModal, setShowJitsiModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { data: session } = useSession() || {};

  const handleJoinMeeting = async (meeting: any) => {
    if (!meeting.jitsiRoomName) {
      toast.error("Esta sesión no tiene una sala de videollamada configurada");
      return;
    }

    // Mark as in progress
    try {
      await fetch(`/api/practice/meetings/${meeting.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
    } catch (error) {
      console.error("Error marking meeting as started:", error);
    }

    setActiveMeeting(meeting);
    setShowJitsiModal(true);
  };

  const handleMeetingEnd = async () => {
    if (activeMeeting) {
      try {
        await fetch(`/api/practice/meetings/${activeMeeting.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "complete" }),
        });
        onUpdate();
      } catch (error) {
        console.error("Error marking meeting as completed:", error);
      }
    }
    setShowJitsiModal(false);
    setActiveMeeting(null);
  };

  const handleCancel = async (meetingId: string) => {
    if (!confirm("¿Estás seguro de cancelar esta sesión?")) {
      return;
    }

    try {
      const res = await fetch(`/api/practice/meetings/${meetingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al cancelar sesión");
      }

      toast.success("Sesión cancelada");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCopyLink = (meeting: any) => {
    if (meeting.externalLink) {
      navigator.clipboard.writeText(meeting.externalLink);
      setCopiedId(meeting.id);
      toast.success("Link copiado al portapapeles");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Hoy";
    if (isTomorrow(date)) return "Mañana";
    return format(date, "EEEE d 'de' MMMM", { locale: es });
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const minutes = differenceInMinutes(date, now);
    
    if (minutes < 0) return "Ahora";
    if (minutes < 60) return `En ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `En ${hours} hora${hours > 1 ? 's' : ''}`;
  };

  if (meetings.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
            <Video className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            No tienes sesiones programadas
          </p>
          <p className="text-sm text-gray-600">
            Programa una sesión con tus compañeros de práctica y empieza a mejorar tu inglés juntos
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {meetings.map((meeting) => {
          const scheduledDate = meeting.scheduledFor ? new Date(meeting.scheduledFor) : null;
          const isUpcoming = scheduledDate && isFuture(scheduledDate);
          const canJoin = scheduledDate && differenceInMinutes(scheduledDate, new Date()) <= 15;

          return (
            <Card 
              key={meeting.id} 
              className={`p-4 transition-all ${
                canJoin 
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 shadow-lg' 
                  : 'bg-white/70 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                  <AvatarImage src={meeting.partner.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {meeting.partner.name?.charAt(0) ||
                      meeting.partner.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {meeting.partner.name || meeting.partner.email}
                      </p>
                      {meeting.topic && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Sparkles className="h-3 w-3" />
                          {meeting.topic}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {meeting.status === "IN_PROGRESS" && (
                        <Badge className="bg-green-500 animate-pulse">En curso</Badge>
                      )}
                      {canJoin && meeting.status === "SCHEDULED" && (
                        <Badge className="bg-orange-500">Disponible</Badge>
                      )}
                    </div>
                  </div>

                  {scheduledDate && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>{getDateLabel(scheduledDate)}</span>
                        <span className="text-gray-400">•</span>
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>{format(scheduledDate, "p", { locale: es })}</span>
                      </div>
                      {isUpcoming && (
                        <p className="text-xs text-gray-500 ml-6">
                          {getTimeUntil(scheduledDate)}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap pt-2">
                    {meeting.jitsiRoomName && isUpcoming && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleJoinMeeting(meeting)}
                          className={
                            canJoin
                              ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-md"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          }
                        >
                          <Video className="h-4 w-4 mr-1" />
                          {canJoin ? "¡Unirse ahora!" : "Unirse a la sesión"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyLink(meeting)}
                        >
                          {copiedId === meeting.id ? (
                            <>
                              <Check className="h-4 w-4 mr-1 text-green-600" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copiar link
                            </>
                          )}
                        </Button>
                      </>
                    )}
                    {meeting.status === "SCHEDULED" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCancel(meeting.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Jitsi Meeting Modal */}
      {activeMeeting && showJitsiModal && (
        <JitsiMeeting
          isOpen={showJitsiModal}
          onClose={handleMeetingEnd}
          roomName={activeMeeting.jitsiRoomName}
          displayName={session?.user?.name || session?.user?.email || "Usuario"}
          onMeetingEnd={handleMeetingEnd}
        />
      )}
    </>
  );
}
