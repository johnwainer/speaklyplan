

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
  MessageSquare, User, ChevronDown, ChevronUp, TrendingDown, PlayCircle, PauseCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { AppHeader } from '@/components/app-header';
import { SectionNavigator } from '@/components/section-navigator';
import { cn } from '@/lib/utils';
import { AnalysisPanel } from './analysis-panel';

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

interface GrammarAnalysis {
  errors: any[];
  feedback: {
    hasErrors: boolean;
    suggestion: string;
    accuracyScore: number;
  };
}

interface PronunciationAnalysis {
  pronunciationScore: number;
  fluencyScore: number;
  phonemeErrors: any[];
  strengths: string[];
  areasToImprove: string[];
  suggestions: string[];
  suggestionsSpanish?: string[];
  overallFeedback: string;
  overallFeedbackSpanish?: string;
}

interface Message {
  type: 'user' | 'tutor';
  text: string;
  translation?: string;
  timestamp: Date;
  suggestedWords?: VocabWord[];
  grammarAnalysis?: GrammarAnalysis | null;
  pronunciationAnalysis?: PronunciationAnalysis | null;
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
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    grammar: GrammarAnalysis | null;
    pronunciation: PronunciationAnalysis | null;
  }>({ grammar: null, pronunciation: null });
  
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
        
        // Solo mostrar el transcript cuando es final, no los resultados intermedios
        if (event.results[current].isFinal) {
          setTranscript(transcriptResult);
          await handleVoiceInput(transcriptResult);
        } else {
          // Opcionalmente, mostrar el texto intermedio pero en tiempo real (sin saltos)
          setTranscript(transcriptResult);
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
      
      // Force load voices
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        console.log('🔊 Voces cargadas:', voices.length);
        if (voices.length > 0) {
          console.log('✅ Voces disponibles:', voices.slice(0, 5).map(v => `${v.name} (${v.lang})`));
        }
        return voices;
      };
      
      // Load voices immediately
      loadVoices();
      
      // Set up listener for when voices change
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      
      // Reset synthesis state
      synthRef.current.cancel();
      
      // CRITICAL: Enable audio context with user interaction
      // This ensures audio will work when called later
      const enableAudio = () => {
        if (synthRef.current && synthRef.current.getVoices().length > 0) {
          console.log('🔊 Sistema de audio activado por interacción del usuario');
          // Remove listener after first activation
          document.removeEventListener('click', enableAudio);
          document.removeEventListener('touchstart', enableAudio);
        }
      };
      
      document.addEventListener('click', enableAudio, { once: true });
      document.addEventListener('touchstart', enableAudio, { once: true });
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
    // Wait for the speech system to be ready
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mensaje de bienvenida del tutor
    const welcomeMessage: Message = {
      type: 'tutor',
      text: "Hi! I'm your English tutor. Tell me, what would you like to talk about today?",
      translation: "¡Hola! Soy tu tutor de inglés. Dime, ¿de qué te gustaría hablar hoy?",
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Show prominent notification about audio
    toast.info('🔊 El tutor está listo. Si no escuchas el audio, haz clic en el ícono 🔊 junto al mensaje', {
      duration: 5000
    });
    
    // Try to speak with a delay to ensure voices are loaded
    setTimeout(async () => {
      console.log('🎬 Iniciando mensaje de bienvenida');
      await speakText(welcomeMessage.text);
    }, 300);
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
      
      // Actualizar análisis actual
      if (data.grammarAnalysis || data.pronunciationAnalysis) {
        setCurrentAnalysis({
          grammar: data.grammarAnalysis,
          pronunciation: data.pronunciationAnalysis
        });
      }
      
      // Agregar respuesta del tutor con análisis
      const tutorMessage: Message = {
        type: 'tutor',
        text: data.response,
        translation: data.translation,
        timestamp: new Date(),
        suggestedWords: data.suggestedWords,
        grammarAnalysis: data.grammarAnalysis,
        pronunciationAnalysis: data.pronunciationAnalysis
      };
      
      setMessages(prev => [...prev, tutorMessage]);
      setIsAnalyzing(false);
      
      // Actualizar vocabulario sugerido si hay
      if (data.suggestedWords && data.suggestedWords.length > 0) {
        setSuggestedVocab(data.suggestedWords);
      }
      
      // Mostrar toast con resumen del análisis
      if (data.pronunciationAnalysis && data.pronunciationAnalysis.pronunciationScore < 80) {
        toast.info(`💡 Score de pronunciación: ${data.pronunciationAnalysis.pronunciationScore}/100`);
      }
      if (data.grammarAnalysis && data.grammarAnalysis.errors.length > 0) {
        toast.info(`📝 Se detectaron ${data.grammarAnalysis.errors.length} error(es) gramatical(es)`);
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
        console.error('❌ Speech synthesis not available');
        toast.error('Sistema de voz no disponible en tu navegador');
        resolve();
        return;
      }
      
      console.log('🔊 Intentando reproducir:', text.substring(0, 50) + '...');
      
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      // Wait a bit to ensure cancellation is complete
      setTimeout(() => {
        if (!synthRef.current) {
          resolve();
          return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get all available voices
        const voices = synthRef.current.getVoices();
        console.log('🔊 Voces disponibles:', voices.length);
        
        if (voices.length === 0) {
          console.warn('⚠️ No hay voces cargadas todavía, esperando...');
          // Try again after a short delay
          setTimeout(() => speakText(text), 200);
          resolve();
          return;
        }
        
        // Try to find the best English voice
        const preferredVoiceNames = [
          'Google US English',
          'Google UK English Female', 
          'Google UK English Male',
          'Microsoft Zira',
          'Microsoft David',
          'Samantha',
          'Alex',
          'Karen',
          'Daniel'
        ];
        
        let selectedVoice = null;
        
        // First, try preferred voices
        for (const name of preferredVoiceNames) {
          selectedVoice = voices.find(v => v.name.includes(name));
          if (selectedVoice) {
            console.log('✅ Voz seleccionada (preferida):', selectedVoice.name);
            break;
          }
        }
        
        // If no preferred voice, find any English voice (prefer non-local)
        if (!selectedVoice) {
          selectedVoice = voices.find(v => 
            v.lang.startsWith('en') && !v.localService
          );
          if (selectedVoice) {
            console.log('✅ Voz seleccionada (inglés remoto):', selectedVoice.name);
          }
        }
        
        // If still no voice, find any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en'));
          if (selectedVoice) {
            console.log('✅ Voz seleccionada (inglés local):', selectedVoice.name);
          }
        }
        
        // Last resort: use first available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
          console.log('⚠️ Usando voz por defecto:', selectedVoice.name);
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else {
          console.error('❌ No se pudo seleccionar una voz');
        }
        
        // Set speech parameters
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // Slightly slower for better clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onstart = () => {
          console.log('▶️ Audio iniciado');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('✅ Audio completado');
          setIsSpeaking(false);
          resolve();
        };
        
        utterance.onerror = (event) => {
          console.error('❌ Error de audio:', event.error);
          
          // Show user-friendly error
          if (event.error === 'not-allowed') {
            toast.error('Permiso de audio denegado. Haz clic en el ícono 🔊 para escuchar.');
          } else if (event.error === 'network') {
            toast.error('Error de red. Verifica tu conexión.');
          } else {
            toast.error('Error reproduciendo audio. Intenta de nuevo.');
          }
          
          setIsSpeaking(false);
          resolve();
        };
        
        // Speak the text
        try {
          synthRef.current.speak(utterance);
          console.log('🎵 Audio en cola de reproducción');
        } catch (error) {
          console.error('❌ Error al encolar audio:', error);
          toast.error('Error al reproducir audio');
          setIsSpeaking(false);
          resolve();
        }
      }, 100); // Increased delay for better reliability
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <AppHeader currentSection="tutor" />
      
      {/* Section Navigator */}
      <SectionNavigator 
        currentSection="tutor"
        rightActions={
          <div className="flex items-center gap-2">
            <Button
              variant={showAnalysis ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowAnalysis(!showAnalysis)}
              className={cn(
                "h-8 text-xs transition-all",
                showAnalysis && "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              )}
            >
              {showAnalysis ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              Análisis
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetConversation}
              disabled={isListening || isSpeaking}
              className="h-8 text-xs"
            >
              Reiniciar
            </Button>
          </div>
        }
      />

      {/* Status Header */}
      <div className="border-b bg-white/90 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                isListening && "bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse",
                isSpeaking && "bg-gradient-to-r from-green-500 to-green-600 animate-pulse",
                !isListening && !isSpeaking && "bg-gradient-to-r from-indigo-500 to-purple-600"
              )}>
                {isListening && <Mic className="h-4 w-4 text-white" />}
                {isSpeaking && <Volume2 className="h-4 w-4 text-white" />}
                {!isListening && !isSpeaking && <GraduationCap className="h-4 w-4 text-white" />}
              </div>
              
              <div className="hidden sm:block">
                <h2 className="text-xs font-bold text-gray-900">
                  {isListening && '🎤 Escuchando...'}
                  {isSpeaking && '🔊 Tutor hablando...'}
                  {!isListening && !isSpeaking && 'Tutor de IA'}
                </h2>
                <p className="text-[10px] text-gray-500">
                  {isListening && 'Habla en inglés'}
                  {isSpeaking && 'Escucha el audio del tutor 🔊'}
                  {!isListening && !isSpeaking && 'Conversación en inglés'}
                </p>
              </div>
              
              {gamificationStats && (
                <div className="hidden lg:flex items-center gap-1.5 ml-3">
                  <Badge variant="secondary" className="gap-1 text-[10px] px-2 py-0.5">
                    <Award className="h-3 w-3 text-purple-600" />
                    Nivel {gamificationStats.level}
                  </Badge>
                  <Badge variant="secondary" className="gap-1 text-[10px] px-2 py-0.5">
                    <Sparkles className="h-3 w-3 text-orange-600" />
                    {gamificationStats.points} XP
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
        <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-4 lg:gap-6">
          {/* Main Chat Area - Modern Messenger Style */}
          <div className="flex flex-col">
            {/* Chat Container */}
            <Card className="flex flex-col border-2 shadow-lg" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50/50 to-white" style={{ minHeight: '300px' }}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      ¡Listo para practicar!
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-sm">
                      Presiona el botón del micrófono para empezar a hablar en inglés
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 duration-300",
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {/* Avatar */}
                        {message.type === 'tutor' && (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                          </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div className={cn(
                          "max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm",
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                        )}>
                          <div className="flex items-start gap-2">
                            <p className="text-xs sm:text-sm leading-relaxed break-words flex-1">{message.text}</p>
                            {/* Play Audio Button for Tutor Messages */}
                            {message.type === 'tutor' && (
                              <button
                                onClick={() => speakText(message.text)}
                                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                title="Escuchar este mensaje"
                              >
                                <Volume2 className="h-3.5 w-3.5 text-green-600" />
                              </button>
                            )}
                          </div>
                          
                          {/* Translation */}
                          {message.translation && (
                            <div className={cn(
                              "mt-2 pt-2 border-t flex items-start gap-2 text-xs",
                              message.type === 'user' 
                                ? 'border-blue-400/30 text-blue-50'
                                : 'border-gray-200 text-gray-600'
                            )}>
                              <Languages className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              <p className="italic">{message.translation}</p>
                            </div>
                          )}
                          
                          {/* Suggested Words */}
                          {message.suggestedWords && message.suggestedWords.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-yellow-200 bg-yellow-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded-b-2xl">
                              <p className="text-xs font-medium text-yellow-900 mb-1.5 flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                Vocabulario para practicar:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {message.suggestedWords.map((word, wi) => (
                                  <Badge 
                                    key={wi} 
                                    variant="outline" 
                                    className="bg-white text-xs py-0.5 px-2"
                                    title={word.translation}
                                  >
                                    {word.term}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* User Avatar */}
                        {message.type === 'user' && (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              
              {/* Input Area */}
              <div className="border-t bg-white p-3 sm:p-4">
                {/* Speaking Indicator - MOST PROMINENT */}
                {isSpeaking && (
                  <div className="mb-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl shadow-lg animate-pulse">
                    <p className="text-sm sm:text-base text-green-900 font-semibold flex items-center gap-2">
                      <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 animate-pulse text-green-600" />
                      <span>🔊 El tutor está hablando. Escucha el audio...</span>
                    </p>
                  </div>
                )}
                
                {/* Live Transcript */}
                {transcript && !isSpeaking && (
                  <div className="mb-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs sm:text-sm text-blue-900 flex items-center gap-2">
                      <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 animate-pulse" />
                      <span className="flex-1 leading-relaxed">{transcript}</span>
                    </p>
                  </div>
                )}
                
                {/* Analyzing Indicator */}
                {isAnalyzing && !isSpeaking && (
                  <div className="mb-3 p-2 sm:p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <p className="text-xs sm:text-sm text-purple-900 flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
                      <span>Analizando tu mensaje...</span>
                    </p>
                  </div>
                )}
                
                {/* Control Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    size="lg"
                    onClick={toggleConversation}
                    disabled={isSpeaking || isAnalyzing}
                    className={cn(
                      "flex-1 h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 shadow-lg",
                      isListening 
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    )}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Detener
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        {isSpeaking ? 'Escuchando...' : 'Hablar'}
                      </>
                    )}
                  </Button>
                  
                  {isSpeaking && (
                    <Button
                      size="lg"
                      onClick={stopSpeaking}
                      className="h-12 sm:h-14 px-4 sm:px-6 rounded-xl bg-orange-500 hover:bg-orange-600"
                    >
                      <PauseCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  )}
                </div>
                
                <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-2">
                  💡 Habla claramente en inglés para recibir análisis en tiempo real
                </p>
              </div>
            </Card>
            
            {/* Analysis Panel - Mobile/Desktop */}
            <div className="mt-4">
              <AnalysisPanel
                grammarAnalysis={currentAnalysis.grammar}
                pronunciationAnalysis={currentAnalysis.pronunciation}
                isVisible={showAnalysis}
              />
            </div>
          </div>
          
          {/* Sidebar - Stats & Info */}
          <div className="space-y-3 sm:space-y-4 lg:block hidden">
            {/* Gamification Stats */}
            {gamificationStats && (
              <Card className="p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-purple-900">Tu Progreso</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-gray-700">Nivel</span>
                    </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                      {gamificationStats.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-xs text-gray-700">Puntos XP</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      {gamificationStats.points}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <span className="text-xs text-gray-700">Racha</span>
                    </div>
                    <span className="text-sm font-bold text-orange-600">
                      {gamificationStats.currentStreak} días 🔥
                    </span>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Practice Vocabulary */}
            {practiceWords.length > 0 && (
              <Card className="p-4 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-blue-900">Vocabulario</h3>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {practiceWords.slice(0, 8).map((word, i) => (
                    <div key={i} className="p-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-all">
                      <p className="text-xs font-semibold text-blue-900">{word.term}</p>
                      {word.pronunciation && (
                        <p className="text-[10px] text-blue-600">[{word.pronunciation}]</p>
                      )}
                      <p className="text-[10px] text-gray-600 mt-0.5">{word.translation}</p>
                      {!word.mastered && (
                        <Badge variant="outline" className="text-[10px] mt-1 h-4">
                          {word.attempts} intentos
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Suggested Vocab in Conversation */}
            {suggestedVocab.length > 0 && (
              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-yellow-900">Sugeridas</h3>
                </div>
                
                <p className="text-[10px] text-gray-600 mb-2">
                  Palabras incluidas en la conversación:
                </p>
                
                <div className="space-y-1.5">
                  {suggestedVocab.map((word, i) => (
                    <div key={i} className="p-2 bg-white rounded-lg border border-yellow-200">
                      <p className="text-xs font-semibold text-gray-900">{word.term}</p>
                      <p className="text-[10px] text-gray-600">{word.translation}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Quick Actions */}
            <Card className="p-4 border-2 shadow-lg">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => router.push('/vocabulario')}
                >
                  <BookOpen className="h-3.5 w-3.5 mr-2 text-blue-600" />
                  Ver Vocabulario
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => router.push('/recursos')}
                >
                  <Languages className="h-3.5 w-3.5 mr-2 text-purple-600" />
                  Recursos de Estudio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs hover:bg-green-50 hover:border-green-300"
                  onClick={() => router.push('/dashboard')}
                >
                  <Home className="h-3.5 w-3.5 mr-2 text-green-600" />
                  Dashboard
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

