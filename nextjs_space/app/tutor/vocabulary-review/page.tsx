
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import VocabularyReviewClient from './_components/vocabulary-review-client';

export default async function VocabularyReviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Get vocabulary cards due for review
  const now = new Date();
  const dueCards = await prisma.vocabularyCard.findMany({
    where: {
      userId: user.id,
      nextReviewDate: {
        lte: now,
      },
    },
    orderBy: {
      nextReviewDate: 'asc',
    },
  });

  const allCards = await prisma.vocabularyCard.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <VocabularyReviewClient
      dueCards={JSON.parse(JSON.stringify(dueCards))}
      allCards={JSON.parse(JSON.stringify(allCards))}
      userId={user.id}
    />
  );
}
