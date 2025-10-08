
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Volume2, BookOpen, Target, MessageSquare, Home, BarChart3, Languages, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

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
  const [showSidebar, setShowSidebar] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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
    setContext(newContext);
    setMessages([]);
    setConversationId(null);
    toast.success(`Modo cambiado: ${contextModes.find(m => m.value === newContext)?.label}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SpeaklyPlan</span>
            <Badge variant="secondary" className="ml-2">AI Tutor</Badge>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/vocabulario">
              <Button variant="ghost" size="sm">
                <Languages className="h-4 w-4 mr-2" />
                Vocabulario
              </Button>
            </Link>
            <Link href="/guia">
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Guía
              </Button>
            </Link>
          </nav>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Panel Lateral */}
          <div className={`lg:col-span-1 space-y-4 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
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
              <div className="space-y-2">
                {initialData.currentWeekVocab?.slice(0, 8).map(term => (
                  <div key={term.id} className="p-2 bg-blue-50 rounded-lg">
                    <p className="font-medium text-sm">{term.term}</p>
                    <p className="text-xs text-muted-foreground">{term.translation}</p>
                  </div>
                ))}
              </div>
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
          <Card className="lg:col-span-3 flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                English Tutor AI
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                {contextModes.find(m => m.value === context)?.description}
              </p>
            </div>
            
            <ScrollArea className="flex-1 p-4">
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
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message in English..."
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
                Presiona Enter para enviar • Shift + Enter para nueva línea
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
