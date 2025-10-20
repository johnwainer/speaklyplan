
"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Star } from "lucide-react";

interface HistoryListProps {
  meetings: any[];
}

export function HistoryList({ meetings }: HistoryListProps) {
  if (meetings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No tienes sesiones completadas aún.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Completa tu primera sesión de práctica para ver el historial.
        </p>
      </Card>
    );
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null;

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const totalMinutes = meetings.reduce(
    (sum, m) => sum + (m.durationMinutes || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de sesiones</p>
          <p className="text-2xl font-bold">{meetings.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tiempo total</p>
          <p className="text-2xl font-bold">{totalMinutes} min</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Promedio por sesión</p>
          <p className="text-2xl font-bold">
            {Math.round(totalMinutes / meetings.length)} min
          </p>
        </Card>
      </div>

      {/* History */}
      <div className="space-y-4">
        {meetings.map((meeting) => {
          const scheduledDate = meeting.scheduledFor
            ? new Date(meeting.scheduledFor)
            : null;

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
                    <Badge>Completada</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      {scheduledDate && (
                        <p className="text-muted-foreground">
                          {format(scheduledDate, "PPP", { locale: es })}
                        </p>
                      )}
                      {meeting.durationMinutes && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{meeting.durationMinutes} minutos</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      {meeting.isInitiator && meeting.partnerRating && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Tu calificación:
                          </span>
                          {renderStars(meeting.partnerRating)}
                        </div>
                      )}
                      {!meeting.isInitiator && meeting.initiatorRating && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Tu calificación:
                          </span>
                          {renderStars(meeting.initiatorRating)}
                        </div>
                      )}
                    </div>
                  </div>

                  {meeting.isInitiator && meeting.partnerFeedback && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <p className="font-medium text-xs mb-1">
                        Feedback recibido:
                      </p>
                      <p className="text-muted-foreground italic">
                        "{meeting.partnerFeedback}"
                      </p>
                    </div>
                  )}
                  {!meeting.isInitiator && meeting.initiatorFeedback && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <p className="font-medium text-xs mb-1">
                        Feedback recibido:
                      </p>
                      <p className="text-muted-foreground italic">
                        "{meeting.initiatorFeedback}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
