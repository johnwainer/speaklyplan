
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Volume2, BookOpen, Target, MessageSquare, Home, BarChart3, Languages, Menu, X, Mic, MicOff, Award, History, TrendingUp, Sparkles, RotateCcw, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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

const contextModes = [
  { value: 'casual', label: '💬 Conversación Casual', description: 'Charla amigable sobre trabajo e intereses' },
  { value: 'meeting', label: '🤝 Simulación de Reunión', description: 'Practica reuniones profesionales' },
  { value: 'interview', label: '👔 Entrevista de Trabajo', description: 'Prepárate para entrevistas' },
  { value: 'email', label: '📧 Práctica de Emails', description: 'Redacción profesional' },
  { value: 'grammar', label: '📝 Ejercicios de Gramática', description: 'Refuerza la gramática' }
];

export default function TutorClient({ initialData, userId }: TutorClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [context, setContext] = useState('casual');
  const [isRecording, setIsRecording] = useState(false);
  const [gamificationStats, setGamificationStats] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();
  const shouldAutoScroll = useRef(true);
  const { data: session, status } = useSession() || {};
  
  // Auto-scroll removed - users can scroll manually
  
  // Load gamification stats on mount
  useEffect(() => {
    loadGamificationStats();
    initSpeechRecognition();
    setSessionStartTime(new Date());
  }, []);
  
  // Update streak when component mounts
  useEffect(() => {
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
        toast.info('🎤 Listening...');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
          
        setInput(transcript);
        
        if (event.results[0].isFinal) {
          setIsRecording(false);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Error en reconocimiento de voz');
      };
      
      recognition.onend = () => {
        setIsRecording(false);
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
      recognitionRef.current.start();
    }
  };
  
  const endSessionAndAnalyze = async () => {
    if (!conversationId || messages.length < 2) return;
    
    try {
      toast.loading('Analizando sesión...');
      
      const response = await fetch('/api/tutor/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          sessionType: context
        })
      });
      
      if (response.ok) {
        const analytics = await response.json();
        setAnalytics(analytics);
        setShowAnalytics(true);
        
        // Check for achievements
        await checkAchievements(analytics);
        
        toast.success('¡Sesión analizada!');
      }
    } catch (error) {
      console.error('Error analyzing session:', error);
      toast.error('Error al analizar sesión');
    }
  };
  
  const checkAchievements = async (sessionAnalytics: any) => {
    try {
      const response = await fetch('/api/tutor/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_achievements',
          metrics: {
            streak: gamificationStats?.currentStreak,
            totalMessages: gamificationStats?.points ? Math.floor(gamificationStats.points / 5) : 0,
            totalSessions: sessionAnalytics ? 1 : 0,
            perfectGrammarSessions: sessionAnalytics?.grammarAccuracy >= 95 ? 1 : 0,
            vocabularyLearned: sessionAnalytics?.newWordsLearned?.length || 0
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.achievements && data.achievements.length > 0) {
          data.achievements.forEach((achievement: any) => {
            toast.success(`🏆 ¡Logro desbloqueado! ${achievement.achievement.name}`, {
              duration: 5000
            });
          });
          loadGamificationStats();
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };
  
  const loadConversationHistory = async () => {
    try {
      const response = await fetch('/api/tutor/history');
      if (response.ok) {
        const data = await response.json();
        setConversationHistory(data);
        setShowHistory(true);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Error al cargar historial');
    }
  };
  
  const loadConversation = async (convId: string) => {
    try {
      shouldAutoScroll.current = false; // Desactivar auto-scroll al cargar conversación
      const response = await fetch(`/api/tutor/history?conversationId=${convId}`);
      if (response.ok) {
        const conversation = await response.json();
        
        const loadedMessages: Message[] = conversation.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          translation: msg.translation,
          grammarFeedback: msg.grammarErrors,
          timestamp: new Date(msg.createdAt)
        }));
        
        setMessages(loadedMessages);
        setConversationId(conversation.id);
        setContext(conversation.context || 'casual');
        setShowHistory(false);
        
        toast.success('Conversación cargada');
        
        // Reactivar auto-scroll después de un delay
        setTimeout(() => {
          shouldAutoScroll.current = true;
        }, 500);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Error al cargar conversación');
      shouldAutoScroll.current = true;
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId,
          context,
          userId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: data.messageId,
        role: 'assistant',
        content: data.content,
        translation: data.translation,
        grammarFeedback: data.grammarFeedback,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(data.conversationId);
      
      // Award points for sending message
      await fetch('/api/tutor/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'award_points',
          points: 5,
          reason: 'Mensaje enviado'
        })
      });
      
      loadGamificationStats();
      
      // Mostrar feedback de gramática si hay
      if (data.grammarFeedback?.hasErrors) {
        toast.info(data.grammarFeedback.suggestion, {
          duration: 5000
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al comunicarse con el tutor. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Tu navegador no soporta síntesis de voz');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const changeContext = (newContext: string) => {
    shouldAutoScroll.current = false; // Desactivar auto-scroll al cambiar contexto
    setContext(newContext);
    setMessages([]);
    setConversationId(null);
    toast.success(`Modo cambiado: ${contextModes.find(m => m.value === newContext)?.label}`);
    
    // Reactivar auto-scroll después de un delay
    setTimeout(() => {
      shouldAutoScroll.current = true;
    }, 300);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Header - Same as Dashboard */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">SpeaklyPlan</h1>
              <p className="text-sm text-gray-600 hidden sm:block text-left">AI Tutor</p>
            </div>
          </Link>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {session?.user?.image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <User className="h-4 w-4" />
              )}
              <span>{session?.user?.name || session?.user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Menú del Tutor
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Gamification Stats */}
                {gamificationStats && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">TU PROGRESO</h4>
                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-lg">{gamificationStats.points}</span>
                          </div>
                          <Badge variant="secondary">
                            Nivel {gamificationStats.level}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Racha actual</span>
                          <span className="text-lg font-bold">🔥 {gamificationStats.currentStreak}</span>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setShowAchievements(true);
                            document.querySelector('[data-state="open"]')?.dispatchEvent(new Event('click'));
                          }}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Ver Logros ({gamificationStats.unlockedAchievements}/{gamificationStats.totalAchievements})
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
                
                {/* Actions */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">ACCIONES</h4>
                  <div className="space-y-2">
                    <Link href="/dashboard" className="block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        loadConversationHistory();
                        document.querySelector('[data-state="open"]')?.dispatchEvent(new Event('click'));
                      }}
                    >
                      <History className="h-4 w-4 mr-2" />
                      Ver Historial
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        endSessionAndAnalyze();
                        document.querySelector('[data-state="open"]')?.dispatchEvent(new Event('click'));
                      }}
                      disabled={!conversationId || messages.length < 2}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analizar Sesión
                    </Button>
                  </div>
                </div>
                
                {/* Context Modes */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">MODO DE PRÁCTICA</h4>
                  <div className="space-y-2">
                    {contextModes.map(mode => (
                      <Button
                        key={mode.value}
                        variant={context === mode.value ? 'default' : 'outline'}
                        className="w-full justify-start text-left h-auto py-3"
                        size="sm"
                        onClick={() => {
                          changeContext(mode.value);
                          document.querySelector('[data-state="open"]')?.dispatchEvent(new Event('click'));
                        }}
                      >
                        <div>
                          <div className="font-medium text-sm">{mode.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {mode.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      {/* Tutor-Specific Bar */}
      <div className="sticky top-16 z-40 w-full border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white text-blue-600">
                <MessageSquare className="h-3 w-3 mr-1" />
                AI Tutor
              </Badge>
              
              {/* Gamification Stats - Desktop */}
              {gamificationStats && (
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-bold">{gamificationStats.points}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-0 text-white">
                    Level {gamificationStats.level}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-0 text-white">
                    🔥 {gamificationStats.currentStreak}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowAchievements(true)}
                  >
                    <Award className="h-4 w-4 mr-1" />
                    {gamificationStats.unlockedAchievements}/{gamificationStats.totalAchievements}
                  </Button>
                </div>
              )}
              
              {/* Gamification Stats - Mobile (compact) */}
              {gamificationStats && (
                <div className="flex lg:hidden items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-0 text-white text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {gamificationStats.points}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-0 text-white text-xs">
                    🔥 {gamificationStats.currentStreak}
                  </Badge>
                </div>
              )}
            </div>
            
            <nav className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={loadConversationHistory}
              >
                <History className="h-4 w-4 mr-2" />
                Historial
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={endSessionAndAnalyze}
                disabled={!conversationId || messages.length < 2}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Análisis
              </Button>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Panel Lateral - Solo Desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Modo de Práctica
              </h3>
              
              <div className="space-y-2">
                {contextModes.map(mode => (
                  <Button
                    key={mode.value}
                    variant={context === mode.value ? 'default' : 'outline'}
                    className="w-full justify-start text-left h-auto py-3"
                    size="sm"
                    onClick={() => changeContext(mode.value)}
                  >
                    <div>
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {mode.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
            
            {/* Vocabulario de la semana */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Vocabulario de la Semana
              </h3>
              <div className="space-y-2 mb-3">
                {initialData.currentWeekVocab?.slice(0, 8).map(term => (
                  <div key={term.id} className="p-2 bg-blue-50 rounded-lg">
                    <p className="font-medium text-sm">{term.term}</p>
                    <p className="text-xs text-muted-foreground">{term.translation}</p>
                  </div>
                ))}
              </div>
              <Link href="/tutor/vocabulary-review">
                <Button variant="outline" size="sm" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sistema de Repaso
                </Button>
              </Link>
            </Card>
            
            {/* Estadísticas */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Tu Progreso</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nivel:</span>
                  <Badge>{initialData.learningContext.currentLevel}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversaciones:</span>
                  <span className="font-medium">{initialData.learningContext.totalConversations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mensajes:</span>
                  <span className="font-medium">{initialData.learningContext.totalMessages}</span>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Panel Principal: Chat */}
          <Card className="col-span-1 lg:col-span-3 flex flex-col h-[600px] lg:h-[calc(100vh-12rem)]">
            <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                English Tutor AI
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                {contextModes.find(m => m.value === context)?.description}
              </p>
            </div>
            
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="mb-4">
                      <MessageSquare className="h-16 w-16 mx-auto text-blue-200" />
                    </div>
                    <p className="text-lg mb-2 font-medium">👋 Hello! I'm your AI tutor.</p>
                    <p className="text-sm">Start a conversation in English, and I'll help you improve!</p>
                    <p className="text-xs mt-2">Try saying: "Hello, how are you?"</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {message.role === 'assistant' && (
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-3 text-xs hover:bg-blue-50"
                            onClick={() => speakText(message.content)}
                          >
                            <Volume2 className="h-3 w-3 mr-1" />
                            Escuchar
                          </Button>
                          
                          {message.translation && (
                            <div className="text-xs text-muted-foreground bg-blue-50 px-3 py-1 rounded-full">
                              📖 {message.translation}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {message.grammarFeedback?.hasErrors && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs font-medium text-yellow-900 mb-1">💡 Grammar Tip:</p>
                          <p className="text-xs text-yellow-800">{message.grammarFeedback.suggestion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-gray-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2 max-w-4xl mx-auto"
              >
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleRecording}
                  disabled={isLoading}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRecording ? "Listening..." : "Type or speak your message in English..."}
                  disabled={isLoading}
                  className="flex-1 bg-white"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-center text-muted-foreground mt-2">
                🎤 Habla o escribe • Enter para enviar
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Historial Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial de Conversaciones
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {conversationHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay conversaciones guardadas aún
              </p>
            ) : (
              conversationHistory.map((conv) => (
                <Card
                  key={conv.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => loadConversation(conv.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{conv.title || 'Conversación sin título'}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {conv.context && contextModes.find(m => m.value === conv.context)?.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {conv._count?.messages || 0} mensajes • {new Date(conv.lastMessageAt).toLocaleDateString('es-ES')}
                      </p>
                      {conv.messages?.[0] && (
                        <p className="text-sm mt-2 line-clamp-2">
                          {conv.messages[0].content}
                        </p>
                      )}
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
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análisis de Sesión
            </DialogTitle>
          </DialogHeader>
          {analytics && (
            <div className="space-y-4">
              {/* Overall Score */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Puntuación General</p>
                  <p className="text-5xl font-bold text-blue-600">
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
                  <div>
                    <p className="text-muted-foreground">Precisión gramatical</p>
                    <p className="font-medium">{analytics.grammarAccuracy?.toFixed(0) || 0}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Diversidad vocabulario</p>
                    <p className="font-medium">{analytics.vocabularyDiversity?.toFixed(0) || 0}%</p>
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
              
              {/* Feedback */}
              {analytics.feedback && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">💬 Retroalimentación</h4>
                  <p className="text-sm text-muted-foreground">{analytics.feedback}</p>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Achievements Dialog */}
      <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Logros y Progreso
            </DialogTitle>
          </DialogHeader>
          {gamificationStats && (
            <div className="space-y-4">
              {/* Level Progress */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Nivel Actual</p>
                  <p className="text-4xl font-bold text-purple-600">{gamificationStats.level}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{gamificationStats.levelProgress?.current || 0} puntos</span>
                    <span>{gamificationStats.levelProgress?.needed || 0} necesarios</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(gamificationStats.levelProgress?.percentage || 0, 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 text-center">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{gamificationStats.points}</p>
                  <p className="text-xs text-muted-foreground">Puntos</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold">🔥</p>
                  <p className="text-2xl font-bold">{gamificationStats.currentStreak}</p>
                  <p className="text-xs text-muted-foreground">Racha</p>
                </Card>
                <Card className="p-4 text-center">
                  <Award className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{gamificationStats.unlockedAchievements}</p>
                  <p className="text-xs text-muted-foreground">Logros</p>
                </Card>
              </div>
              
              {/* Unlocked Achievements */}
              <div>
                <h4 className="font-semibold mb-3">Logros Desbloqueados</h4>
                <div className="space-y-2">
                  {gamificationStats.achievements?.map((ua: any) => (
                    <Card key={ua.id} className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{ua.achievement.icon}</div>
                        <div className="flex-1">
                          <h5 className="font-medium">{ua.achievement.name}</h5>
                          <p className="text-xs text-muted-foreground">{ua.achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Desbloqueado: {new Date(ua.unlockedAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge variant="secondary">+{ua.achievement.points}</Badge>
                      </div>
                    </Card>
                  ))}
                  {(!gamificationStats.achievements || gamificationStats.achievements.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">
                      Aún no has desbloqueado logros. ¡Sigue practicando!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
