
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateVoiceResponse } from '@/lib/ai/voice-conversation-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { transcript, analysisResult, conversationContext } = await req.json();
    
    if (!transcript?.trim()) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }
    
    // Generar respuesta conversacional del tutor
    const voiceResponse = await generateVoiceResponse(
      transcript,
      conversationContext || {},
      analysisResult || {}
    );
    
    return NextResponse.json({
      text: voiceResponse.text,
      shouldCorrect: voiceResponse.shouldCorrect,
      correctionPhrase: voiceResponse.correctionPhrase,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating voice response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
