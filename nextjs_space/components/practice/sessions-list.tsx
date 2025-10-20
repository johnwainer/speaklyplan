
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isFuture } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Video, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface SessionsListProps {
  meetings: any[];
  onUpdate: () => void;
}

export function SessionsList({ meetings, onUpdate }: SessionsListProps) {
  const handleJoin = (meeting: any) => {
    if (meeting.externalLink) {
      window.open(meeting.externalLink, "_blank");
      
      // Mark as in progress
      fetch(`/api/practice/meetings/${meeting.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      }).then(() => onUpdate());
    } else {
      toast.error("No hay link de reunión configurado");
    }
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

  if (meetings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No tienes sesiones programadas.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Programa una sesión con tus compañeros de práctica.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => {
        const scheduledDate = meeting.scheduledFor ? new Date(meeting.scheduledFor) : null;
        const isUpcoming = scheduledDate && isFuture(scheduledDate);

        return (
          <Card key={meeting.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={meeting.partner.image || undefined} />
                <AvatarFallback>
                  {meeting.partner.name?.charAt(0) ||
                    meeting.partner.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {meeting.partner.name || meeting.partner.email}
                    </p>
                    {meeting.topic && (
                      <p className="text-sm text-muted-foreground">
                        {meeting.topic}
                      </p>
                    )}
                  </div>
                  {meeting.status === "IN_PROGRESS" && (
                    <Badge className="bg-green-500">En curso</Badge>
                  )}
                </div>

                {scheduledDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(scheduledDate, "PPP 'a las' p", { locale: es })}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {meeting.externalLink && isUpcoming && (
                    <Button
                      size="sm"
                      onClick={() => handleJoin(meeting)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Unirse a la sesión
                    </Button>
                  )}
                  {meeting.status === "SCHEDULED" && (
                    <Button
                      size="sm"
                      variant="outline"
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
  );
}
