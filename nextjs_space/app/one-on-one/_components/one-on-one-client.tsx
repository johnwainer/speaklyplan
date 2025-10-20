
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Users, Calendar, History, Bell } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { InviteModal } from '@/components/practice/invite-modal';
import { InvitationCard } from '@/components/practice/invitation-card';
import { PartnersList } from '@/components/practice/partners-list';
import { SessionsList } from '@/components/practice/sessions-list';
import { HistoryList } from '@/components/practice/history-list';

export function OneOnOneClient() {
  const [activeTab, setActiveTab] = useState('invitations');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [completedMeetings, setCompletedMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const router = useRouter();
  const { data: session } = useSession() || {};
  
  useEffect(() => {
    if (activeTab === 'invitations') {
      fetchInvitations();
    } else if (activeTab === 'partners') {
      fetchConnections();
    } else if (activeTab === 'sessions') {
      fetchMeetings();
    } else if (activeTab === 'history') {
      fetchMeetings();
    }
    
    // Always fetch notifications
    fetchNotifications();
    
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);
  
  const fetchInvitations = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch('/api/practice/invitations?type=received'),
        fetch('/api/practice/invitations?type=sent'),
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
      console.error('Error fetching invitations:', error);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/practice/connections');
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const [scheduledRes, completedRes] = await Promise.all([
        fetch('/api/practice/meetings?status=scheduled'),
        fetch('/api/practice/meetings?status=completed'),
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
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/practice/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleRefresh = () => {
    fetchInvitations();
    fetchConnections();
    fetchMeetings();
    fetchNotifications();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Modern Header */}
      <AppHeader 
        currentPage="one-on-one"
        actions={
          <>
            <Button variant="ghost" size="icon" className="relative shadow-sm">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            <Button
              onClick={() => setInviteModalOpen(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-sm"
              size="sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invitar
            </Button>
          </>
        }
        statsBar={
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shadow-sm">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">{connections.length}</div>
                  <div className="text-xs text-gray-600">Compañeros</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">{scheduledMeetings.filter((m: any) => new Date(m.scheduledFor) > new Date()).length}</div>
                  <div className="text-xs text-gray-600">Sesiones programadas</div>
                </div>
              </div>

              {receivedInvitations.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-sm">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-600">{receivedInvitations.length}</div>
                    <div className="text-xs text-gray-600">Invitaciones pendientes</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white/80 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Conecta y practica con otros estudiantes
                </span>
              </div>
            </div>
          </div>
        }
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="invitations" className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Invitaciones</span>
              {receivedInvitations.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {receivedInvitations.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="partners" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Compañeros</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Sesiones</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historial</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-6">
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Invitaciones Recibidas</h2>
              {receivedInvitations.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tienes invitaciones pendientes</p>
                </div>
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
            </Card>
            
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Invitaciones Enviadas</h2>
              {sentInvitations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No has enviado invitaciones</p>
                </div>
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
            </Card>
          </TabsContent>
          
          {/* Partners Tab */}
          <TabsContent value="partners">
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <PartnersList connections={connections} onUpdate={handleRefresh} />
            </Card>
          </TabsContent>
          
          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <SessionsList 
                meetings={scheduledMeetings}
                onUpdate={handleRefresh}
              />
            </Card>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <HistoryList 
                meetings={completedMeetings}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Invite Modal */}
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
