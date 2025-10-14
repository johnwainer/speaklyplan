
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, Award, TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VoiceConversationProps {
  userId: string;
  conversationId?: string;
  targetAccent?: 'american' | 'british' | 'indian' | 'australian';
}

export default function VoiceConversation({ userId, conversationId, targetAccent = 'american' }: VoiceConversationProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [tutorResponse, setTutorResponse] = useState('');
  const [sessionStats, setSessionStats] = useState({
    pronunciation: 0,
    fluency: 0,
    accent: 0
  });
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  useEffect(() => {
    initVoiceSystem();
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
      
      recognition.continuous = true; // Continuous listening
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast.success('🎤 Listening... Speak naturally!');
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
          toast.info('No speech detected. Try speaking again.');
        } else {
          toast.error('Voice recognition error. Please try again.');
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
      toast.error('Failed to start voice recognition');
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
          conversationId
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
      
      // 2. Generar respuesta del tutor
      const responseData = await fetch('/api/tutor/voice/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptText,
          analysisResult: analysisData.analysis,
          conversationContext: {
            history: conversationHistory,
            targetAccent
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
      
      // 5. Mostrar feedback si hay errores críticos
      if (analysisData.analysis.phonemeErrors.length > 0) {
        const criticalErrors = analysisData.analysis.phonemeErrors.filter((e: any) => e.severity === 'high');
        if (criticalErrors.length > 0) {
          toast.info(`💡 Pronunciation tip: ${criticalErrors[0].suggestion}`, {
            duration: 5000
          });
        }
      }
      
      // Limpiar transcript
      setTranscript('');
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Failed to process voice input');
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
      
      synthRef.current.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice based on target accent
      const voices = synthRef.current.getVoices();
      const targetVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (targetAccent === 'british' ? v.name.includes('UK') : v.name.includes('US'))
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for clarity
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
  
  return (
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
              {isListening && 'Listening...'}
              {isSpeaking && 'Tutor Speaking...'}
              {!isListening && !isSpeaking && 'Ready to Practice'}
            </h3>
            
            <p className="text-sm text-muted-foreground">
              {isListening && 'Speak naturally in English'}
              {isSpeaking && 'Listen to the tutor\'s response'}
              {!isListening && !isSpeaking && 'Click the button to start'}
            </p>
          </div>
          
          {/* Live Transcript */}
          {transcript && (
            <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-medium">You: </span>
                {transcript}
              </p>
            </div>
          )}
          
          {/* Analyzing Indicator */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 animate-pulse" />
              Analyzing your pronunciation...
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
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Start Speaking
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            💡 Tip: Speak clearly and naturally. The AI will analyze your pronunciation in real-time.
          </p>
        </div>
      </Card>
      
      {/* Session Statistics */}
      {(sessionStats.pronunciation > 0 || sessionStats.fluency > 0 || sessionStats.accent > 0) && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Current Session Stats
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pronunciation</span>
                <span className="text-sm font-bold text-blue-600">{sessionStats.pronunciation.toFixed(0)}/100</span>
              </div>
              <Progress value={sessionStats.pronunciation} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Fluency</span>
                <span className="text-sm font-bold text-green-600">{sessionStats.fluency.toFixed(0)}/100</span>
              </div>
              <Progress value={sessionStats.fluency} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Accent Similarity</span>
                <span className="text-sm font-bold text-purple-600">{sessionStats.accent.toFixed(0)}/100</span>
              </div>
              <Progress value={sessionStats.accent} className="h-2" />
            </div>
          </div>
        </Card>
      )}
      
      {/* Latest Analysis Feedback */}
      {analysis && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Latest Analysis
          </h3>
          
          <div className="space-y-3">
            {/* Strengths */}
            {analysis.accentScore?.strengths?.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Strengths</p>
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
                  <p className="text-sm font-medium text-blue-900">Suggestions</p>
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
                  <p className="text-sm font-medium text-yellow-900">Sounds to Practice</p>
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
          <h3 className="font-semibold mb-4">Conversation History</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {conversationHistory.slice().reverse().slice(0, 6).map((entry, i) => (
              <div key={i} className={cn(
                "p-3 rounded-lg",
                entry.type === 'user' ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
              )}>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {entry.type === 'user' ? 'You' : 'Tutor'}
                </p>
                <p className="text-sm">{entry.text}</p>
                {entry.analysis && (
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Pronunciation: {entry.analysis.pronunciationScore.toFixed(0)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Fluency: {entry.analysis.fluencyScore.toFixed(0)}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
