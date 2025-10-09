
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import VocabularioClient from './_components/vocabulario-client'

async function getVocabularyData(userId: string) {
  try {
    // Get all vocabulary categories with terms
    const categories = await prisma.vocabularyCategory.findMany({
      include: {
        terms: {
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
    const totalTerms = await prisma.vocabularyTerm.count()
    const learnedTerms = await prisma.userVocabularyProgress.count({
      where: {
        userId: userId,
        mastered: true
      }
    })

    return {
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || '',
        description: cat.description || '',
        terms: cat.terms.map(term => ({
          id: term.id,
          term: term.term,
          pronunciation: term.pronunciation,
          translation: term.translation,
          example: term.example || '',
          difficulty: term.difficulty,
          mastered: term.learned?.[0]?.mastered || false,
          lastReviewed: term.learned?.[0]?.lastReviewed || null
        }))
      })),
      progress: {
        total: totalTerms,
        learned: learnedTerms,
        percentage: totalTerms > 0 ? Math.round((learnedTerms / totalTerms) * 100) : 0
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
        email: session.user.email,
        image: session.user.image || null
      }}
    />
  )
}
