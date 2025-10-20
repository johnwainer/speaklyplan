
"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { toast } from "react-hot-toast";

interface JitsiMeetingProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  displayName: string;
  onMeetingEnd?: () => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export function JitsiMeeting({
  isOpen,
  onClose,
  roomName,
  displayName,
  onMeetingEnd,
}: JitsiMeetingProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load Jitsi Meet External API
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Failed to load Jitsi script"));
        document.body.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        await loadJitsiScript();
        setIsLoading(true);

        if (!jitsiContainerRef.current) return;

        // Clean up previous instance
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }

        const domain = "meet.jit.si";
        const options = {
          roomName: roomName,
          width: "100%",
          height: "100%",
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: displayName,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            enableWelcomePage: false,
            enableClosePage: false,
            defaultLanguage: "es",
            toolbarButtons: [
              "microphone",
              "camera",
              "desktop",
              "fullscreen",
              "hangup",
              "chat",
              "settings",
              "videoquality",
              "tileview",
              "raisehand",
              "stats",
            ],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            TOOLBAR_ALWAYS_VISIBLE: false,
            DEFAULT_REMOTE_DISPLAY_NAME: "Compañero",
            MOBILE_APP_PROMO: false,
            LANG_DETECTION: false,
            DEFAULT_LANGUAGE: "es",
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;

        // Event listeners
        api.addListener("videoConferenceJoined", () => {
          setIsLoading(false);
          toast.success("Te has unido a la sesión");
        });

        api.addListener("videoConferenceLeft", () => {
          handleMeetingEnd();
        });

        api.addListener("audioMuteStatusChanged", (status: any) => {
          setIsMuted(status.muted);
        });

        api.addListener("videoMuteStatusChanged", (status: any) => {
          setIsVideoOff(status.muted);
        });

        api.addListener("readyToClose", () => {
          handleMeetingEnd();
        });
      } catch (error) {
        console.error("Error initializing Jitsi:", error);
        toast.error("Error al iniciar la videollamada");
        setIsLoading(false);
      }
    };

    initializeJitsi();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [isOpen, roomName, displayName]);

  const handleMeetingEnd = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    onMeetingEnd?.();
    onClose();
  };

  const toggleMute = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleAudio");
    }
  };

  const toggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleVideo");
    }
  };

  const hangup = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("hangup");
    }
    handleMeetingEnd();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleMeetingEnd()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[90vh] p-0">
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-white text-lg">Conectando a la sesión...</p>
              </div>
            </div>
          )}

          {/* Jitsi container */}
          <div ref={jitsiContainerRef} className="w-full h-full" />

          {/* Custom controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-center gap-3">
              <Button
                size="lg"
                variant={isMuted ? "destructive" : "secondary"}
                className="rounded-full w-14 h-14"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>

              <Button
                size="lg"
                variant={isVideoOff ? "destructive" : "secondary"}
                className="rounded-full w-14 h-14"
                onClick={toggleVideo}
              >
                {isVideoOff ? (
                  <VideoOff className="h-6 w-6" />
                ) : (
                  <Video className="h-6 w-6" />
                )}
              </Button>

              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
                onClick={hangup}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full z-20"
            onClick={handleMeetingEnd}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
