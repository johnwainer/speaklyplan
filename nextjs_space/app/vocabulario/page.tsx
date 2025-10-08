
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import VocabularioClient from './_components/vocabulario-client'

async function getVocabularyData(userId: string) {
  try {
    // Get all vocabulary categories with words
    const categories = await prisma.vocabularyCategory.findMany({
      include: {
        words: {
          include: {
            learned: {
              where: { userId: userId }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Calculate progress
    const totalWords = await prisma.vocabularyWord.count()
    const learnedWords = await prisma.userVocabularyProgress.count({
      where: {
        userId: userId,
        mastered: true
      }
    })

    return {
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        words: cat.words.map(word => ({
          id: word.id,
          english: word.english,
          spanish: word.spanish,
          example: word.example || '',
          mastered: word.learned?.[0]?.mastered || false,
          lastReviewed: word.learned?.[0]?.lastReviewed || null
        }))
      })),
      progress: {
        total: totalWords,
        learned: learnedWords,
        percentage: totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0
      }
    }
  } catch (error) {
    console.error('Error getting vocabulary data:', error)
    return {
      categories: [],
      progress: {
        total: 0,
        learned: 0,
        percentage: 0
      }
    }
  }
}

export default async function VocabularioPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const vocabularyData = await getVocabularyData(session.user.id)

  return (
    <VocabularioClient 
      initialData={vocabularyData}
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }}
    />
  )
}
