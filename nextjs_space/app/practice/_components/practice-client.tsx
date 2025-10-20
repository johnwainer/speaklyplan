
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/app-header";
import { InviteModal } from "@/components/practice/invite-modal";
import { InvitationCard } from "@/components/practice/invitation-card";
import { PartnersList } from "@/components/practice/partners-list";
import { SessionsList } from "@/components/practice/sessions-list";
import { HistoryList } from "@/components/practice/history-list";
import { Bell, UserPlus, Users, Calendar, History } from "lucide-react";
import { toast } from "react-hot-toast";

export function PracticeClient() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "invitations";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data states
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [completedMeetings, setCompletedMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch data
  const fetchInvitations = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch("/api/practice/invitations?type=received"),
        fetch("/api/practice/invitations?type=sent"),
      ]);

      if (receivedRes.ok) {
        const data = await receivedRes.json();
        setReceivedInvitations(data.invitations);
      }

      if (sentRes.ok) {
        const data = await sentRes.json();
        setSentInvitations(data.invitations);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch("/api/practice/connections");
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const [scheduledRes, completedRes] = await Promise.all([
        fetch("/api/practice/meetings?status=scheduled"),
        fetch("/api/practice/meetings?status=completed"),
      ]);

      if (scheduledRes.ok) {
        const data = await scheduledRes.json();
        setScheduledMeetings(data.meetings);
      }

      if (completedRes.ok) {
        const data = await completedRes.json();
        setCompletedMeetings(data.meetings);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/practice/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
    fetchConnections();
    fetchMeetings();
    fetchNotifications();

    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchInvitations();
    fetchConnections();
    fetchMeetings();
    fetchNotifications();
  };

  const pendingReceivedCount = receivedInvitations.filter(
    (inv: any) => inv.status === "PENDING"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AppHeader 
        currentPage="one-on-one"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Prácticas 1 a 1</h1>
            <p className="text-muted-foreground mt-1">
              Practica inglés con otros usuarios de la plataforma
            </p>
          </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => setActiveTab("invitations")}>
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
              <Badge className="ml-2">{unreadCount}</Badge>
            </Button>
          )}
          <Button onClick={() => setInviteModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nueva Invitación
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Invitaciones
            {pendingReceivedCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingReceivedCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Compañeros
            <Badge variant="secondary" className="ml-1">
              {connections.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sesiones
            <Badge variant="secondary" className="ml-1">
              {scheduledMeetings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        {/* Invitations Tab */}
        <TabsContent value="invitations" className="space-y-6 mt-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Invitaciones Recibidas ({receivedInvitations.length})
            </h2>
            {receivedInvitations.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No tienes invitaciones recibidas.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {receivedInvitations.map((invitation: any) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    type="received"
                    onUpdate={handleRefresh}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Invitaciones Enviadas ({sentInvitations.length})
            </h2>
            {sentInvitations.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No has enviado invitaciones aún.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {sentInvitations.map((invitation: any) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    type="sent"
                    onUpdate={handleRefresh}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Compañeros de Práctica ({connections.length})
          </h2>
          <PartnersList connections={connections} onUpdate={handleRefresh} />
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Sesiones Programadas ({scheduledMeetings.length})
          </h2>
          <SessionsList meetings={scheduledMeetings} onUpdate={handleRefresh} />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Historial de Sesiones ({completedMeetings.length})
          </h2>
          <HistoryList meetings={completedMeetings} />
        </TabsContent>
      </Tabs>

        {/* Invite Modal */}
        <InviteModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onSuccess={handleRefresh}
        />
      </div>
    </div>
  );
}
