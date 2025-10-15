

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, Mic, MicOff, Award, TrendingUp, Sparkles, 
  Zap, CheckCircle, AlertCircle, GraduationCap, Volume2, BookOpen, Languages,
  MessageSquare, User
} from 'lucide-react';
import { toast } from 'sonner';
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

interface VocabWord {
  term: string;
  translation: string;
  pronunciation?: string;
  attempts: number;
  mastered: boolean;
}

interface Message {
  type: 'user' | 'tutor';
  text: string;
  translation?: string;
  timestamp: Date;
  suggestedWords?: VocabWord[];
}

export default function TutorClient({ initialData, userId }: TutorClientProps) {
  // States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [gamificationStats, setGamificationStats] = useState<any>(null);
  const [suggestedVocab, setSuggestedVocab] = useState<VocabWord[]>([]);
  const [practiceWords, setPracticeWords] = useState<VocabWord[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Initialize on mount
  useEffect(() => {
    initVoiceSystem();
    loadGamificationStats();
    loadPracticeVocabulary();
    startInitialConversation();
    
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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
        toast.success('🎤 Escuchando...');
      };
      
      recognition.onresult = async (event: any) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        
        setTranscript(transcriptResult);
        
        // Si el resultado es final, procesar
        if (event.results[current].isFinal) {
          await handleVoiceInput(transcriptResult);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          toast.info('No speech detected. Try speaking again.');
        } else {
          toast.error('Voice recognition error. Please try again.');
        }
      };
      
      recognition.onend = () => {
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
      
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices();
        if (voices && voices.length > 0) {
          console.log('Voices loaded:', voices.length);
        }
      };
      
      loadVoices();
      
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
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
  
  const loadPracticeVocabulary = async () => {
    try {
      const response = await fetch('/api/tutor/practice-vocabulary');
      if (response.ok) {
        const data = await response.json();
        setPracticeWords(data.words || []);
      }
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    }
  };
  
  const startInitialConversation = async () => {
    // Mensaje de bienvenida del tutor
    const welcomeMessage: Message = {
      type: 'tutor',
      text: "Hi! I'm your English tutor. Tell me, what would you like to talk about today?",
      translation: "¡Hola! Soy tu tutor de inglés. Dime, ¿de qué te gustaría hablar hoy?",
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Hablar el mensaje
    await speakText(welcomeMessage.text);
  };
  
  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in your browser');
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error('Failed to start recognition:', e);
      toast.error('Error starting voice recognition');
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
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      type: 'user',
      text: transcriptText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setIsAnalyzing(true);
    
    try {
      // Obtener respuesta del tutor con traducción y vocabulario sugerido
      const response = await fetch('/api/tutor/voice/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: transcriptText,
          conversationHistory: messages.slice(-6), // Últimos 6 mensajes para contexto
          practiceWords: practiceWords
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get tutor response');
      }
      
      const data = await response.json();
      
      // Agregar respuesta del tutor
      const tutorMessage: Message = {
        type: 'tutor',
        text: data.response,
        translation: data.translation,
        timestamp: new Date(),
        suggestedWords: data.suggestedWords
      };
      
      setMessages(prev => [...prev, tutorMessage]);
      setIsAnalyzing(false);
      
      // Actualizar vocabulario sugerido si hay
      if (data.suggestedWords && data.suggestedWords.length > 0) {
        setSuggestedVocab(data.suggestedWords);
      }
      
      // Hablar la respuesta
      await speakText(data.response);
      
      // Gamificación en background
      fetch('/api/tutor/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'award_points',
          points: 10,
          reason: 'Conversación con el tutor'
        })
      }).then(() => loadGamificationStats())
        .catch(err => console.log('Gamification error:', err));
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Error al procesar tu mensaje');
      setIsAnalyzing(false);
      
      // Agregar respuesta de fallback
      const fallbackMessage: Message = {
        type: 'tutor',
        text: "I see. Could you tell me more about that?",
        translation: "Ya veo. ¿Podrías contarme más sobre eso?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      await speakText(fallbackMessage.text);
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
      
      // Buscar la mejor voz en inglés
      const voices = synthRef.current.getVoices();
      
      const preferredVoiceNames = [
        'Google US English',
        'Google UK English Female',
        'Microsoft Zira - English (United States)',
        'Samantha',
        'Alex'
      ];
      
      let selectedVoice = null;
      
      for (const name of preferredVoiceNames) {
        selectedVoice = voices.find(v => v.name.includes(name));
        if (selectedVoice) break;
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.lang.startsWith('en') && !v.localService
        ) || voices.find(v => v.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
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
  
  const resetConversation = () => {
    stopListening();
    stopSpeaking();
    setMessages([]);
    setSuggestedVocab([]);
    startInitialConversation();
    toast.success('Conversación reiniciada');
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
                AI Conversation Tutor
              </Badge>
              
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Tutor de IA
              </h1>
              <p className="text-muted-foreground">
                Habla en inglés y recibe traducción simultánea al español
              </p>
            </div>
            <Button
              variant="outline"
              onClick={resetConversation}
              disabled={isListening || isSpeaking}
            >
              Reiniciar
            </Button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Conversation Area */}
          <div className="space-y-6">
            {/* Voice Control Card */}
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
                    {!isListening && !isSpeaking && 'Listo para Conversar'}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {isListening && 'Habla en inglés'}
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
                    Procesando tu mensaje...
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
                  💡 Tip: Habla claramente en inglés. Recibirás traducción simultánea al español.
                </p>
              </div>
            </Card>
            
            {/* Conversation History */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Historial de Conversación</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>La conversación comenzará cuando hagas clic en "Empezar a Hablar"</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, i) => (
                      <div key={i} className={cn(
                        "p-4 rounded-lg transition-all",
                        message.type === 'user' 
                          ? "bg-blue-50 border border-blue-200" 
                          : "bg-green-50 border border-green-200"
                      )}>
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            message.type === 'user' ? "bg-blue-600" : "bg-green-600"
                          )}>
                            {message.type === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <GraduationCap className="h-4 w-4 text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              {message.type === 'user' ? 'Tú' : 'Tutor IA'}
                            </p>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            
                            {/* Traducción al español */}
                            {message.translation && (
                              <div className="flex items-start gap-2 mt-2 p-2 bg-white/50 rounded border border-gray-200">
                                <Languages className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-700 italic">{message.translation}</p>
                              </div>
                            )}
                            
                            {/* Palabras sugeridas para practicar */}
                            {message.suggestedWords && message.suggestedWords.length > 0 && (
                              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-xs font-medium text-yellow-900 mb-2 flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  Palabras de tu vocabulario para practicar:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {message.suggestedWords.map((word, wi) => (
                                    <Badge 
                                      key={wi} 
                                      variant="outline" 
                                      className="bg-white text-xs"
                                      title={word.translation}
                                    >
                                      {word.term}
                                      {word.pronunciation && ` [${word.pronunciation}]`}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-4">
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
            
            {/* Vocabulario para Practicar */}
            {practiceWords.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Vocabulario para Practicar
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {practiceWords.slice(0, 10).map((word, i) => (
                    <div key={i} className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900">{word.term}</p>
                          {word.pronunciation && (
                            <p className="text-xs text-blue-600">[{word.pronunciation}]</p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">{word.translation}</p>
                        </div>
                        {!word.mastered && (
                          <Badge variant="outline" className="text-xs">
                            {word.attempts} intentos
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Vocabulario Sugerido en Conversación */}
            {suggestedVocab.length > 0 && (
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Palabras Sugeridas
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  El tutor está incluyendo estas palabras en la conversación para ayudarte a practicar:
                </p>
                <div className="space-y-2">
                  {suggestedVocab.map((word, i) => (
                    <div key={i} className="p-2 bg-white rounded-lg border border-yellow-200">
                      <p className="text-sm font-medium">{word.term}</p>
                      <p className="text-xs text-gray-600">{word.translation}</p>
                    </div>
                  ))}
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

