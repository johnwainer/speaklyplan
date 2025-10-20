
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Award, History, MessageSquare, Zap, Brain, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/app-header';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  grammarFeedback?: any;
  timestamp: Date;
}

interface TutorClientProps {
  initialData: {
    learningContext: any;
    recentConversations: any[];
    currentWeekVocab: any[];
    recentMistakes: any[];
  };
  userId: string;
}

export default function TutorClientV2({ initialData, userId }: TutorClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [gamificationStats, setGamificationStats] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const router = useRouter();
  const { data: session } = useSession() || {};
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Load initial data
  useEffect(() => {
    loadGamificationStats();
    initSpeechRecognition();
    setSessionStartTime(new Date());
    updateStreakOnServer();
  }, []);
  
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
  
  const updateStreakOnServer = async () => {
    try {
      await fetch('/api/tutor/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_streak' })
      });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };
  
  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsRecording(true);
        setConversationState('listening');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
          
        if (event.results[0].isFinal && transcript.trim()) {
          setIsRecording(false);
          setConversationState('processing');
          sendMessage(transcript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setConversationState('idle');
        toast.error('Error en reconocimiento de voz');
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        if (conversationState === 'listening') {
          setConversationState('idle');
        }
      };
      
      recognitionRef.current = recognition;
    }
  };
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Tu navegador no soporta reconocimiento de voz');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
    }
  };
  
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId,
          context: 'casual', // Always casual for fluid mode
          learningContext: initialData.learningContext
        })
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        translation: data.translation,
        grammarFeedback: data.grammarFeedback,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(data.conversationId);
      
      // Show grammar feedback if available
      if (data.grammarFeedback && data.grammarFeedback.errors?.length > 0) {
        setCurrentFeedback(data.grammarFeedback);
      }
      
      // Speak the response
      speakText(data.response);
      
      // Reload gamification stats
      await loadGamificationStats();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  };
  
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setConversationState('speaking');
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setConversationState('idle');
        // Auto-restart listening after AI finishes speaking
        setTimeout(() => {
          if (recognitionRef.current && !isRecording) {
            recognitionRef.current.start();
          }
        }, 500);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setConversationState('idle');
      };
      
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setConversationState('idle');
    }
  };
  
  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setCurrentFeedback(null);
    setSessionStartTime(new Date());
    toast.success('Nueva conversación iniciada');
  };
  
  const loadHistory = async () => {
    try {
      const response = await fetch('/api/tutor/history');
      if (response.ok) {
        const data = await response.json();
        setConversationHistory(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };
  
  const endSessionAndAnalyze = async () => {
    if (!conversationId || messages.length < 2) {
      toast.error('Necesitas tener al menos una conversación para obtener análisis');
      return;
    }
    
    try {
      const response = await fetch('/api/tutor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          duration: sessionStartTime ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000) : 0
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setShowStats(true);
        toast.success('¡Análisis completado!');
      }
    } catch (error) {
      console.error('Error analyzing session:', error);
      toast.error('Error al analizar la sesión');
    }
  };

  const getStateIcon = () => {
    switch (conversationState) {
      case 'listening':
        return <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}><Mic className="h-6 w-6 text-green-500" /></motion.div>;
      case 'processing':
        return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Brain className="h-6 w-6 text-blue-500" /></motion.div>;
      case 'speaking':
        return <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}><Volume2 className="h-6 w-6 text-purple-500" /></motion.div>;
      default:
        return <Sparkles className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStateText = () => {
    switch (conversationState) {
      case 'listening':
        return 'Escuchando...';
      case 'processing':
        return 'Procesando...';
      case 'speaking':
        return 'Hablando...';
      default:
        return 'Toca el micrófono para hablar';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <AppHeader 
        title="AI Tutor"
        subtitle="Conversación Fluida"
        currentView="/tutor"
      />
      
      {/* Secondary Action Bar */}
      <div className="bg-white/50 backdrop-blur-sm border-b py-3">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          {/* Gamification Stats */}
          {gamificationStats && (
            <div className="flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-bold">{gamificationStats.points}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <span className="text-sm font-bold">{gamificationStats.currentStreak}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold">Nivel {gamificationStats.level}</span>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { loadHistory(); setShowHistory(true); }}>
              <History className="h-4 w-4 mr-2" />
              Historial
            </Button>
            
            {conversationId && messages.length >= 2 && (
              <Button variant="outline" size="sm" onClick={endSessionAndAnalyze}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Análisis
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Conversation State Indicator */}
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
              {getStateIcon()}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{getStateText()}</p>
              {conversationState === 'idle' && messages.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Inicia una conversación natural en inglés. ¡Solo habla y te responderé!
                </p>
              )}
            </div>
          </div>
        </Card>
        
        {/* Grammar Feedback */}
        <AnimatePresence>
          {currentFeedback && currentFeedback.errors?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 flex items-center gap-2 mb-3">
                      <Target className="h-5 w-5" />
                      Correcciones de Gramática
                    </h4>
                    <div className="space-y-2">
                      {currentFeedback.errors.map((error: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <p className="text-red-600 line-through">{error.original}</p>
                          <p className="text-green-600 font-medium">→ {error.correction}</p>
                          {error.explanation && (
                            <p className="text-muted-foreground text-xs mt-1">{error.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentFeedback(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Messages */}
        {messages.length > 0 && (
          <Card className="p-4 bg-white/70 backdrop-blur-sm">
            <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.translation && (
                        <p className="text-xs mt-2 opacity-70">{message.translation}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}
        
        {/* Controls */}
        <Card className="p-6 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-4">
            {/* New Conversation */}
            {messages.length > 0 && (
              <Button
                variant="outline"
                onClick={startNewConversation}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Nueva
              </Button>
            )}
            
            {/* Main Mic Button */}
            <Button
              size="lg"
              onClick={toggleRecording}
              disabled={isLoading || isSpeaking}
              className={`h-20 w-20 rounded-full ${
                isRecording
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              }`}
            >
              {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
            
            {/* Stop Speaking */}
            {isSpeaking && (
              <Button
                variant="outline"
                onClick={toggleSpeech}
                className="gap-2"
              >
                <VolumeX className="h-4 w-4" />
                Detener
              </Button>
            )}
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-4">
            {isRecording ? 'Escuchando tu voz...' : isSpeaking ? 'El tutor está hablando...' : 'Presiona el micrófono y empieza a hablar'}
          </p>
        </Card>
      </div>
      
      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial de Conversaciones
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {conversationHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay conversaciones previas
              </p>
            ) : (
              conversationHistory.map((conv: any) => (
                <Card key={conv.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{conv.title || 'Sin título'}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(conv.lastMessageAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">{conv.isActive ? 'Activa' : 'Archivada'}</Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Analytics Dialog */}
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análisis de tu Sesión
            </DialogTitle>
          </DialogHeader>
          {analytics && (
            <div className="space-y-4">
              {/* Overall Score */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Puntuación General</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {analytics.overallScore?.toFixed(0) || 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">de 100</p>
                </div>
              </Card>
              
              {/* Detailed Scores */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Fluidez</p>
                  <p className="text-2xl font-bold">{analytics.fluencyScore?.toFixed(0) || 0}</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Precisión</p>
                  <p className="text-2xl font-bold">{analytics.accuracyScore?.toFixed(0) || 0}</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Comprensión</p>
                  <p className="text-2xl font-bold">{analytics.comprehensionScore?.toFixed(0) || 0}</p>
                </Card>
              </div>
              
              {/* Stats */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Estadísticas</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Duración</p>
                    <p className="font-medium">{Math.floor(analytics.duration / 60)} min {analytics.duration % 60} seg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mensajes</p>
                    <p className="font-medium">{analytics.messagesCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Palabras habladas</p>
                    <p className="font-medium">{analytics.wordsSpoken}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Palabras nuevas</p>
                    <p className="font-medium">{analytics.newWordsLearned?.length || 0}</p>
                  </div>
                </div>
              </Card>
              
              {/* Strengths */}
              {analytics.strengths && analytics.strengths.length > 0 && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <h4 className="font-semibold mb-2 text-green-900">✨ Fortalezas</h4>
                  <ul className="space-y-1">
                    {analytics.strengths.map((strength: string, i: number) => (
                      <li key={i} className="text-sm text-green-800">• {strength}</li>
                    ))}
                  </ul>
                </Card>
              )}
              
              {/* Areas to Improve */}
              {analytics.areasToImprove && analytics.areasToImprove.length > 0 && (
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <h4 className="font-semibold mb-2 text-yellow-900">🎯 Áreas de Mejora</h4>
                  <ul className="space-y-1">
                    {analytics.areasToImprove.map((area: string, i: number) => (
                      <li key={i} className="text-sm text-yellow-800">• {area}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
