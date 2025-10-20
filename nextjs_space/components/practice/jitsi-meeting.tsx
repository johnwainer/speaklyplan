
"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  const [loadError, setLoadError] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!isOpen || !roomName) {
      console.log("Modal not open or no roomName:", { isOpen, roomName });
      return;
    }

    console.log("Initializing Jitsi with room:", roomName);

    // Load Jitsi Meet External API
    const loadJitsiScript = (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.JitsiMeetExternalAPI) {
          console.log("Jitsi script already loaded");
          scriptLoadedRef.current = true;
          resolve(true);
          return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector(
          'script[src="https://meet.jit.si/external_api.js"]'
        );
        if (existingScript) {
          console.log("Script is being loaded, waiting...");
          existingScript.addEventListener("load", () => {
            scriptLoadedRef.current = true;
            resolve(true);
          });
          existingScript.addEventListener("error", () => {
            reject(new Error("Failed to load Jitsi script"));
          });
          return;
        }

        console.log("Loading Jitsi script...");
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => {
          console.log("Jitsi script loaded successfully");
          scriptLoadedRef.current = true;
          resolve(true);
        };
        script.onerror = () => {
          console.error("Failed to load Jitsi script");
          reject(new Error("Failed to load Jitsi script"));
        };
        document.head.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        setIsLoading(true);
        setLoadError(false);

        // Load script
        await loadJitsiScript();

        // Wait a bit for the script to be fully ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!jitsiContainerRef.current) {
          console.error("Container ref not available");
          return;
        }

        // Clean up previous instance
        if (jitsiApiRef.current) {
          console.log("Disposing previous Jitsi instance");
          try {
            jitsiApiRef.current.dispose();
          } catch (e) {
            console.error("Error disposing previous instance:", e);
          }
          jitsiApiRef.current = null;
        }

        // Clear the container
        jitsiContainerRef.current.innerHTML = "";

        console.log("Creating Jitsi API instance...");
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
            subject: "Sesión de práctica SpeaklyPlan",
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            DEFAULT_REMOTE_DISPLAY_NAME: "Compañero",
            MOBILE_APP_PROMO: false,
            LANG_DETECTION: false,
            DEFAULT_LANGUAGE: "es",
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "closedcaptions",
              "desktop",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "chat",
              "recording",
              "livestreaming",
              "etherpad",
              "sharedvideo",
              "settings",
              "raisehand",
              "videoquality",
              "filmstrip",
              "feedback",
              "stats",
              "shortcuts",
              "tileview",
              "videobackgroundblur",
              "download",
              "help",
            ],
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;
        console.log("Jitsi API instance created");

        // Event listeners
        api.addListener("videoConferenceJoined", (event: any) => {
          console.log("Video conference joined:", event);
          setIsLoading(false);
          toast.success("¡Te has unido a la sesión!");
        });

        api.addListener("videoConferenceLeft", () => {
          console.log("Video conference left");
          handleMeetingEnd();
        });

        api.addListener("readyToClose", () => {
          console.log("Ready to close");
          handleMeetingEnd();
        });

        api.addListener("participantJoined", (event: any) => {
          console.log("Participant joined:", event);
        });

        api.addListener("errorOccurred", (error: any) => {
          console.error("Jitsi error:", error);
          if (error.error === "connection.connectionDroppedError") {
            toast.error("Se perdió la conexión");
          }
        });

        // Set a timeout to hide loading if it takes too long
        setTimeout(() => {
          if (isLoading) {
            console.log("Hiding loading indicator after timeout");
            setIsLoading(false);
          }
        }, 10000);
      } catch (error) {
        console.error("Error initializing Jitsi:", error);
        setLoadError(true);
        toast.error("Error al iniciar la videollamada. Por favor, intenta de nuevo.");
        setIsLoading(false);
      }
    };

    initializeJitsi();

    return () => {
      console.log("Cleaning up Jitsi component");
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          console.error("Error disposing Jitsi instance:", e);
        }
        jitsiApiRef.current = null;
      }
    };
  }, [isOpen, roomName, displayName]);

  const handleMeetingEnd = () => {
    console.log("Handling meeting end");
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (e) {
        console.error("Error disposing on meeting end:", e);
      }
      jitsiApiRef.current = null;
    }
    onMeetingEnd?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleMeetingEnd()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[90vh] p-0 border-0">
        <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
          {/* Loading overlay */}
          {isLoading && !loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 z-50">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-400 border-t-transparent mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-xl font-semibold">
                    Conectando a la sesión...
                  </p>
                  <p className="text-blue-300 text-sm">
                    Preparando tu sala de videollamada
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
              <div className="text-center space-y-4 p-8">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-white text-xl font-semibold">
                  Error al conectar
                </p>
                <p className="text-gray-300 text-sm max-w-md">
                  No se pudo establecer la conexión con la sala de videollamada.
                  Por favor, verifica tu conexión a internet e intenta de nuevo.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {/* Jitsi container */}
          <div
            ref={jitsiContainerRef}
            className="w-full h-full"
            id="jitsi-container"
          />

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full z-20 bg-black/50"
            onClick={handleMeetingEnd}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
