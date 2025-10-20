
"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Star, Video, TrendingUp, MessageSquare } from "lucide-react";

interface HistoryListProps {
  meetings: any[];
}

export function HistoryList({ meetings }: HistoryListProps) {
  if (meetings.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            No tienes sesiones completadas aún
          </p>
          <p className="text-sm text-gray-600">
            Tu historial de práctica aparecerá aquí después de completar tus primeras sesiones
          </p>
        </div>
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
    <div className="space-y-6">
      {/* Stats */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{meetings.length}</div>
            <div className="text-xs text-gray-600">Sesiones</div>
          </div>
          <div className="h-12 w-px bg-gray-300" />
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalMinutes}</div>
            <div className="text-xs text-gray-600">Minutos</div>
          </div>
          <div className="h-12 w-px bg-gray-300" />
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(totalMinutes / meetings.length)}
            </div>
            <div className="text-xs text-gray-600">Promedio</div>
          </div>
        </div>
      </Card>

      {/* History */}
      <div className="space-y-4">
        {meetings.map((meeting) => {
          const scheduledDate = meeting.scheduledFor
            ? new Date(meeting.scheduledFor)
            : null;

          return (
            <Card key={meeting.id} className="p-4 bg-white/70 backdrop-blur-sm hover:shadow-md transition-shadow">
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
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                          <MessageSquare className="h-3 w-3" />
                          {meeting.topic}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Completada
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {scheduledDate && (
                      <p className="text-xs">
                        {format(scheduledDate, "PPP", { locale: es })}
                      </p>
                    )}
                    {meeting.durationMinutes && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-purple-600" />
                        <span className="text-xs">{meeting.durationMinutes} min</span>
                      </div>
                    )}
                    {meeting.jitsiRoomName && (
                      <div className="flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-xs">Videollamada</span>
                      </div>
                    )}
                  </div>

                  {(meeting.initiatorRating || meeting.partnerRating) && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">
                        Calificación:
                      </span>
                      {renderStars(meeting.isInitiator ? meeting.partnerRating : meeting.initiatorRating)}
                    </div>
                  )}

                  {meeting.isInitiator && meeting.partnerFeedback && (
                    <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-xs text-gray-700 mb-1.5 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Feedback recibido:
                      </p>
                      <p className="text-sm text-gray-700 italic">
                        "{meeting.partnerFeedback}"
                      </p>
                    </div>
                  )}
                  {!meeting.isInitiator && meeting.initiatorFeedback && (
                    <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-xs text-gray-700 mb-1.5 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Feedback recibido:
                      </p>
                      <p className="text-sm text-gray-700 italic">
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
