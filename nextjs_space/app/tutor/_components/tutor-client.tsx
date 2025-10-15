
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Send, Volume2, BookOpen, Target, MessageSquare, Home, BarChart3, 
  Languages, Menu, X, Mic, MicOff, Award, History, TrendingUp, Sparkles, 
  RotateCcw, User, Star, Radio, Zap, CheckCircle, AlertCircle, Info 
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getProfileImageUrl } from '@/lib/utils';
import { AppHeader } from '@/components/app-header';
import { cn } from '@/lib/utils';

interface TutorClientProps {
  initialData: {
    learningContext: any;
    recentConversations: any[];
    currentWeekVocab: any[];
    recentMistakes: any[];
  };
  userId: string;
}

const contextModes = [
  { value: 'casual', label: '💬 Conversación Casual', description: 'Charla amigable sobre trabajo e intereses', icon: MessageSquare },
  { value: 'meeting', label: '🤝 Simulación de Reunión', description: 'Practica reuniones profesionales', icon: Target },
  { value: 'interview', label: '👔 Entrevista de Trabajo', description: 'Prepárate para entrevistas', icon: User },
  { value: 'email', label: '📧 Práctica de Emails', description: 'Redacción profesional', icon: Send },
  { value: 'grammar', label: '📝 Ejercicios de Gramática', description: 'Refuerza la gramática', icon: BookOpen }
];

export default function TutorClient({ initialData, userId }: TutorClientProps) {
  // States
  const [context, setContext] = useState('casual');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [tutorResponse, setTutorResponse] = useState('');
  const [sessionStats, setSessionStats] = useState({
    pronunciation: 0,
    fluency: 0,
    accent: 0
  });
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [gamificationStats, setGamificationStats] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession() || {};
  
  // Initialize on mount
  useEffect(() => {
    initVoiceSystem();
    loadGamificationStats();
    setSessionStartTime(new Date());
    
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);
  
  const initVoiceSystem = () => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast.success('🎤 Escuchando... ¡Habla naturalmente!');
      };
      
      recognition.onresult = async (event: any) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        
        setTranscript(transcriptResult);
        
        // Si el resultado es final, analizar
        if (event.results[current].isFinal) {
          await handleVoiceInput(transcriptResult);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          toast.info('No se detectó voz. Intenta hablar de nuevo.');
        } else {
          toast.error('Error de reconocimiento de voz. Inténtalo de nuevo.');
        }
      };
      
      recognition.onend = () => {
        // Si todavía debería estar escuchando, reiniciar
        if (isListening) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition restart failed:', e);
            }
          }, 100);
        }
      };
      
      recognitionRef.current = recognition;
    }
    
    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  };
  
  const loadGamificationStats = async () => {
    try {
      const response = await fetch('/api/tutor/gamification');
      if (response.ok) {
        const data = await response.json();
        setGamificationStats(data);
      }
    } catch (error) {
      console.error('Error loading gamification stats:', error);
    }
  };
  
  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Reconocimiento de voz no soportado en tu navegador');
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error('Failed to start recognition:', e);
      toast.error('Error al iniciar reconocimiento de voz');
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  const handleVoiceInput = async (transcriptText: string) => {
    if (!transcriptText.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // 1. Analizar la pronunciación
      const analysisResponse = await fetch('/api/tutor/voice/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptText,
          context
        })
      });
      
      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }
      
      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData.analysis);
      
      // Actualizar estadísticas de sesión
      setSessionStats({
        pronunciation: analysisData.analysis.pronunciationScore,
        fluency: analysisData.analysis.fluencyScore,
        accent: analysisData.analysis.accentScore.overall
      });
      
      // 2. Generar respuesta del tutor con contexto
      const responseData = await fetch('/api/tutor/voice/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptText,
          analysisResult: analysisData.analysis,
          conversationContext: {
            mode: context,
            history: conversationHistory
          }
        })
      });
      
      if (!responseData.ok) {
        throw new Error('Response generation failed');
      }
      
      const response = await responseData.json();
      setTutorResponse(response.text);
      
      // 3. Hablar la respuesta
      await speakText(response.text);
      
      // 4. Agregar a historial
      setConversationHistory(prev => [
        ...prev,
        {
          type: 'user',
          text: transcriptText,
          analysis: analysisData.analysis
        },
        {
          type: 'tutor',
          text: response.text
        }
      ]);
      
      // 5. Gamificación - Award points
      await fetch('/api/tutor/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'award_points',
          points: 10,
          reason: 'Práctica de conversación'
        })
      });
      
      loadGamificationStats();
      
      // 6. Mostrar feedback si hay errores críticos
      if (analysisData.analysis.phonemeErrors.length > 0) {
        const criticalErrors = analysisData.analysis.phonemeErrors.filter((e: any) => e.severity === 'high');
        if (criticalErrors.length > 0) {
          toast.info(`💡 Tip de pronunciación: ${criticalErrors[0].suggestion}`, {
            duration: 5000
          });
        }
      }
      
      // Limpiar transcript
      setTranscript('');
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Error al procesar entrada de voz');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const speakText = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synthRef.current) {
        resolve();
        return;
      }
      
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice for English
      const voices = synthRef.current.getVoices();
      const targetVoice = voices.find(v => v.lang.startsWith('en'));
      
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      synthRef.current.speak(utterance);
    });
  };
  
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };
  
  const toggleConversation = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const changeContext = (newContext: string) => {
    setContext(newContext);
    setConversationHistory([]);
    setAnalysis(null);
    setSessionStats({ pronunciation: 0, fluency: 0, accent: 0 });
    stopListening();
    toast.success(`Modo cambiado: ${contextModes.find(m => m.value === newContext)?.label}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AppHeader currentSection="tutor" />
      
      {/* Tutor-Specific Bar */}
      <div className="sticky top-16 z-40 w-full border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Badge variant="secondary" className="bg-white text-blue-600 text-xs sm:text-sm">
                <Mic className="h-3 w-3 mr-1" />
                AI Voice Tutor
              </Badge>
              
              {/* Gamification Stats - Desktop */}
              {gamificationStats && (
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-bold">{gamificationStats.points}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <Award className="h-4 w-4" />
                    <span className="font-bold">Nivel {gamificationStats.level}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white hover:bg-white/20"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header with Mode Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Práctica de Conversación con IA
              </h1>
              <p className="text-muted-foreground">
                Habla naturalmente y recibe análisis instantáneo de pronunciación
              </p>
            </div>
          </div>
          
          {/* Mode Selector */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-sm">Selecciona el modo de práctica:</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {contextModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.value}
                    variant={context === mode.value ? 'default' : 'outline'}
                    className="h-auto py-3 flex flex-col items-center text-center"
                    onClick={() => changeContext(mode.value)}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{mode.label.slice(2)}</span>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Voice Conversation */}
          <div className="space-y-6">
            {/* Main Conversation Card */}
            <Card className={cn(
              "p-6 transition-all duration-300",
              isListening && "ring-4 ring-blue-500 ring-opacity-50 shadow-lg",
              isSpeaking && "ring-4 ring-green-500 ring-opacity-50 shadow-lg"
            )}>
              <div className="flex flex-col items-center space-y-6">
                {/* Status Indicator */}
                <div className="text-center">
                  <div className={cn(
                    "w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300",
                    isListening && "bg-blue-100 animate-pulse",
                    isSpeaking && "bg-green-100 animate-pulse",
                    !isListening && !isSpeaking && "bg-gray-100"
                  )}>
                    {isListening && <Mic className="h-16 w-16 text-blue-600" />}
                    {isSpeaking && <Volume2 className="h-16 w-16 text-green-600" />}
                    {!isListening && !isSpeaking && <Mic className="h-16 w-16 text-gray-400" />}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">
                    {isListening && 'Escuchando...'}
                    {isSpeaking && 'Tutor Hablando...'}
                    {!isListening && !isSpeaking && 'Listo para Practicar'}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {isListening && 'Habla naturalmente en inglés'}
                    {isSpeaking && 'Escucha la respuesta del tutor'}
                    {!isListening && !isSpeaking && 'Haz clic en el botón para comenzar'}
                  </p>
                </div>
                
                {/* Live Transcript */}
                {transcript && (
                  <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <span className="font-medium">Tú: </span>
                      {transcript}
                    </p>
                  </div>
                )}
                
                {/* Analyzing Indicator */}
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 animate-pulse" />
                    Analizando tu pronunciación...
                  </div>
                )}
                
                {/* Control Button */}
                <Button
                  size="lg"
                  onClick={toggleConversation}
                  disabled={isSpeaking || isAnalyzing}
                  className={cn(
                    "w-48 h-14 text-lg font-semibold transition-all duration-300",
                    isListening 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-5 w-5 mr-2" />
                      Detener
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Empezar a Hablar
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  💡 Tip: Habla claramente y naturalmente. El AI analizará tu pronunciación en tiempo real.
                </p>
              </div>
            </Card>
            
            {/* Latest Analysis Feedback */}
            {analysis && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Análisis Más Reciente
                </h3>
                
                <div className="space-y-3">
                  {/* Strengths */}
                  {analysis.accentScore?.strengths?.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">Fortalezas</p>
                        <ul className="text-sm text-green-800 mt-1 space-y-1">
                          {analysis.accentScore.strengths.map((strength: string, i: number) => (
                            <li key={i}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {analysis.suggestions?.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">Sugerencias</p>
                        <ul className="text-sm text-blue-800 mt-1 space-y-1">
                          {analysis.suggestions.slice(0, 3).map((suggestion: string, i: number) => (
                            <li key={i}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Problem Phonemes */}
                  {analysis.accentScore?.problemPhonemes?.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900">Sonidos para Practicar</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {analysis.accentScore.problemPhonemes.map((phoneme: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-white">
                              {phoneme}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
            
            {/* Conversation History */}
            {conversationHistory.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Historial de Conversación</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {conversationHistory.slice().reverse().slice(0, 8).map((entry, i) => (
                    <div key={i} className={cn(
                      "p-3 rounded-lg",
                      entry.type === 'user' ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
                    )}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {entry.type === 'user' ? 'Tú' : 'Tutor'}
                      </p>
                      <p className="text-sm">{entry.text}</p>
                      {entry.analysis && (
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Pronunciación: {entry.analysis.pronunciationScore.toFixed(0)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Fluidez: {entry.analysis.fluencyScore.toFixed(0)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          {/* Sidebar - Stats */}
          <div className="space-y-4">
            {/* Session Statistics */}
            {(sessionStats.pronunciation > 0 || sessionStats.fluency > 0 || sessionStats.accent > 0) && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Estadísticas de Sesión
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Pronunciación</span>
                      <span className="text-xs font-bold text-blue-600">{sessionStats.pronunciation.toFixed(0)}/100</span>
                    </div>
                    <Progress value={sessionStats.pronunciation} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Fluidez</span>
                      <span className="text-xs font-bold text-green-600">{sessionStats.fluency.toFixed(0)}/100</span>
                    </div>
                    <Progress value={sessionStats.fluency} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Similitud de Acento</span>
                      <span className="text-xs font-bold text-purple-600">{sessionStats.accent.toFixed(0)}/100</span>
                    </div>
                    <Progress value={sessionStats.accent} className="h-2" />
                  </div>
                </div>
              </Card>
            )}
            
            {/* Gamification Card */}
            {gamificationStats && (
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <h3 className="font-semibold mb-3 text-sm">Tu Progreso</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Nivel</span>
                    <span className="font-bold text-blue-600">{gamificationStats.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Puntos XP</span>
                    <span className="font-bold text-purple-600">{gamificationStats.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Racha</span>
                    <span className="font-bold text-orange-600">{gamificationStats.currentStreak} días</span>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Quick Links */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Enlaces Rápidos</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => router.push('/vocabulario')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Vocabulario
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => router.push('/recursos')}
                >
                  <Languages className="h-4 w-4 mr-2" />
                  Recursos
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
