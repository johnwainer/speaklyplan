
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  LogOut,
  User,
  Search,
  CheckCircle2,
  Circle,
  TrendingUp,
  Home,
  Library,
  HelpCircle,
  Brain
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface VocabularyWord {
  id: string
  english: string
  spanish: string
  example: string
  mastered: boolean
  lastReviewed: Date | null
}

interface VocabularyCategory {
  id: string
  name: string
  description: string
  words: VocabularyWord[]
}

interface VocabularioClientProps {
  initialData: {
    categories: VocabularyCategory[]
    progress: {
      total: number
      learned: number
      percentage: number
    }
  }
  user: {
    id: string
    name?: string | null
    email?: string | null
  }
}

export default function VocabularioClient({ initialData, user }: VocabularioClientProps) {
  const [categories, setCategories] = useState(initialData.categories)
  const [progress, setProgress] = useState(initialData.progress)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleToggleMastered = async (wordId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/vocabulary/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordId,
          mastered: !currentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar progreso')
      }

      // Update local state
      setCategories(prev =>
        prev.map(cat => ({
          ...cat,
          words: cat.words.map(word =>
            word.id === wordId
              ? { ...word, mastered: !currentStatus, lastReviewed: new Date() }
              : word
          )
        }))
      )

      // Update progress
      setProgress(prev => ({
        ...prev,
        learned: !currentStatus ? prev.learned + 1 : prev.learned - 1,
        percentage: Math.round(((!currentStatus ? prev.learned + 1 : prev.learned - 1) / prev.total) * 100)
      }))

      toast({
        title: !currentStatus ? "¡Palabra aprendida!" : "Palabra desmarcada",
        description: !currentStatus ? "Sigue así, estás ampliando tu vocabulario." : "Palabra marcada como no aprendida.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso. Intenta de nuevo.",
        variant: "destructive"
      })
    }
  }

  // Filter categories and words based on search
  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      words: cat.words.filter(word =>
        word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.example.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(cat => 
      selectedCategory ? cat.id === selectedCategory : cat.words.length > 0
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SpeaklyPlan</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Vocabulario CTO</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.name || user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/recursos')}
            >
              <Library className="h-4 w-4 mr-2" />
              Recursos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/guia')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Guía de Uso
            </Button>
          </div>
        </div>
      </nav>

      {/* Progress Section */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 bg-blue-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{progress.percentage}%</div>
                <div className="text-sm text-gray-600">Progreso</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-green-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{progress.learned}</div>
                <div className="text-sm text-gray-600">Palabras aprendidas</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-purple-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{progress.total}</div>
                <div className="text-sm text-gray-600">Total de términos</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <Progress value={progress.percentage} className="h-3" />
            <p className="text-sm text-gray-600 mt-2 text-center">
              {progress.learned} de {progress.total} términos dominados
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 px-4">
        <div className="container max-w-7xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-600" />
                Buscar Vocabulario
              </CardTitle>
              <CardDescription>
                Busca por término en inglés, traducción o ejemplo de uso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar término..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Todas
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vocabulary Content */}
      <main className="py-8 px-4">
        <div className="container max-w-7xl mx-auto space-y-8">
          {filteredCategories.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No se encontraron resultados para tu búsqueda.</p>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map(category => (
              <Card key={category.id} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{category.name}</CardTitle>
                  <CardDescription>
                    {category.words.filter(w => w.mastered).length} de {category.words.length} términos dominados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.words.map((word, index) => (
                      <div
                        key={word.id}
                        className={`p-4 rounded-lg border transition-all ${
                          word.mastered
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="text-lg font-semibold">
                                {index + 1}
                              </Badge>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{word.english}</h3>
                                <p className="text-sm text-gray-600">{word.spanish}</p>
                              </div>
                            </div>
                            <div className="mt-3 pl-10">
                              <p className="text-sm text-gray-700 italic">
                                <span className="font-semibold">Ejemplo:</span> {word.example}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant={word.mastered ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleToggleMastered(word.id, word.mastered)}
                            className={`ml-4 flex-shrink-0 ${
                              word.mastered ? 'bg-green-600 hover:bg-green-700' : ''
                            }`}
                          >
                            {word.mastered ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Dominada
                              </>
                            ) : (
                              <>
                                <Circle className="h-4 w-4 mr-1" />
                                Marcar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
