
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import VoiceConversationClient from './voice-client';

export default async function VoiceConversationPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VoiceConversationClient userId={session.user.id} />
    </Suspense>
  );
}
