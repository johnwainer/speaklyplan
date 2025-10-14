
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, Info, Star } from 'lucide-react';
import Link from 'next/link';
import VoiceConversation from './_components/voice-conversation';
import { AppHeader } from '@/components/app-header';
import { ACCENT_PROFILES } from '@/lib/ai/voice-conversation-service';

interface VoiceConversationClientProps {
  userId: string;
}

export default function VoiceConversationClient({ userId }: VoiceConversationClientProps) {
  const router = useRouter();
  const [selectedAccent, setSelectedAccent] = useState<'american' | 'british' | 'indian' | 'australian'>('american');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AppHeader currentSection="tutor" />
      
      {/* Tutor-Specific Bar */}
      <div className="sticky top-16 z-40 w-full border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white text-blue-600">
                <Mic className="h-3 w-3 mr-1" />
                Voice Practice
              </Badge>
              <Link href="/tutor">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
            <Star className="h-5 w-5" />
            <span className="font-semibold">NEW: AI Voice Conversation</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Real-Time Voice Practice
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice speaking English with AI analysis. Get instant feedback on pronunciation, fluency, and accent.
          </p>
        </div>
        
        {/* Info Card */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click "Start Speaking" to begin voice conversation</li>
                <li>• Speak naturally in English - the AI listens continuously</li>
                <li>• Get instant pronunciation analysis and feedback</li>
                <li>• The tutor responds with voice to continue the conversation</li>
                <li>• Practice different accents and improve specific sounds</li>
              </ul>
            </div>
          </div>
        </Card>
        
        {/* Accent Selector */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Target Accent</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(ACCENT_PROFILES).map(([key, profile]) => (
              <Button
                key={key}
                variant={selectedAccent === key ? 'default' : 'outline'}
                className="h-auto py-4 flex flex-col items-start text-left"
                onClick={() => setSelectedAccent(key as any)}
              >
                <span className="font-medium capitalize">{profile.accent}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {profile.characteristics[0]}
                </span>
              </Button>
            ))}
          </div>
        </Card>
        
        {/* Main Voice Conversation Component */}
        <VoiceConversation 
          userId={userId}
          targetAccent={selectedAccent}
        />
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mic className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">Continuous Listening</h4>
            <p className="text-sm text-muted-foreground">
              Speak naturally without pressing buttons
            </p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">Phoneme Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Detailed feedback on specific sounds
            </p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mic className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">Multiple Accents</h4>
            <p className="text-sm text-muted-foreground">
              Practice with different English accents
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
