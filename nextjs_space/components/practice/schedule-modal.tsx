
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Video, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partner: any;
}

export function ScheduleModal({ isOpen, onClose, onSuccess, partner }: ScheduleModalProps) {
  const [scheduledFor, setScheduledFor] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/practice/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: partner.id,
          scheduledFor: new Date(scheduledFor).toISOString(),
          topic,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al programar sesión");
      }

      toast.success("¡Sesión programada con sala de videollamada automática!");
      setScheduledFor("");
      setTopic("");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const minDateTime = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programar Sesión de Práctica</DialogTitle>
          <DialogDescription>
            Programa una sesión con {partner?.name || partner?.email}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Info banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Videollamada automática
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Se generará automáticamente una sala de videollamada segura usando Jitsi Meet. 
                  No necesitas configurar nada adicional.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="scheduledFor">Fecha y hora</Label>
            <Input
              id="scheduledFor"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              min={minDateTime}
              required
              className="text-base"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Selecciona cuándo quieres tener la sesión
            </p>
          </div>

          <div>
            <Label htmlFor="topic">Tema de conversación (opcional)</Label>
            <Input
              id="topic"
              placeholder="Ej: Business English, Casual conversation, Interview practice"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Define sobre qué quieren conversar
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Programando...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Programar Sesión
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
