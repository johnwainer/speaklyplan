
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [externalLink, setMeetingLink] = useState("");
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
          externalLink,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al programar sesión");
      }

      toast.success("¡Sesión programada exitosamente!");
      setScheduledFor("");
      setTopic("");
      setMeetingLink("");
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
          <div>
            <Label htmlFor="scheduledFor">Fecha y hora</Label>
            <Input
              id="scheduledFor"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              min={minDateTime}
              required
            />
          </div>

          <div>
            <Label htmlFor="topic">Tema (opcional)</Label>
            <Input
              id="topic"
              placeholder="Ej: Business English, Casual conversation"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="externalLink">Link de reunión (opcional)</Label>
            <Input
              id="externalLink"
              type="url"
              placeholder="https://meet.google.com/..."
              value={externalLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Puedes usar Google Meet, Zoom, etc.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Programando..." : "Programar Sesión"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
