
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleStatus {
  connected: boolean;
  expiresAt: string | null;
}

export function GoogleCalendarConnect() {
  const [status, setStatus] = useState<GoogleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/google/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error checking Google status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const response = await fetch('/api/google/auth');
      if (response.ok) {
        const data = await response.json();
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo iniciar la conexión con Google',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error connecting to Google:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al conectar con Google',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const response = await fetch('/api/google/disconnect', {
        method: 'POST',
      });
      
      if (response.ok) {
        setStatus({ connected: false, expiresAt: null });
        toast({
          title: 'Desconectado',
          description: 'Tu cuenta de Google ha sido desconectada',
        });
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo desconectar Google Calendar',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error disconnecting Google:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al desconectar Google Calendar',
        variant: 'destructive',
      });
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg">Google Calendar</CardTitle>
            <CardDescription className="text-sm">
              Conecta tu cuenta para crear reuniones automáticas con Google Meet
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status?.connected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium text-sm">Conectado correctamente</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Todas tus prácticas 1 a 1 se crearán automáticamente con un link de Google Meet desde tu cuenta.
            </p>
            <Button
              onClick={handleDisconnect}
              disabled={disconnecting}
              variant="outline"
              size="sm"
            >
              {disconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desconectando...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Desconectar
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para que tus prácticas 1 a 1 se creen automáticamente con links de Google Meet, debes conectar tu cuenta de Google.
            </p>
            <Button
              onClick={handleConnect}
              disabled={connecting}
              size="sm"
            >
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Conectar con Google
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
