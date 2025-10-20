
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Check, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface InvitationCardProps {
  invitation: any;
  type: "received" | "sent";
  onUpdate: () => void;
}

export function InvitationCard({ invitation, type, onUpdate }: InvitationCardProps) {
  const [loading, setLoading] = useState(false);

  const user = type === "received" ? invitation.sender : invitation.receiver;

  const handleAction = async (action: "accept" | "reject" | "cancel") => {
    setLoading(true);

    try {
      const res = await fetch(`/api/practice/invitations/${invitation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar invitación");
      }

      toast.success(
        action === "accept"
          ? "¡Invitación aceptada!"
          : action === "reject"
          ? "Invitación rechazada"
          : "Invitación cancelada"
      );
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (invitation.status) {
      case "PENDING":
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case "ACCEPTED":
        return <Badge className="bg-green-500">Aceptada</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rechazada</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary">Cancelada</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image || undefined} />
          <AvatarFallback>
            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.name || user.email}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(invitation.createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </p>
            </div>
            {getStatusBadge()}
          </div>

          {invitation.message && (
            <p className="text-sm text-muted-foreground italic">
              "{invitation.message}"
            </p>
          )}

          {invitation.status === "PENDING" && (
            <div className="flex gap-2">
              {type === "received" ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleAction("accept")}
                    disabled={loading}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aceptar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("reject")}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("cancel")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
