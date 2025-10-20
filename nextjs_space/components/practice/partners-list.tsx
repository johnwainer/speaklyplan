
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { ScheduleModal } from "./schedule-modal";

interface PartnersListProps {
  connections: any[];
  onUpdate: () => void;
}

export function PartnersList({ connections, onUpdate }: PartnersListProps) {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const handleSchedule = (partner: any) => {
    setSelectedPartner(partner);
    setScheduleModalOpen(true);
  };

  const handleDelete = async (connectionId: string) => {
    if (!confirm("¿Estás seguro de eliminar este compañero de práctica?")) {
      return;
    }

    try {
      const res = await fetch(`/api/practice/connections/${connectionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar conexión");
      }

      toast.success("Compañero eliminado");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (connections.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No tienes compañeros de práctica aún.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Envía invitaciones para conectar con otros usuarios.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {connections.map((connection) => (
          <Card key={connection.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={connection.partner.image || undefined} />
                <AvatarFallback>
                  {connection.partner.name?.charAt(0) ||
                    connection.partner.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-medium">
                    {connection.partner.name || connection.partner.email}
                  </p>
                  {connection.partner.level && (
                    <Badge variant="secondary" className="text-xs">
                      {connection.partner.level}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>{connection.totalSessions} sesiones realizadas</p>
                  {connection.lastSessionAt && (
                    <p>
                      Última: {formatDistanceToNow(new Date(connection.lastSessionAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => handleSchedule(connection.partner)}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Programar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(connection.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedPartner && (
        <ScheduleModal
          isOpen={scheduleModalOpen}
          onClose={() => {
            setScheduleModalOpen(false);
            setSelectedPartner(null);
          }}
          onSuccess={() => {
            onUpdate();
          }}
          partner={selectedPartner}
        />
      )}
    </>
  );
}
