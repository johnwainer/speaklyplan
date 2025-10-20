
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
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
  ArrowLeft,
  Brain,
  Volume2,
  Mic,
  MicOff,
  Star
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getProfileImageUrl } from '@/lib/utils'

interface VocabularyTerm {
  id: string
  term: string
  pronunciation: string
  translation: string
  example: string
  difficulty: string
  mastered: boolean
  lastReviewed: Date | null
}

interface VocabularyCategory {
  id: string
  name: string
  icon: string
  description: string
  terms: VocabularyTerm[]
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
    image?: string | null
  }
}

export default function VocabularioClient({ initialData, user }: VocabularioClientProps) {
  const [categories, setCategories] = useState(initialData.categories)
  const [progress, setProgress] = useState(initialData.progress)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [isListening, setIsListening] = useState<string | null>(null)
  const [pronunciationScores, setPronunciationScores] = useState<Record<string, number>>({})
  const [recognition, setRecognition] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      setRecognition(recognitionInstance)
    }
  }, [])

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
          terms: cat.terms.map(term =>
            term.id === wordId
              ? { ...term, mastered: !currentStatus, lastReviewed: new Date() }
              : term
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

  // Text-to-Speech: Listen to pronunciation
  const handleSpeak = (term: string, termId: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(term)
      utterance.lang = 'en-US'
      utterance.rate = 0.8 // Slower for learning
      utterance.pitch = 1
      
      utterance.onstart = () => {
        setIsPlaying(termId)
      }
      
      utterance.onend = () => {
        setIsPlaying(null)
      }
      
      utterance.onerror = () => {
        setIsPlaying(null)
        toast({
          title: "Error",
          description: "No se pudo reproducir el audio.",
          variant: "destructive"
        })
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "No soportado",
        description: "Tu navegador no soporta síntesis de voz.",
        variant: "destructive"
      })
    }
  }

  // Speech-to-Text: Practice pronunciation
  const handleStartListening = (term: string, termId: string) => {
    if (!recognition) {
      toast({
        title: "No soportado",
        description: "Tu navegador no soporta reconocimiento de voz.",
        variant: "destructive"
      })
      return
    }

    setIsListening(termId)
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim()
      const targetTerm = term.toLowerCase().trim()
      
      // Calculate similarity score
      const score = calculatePronunciationScore(transcript, targetTerm)
      setPronunciationScores(prev => ({ ...prev, [termId]: score }))
      
      // Show feedback
      let feedback = ''
      let variant: 'default' | 'destructive' = 'default'
      
      if (score >= 80) {
        feedback = '¡Excelente pronunciación! 🎉'
      } else if (score >= 60) {
        feedback = 'Buena pronunciación, sigue practicando 👍'
      } else if (score >= 40) {
        feedback = 'Necesitas más práctica, ¡sigue intentando! 💪'
      } else {
        feedback = 'Intenta de nuevo, escucha bien la pronunciación 🎧'
        variant = 'destructive'
      }
      
      toast({
        title: `Puntuación: ${score}/100`,
        description: feedback,
        variant
      })
    }
    
    recognition.onerror = (event: any) => {
      setIsListening(null)
      toast({
        title: "Error",
        description: "No se pudo capturar el audio. Verifica tu micrófono.",
        variant: "destructive"
      })
    }
    
    recognition.onend = () => {
      setIsListening(null)
    }
    
    try {
      recognition.start()
    } catch (error) {
      setIsListening(null)
      toast({
        title: "Error",
        description: "Ya hay una grabación en curso.",
        variant: "destructive"
      })
    }
  }

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(null)
    }
  }

  // Calculate pronunciation accuracy
  const calculatePronunciationScore = (spoken: string, target: string): number => {
    // Normalize both strings
    const normalizeText = (text: string) => 
      text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .trim()
    
    const spokenNorm = normalizeText(spoken)
    const targetNorm = normalizeText(target)
    
    // Exact match
    if (spokenNorm === targetNorm) {
      return 100
    }
    
    // Check if target is contained in spoken
    if (spokenNorm.includes(targetNorm)) {
      return 90
    }
    
    // Check if spoken is contained in target
    if (targetNorm.includes(spokenNorm)) {
      return 85
    }
    
    // Levenshtein distance-based similarity
    const distance = levenshteinDistance(spokenNorm, targetNorm)
    const maxLength = Math.max(spokenNorm.length, targetNorm.length)
    const similarity = ((maxLength - distance) / maxLength) * 100
    
    return Math.round(Math.max(0, similarity))
  }

  // Levenshtein distance algorithm
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  // Filter categories and terms based on search
  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      terms: cat.terms.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.example.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(cat => 
      selectedCategory ? cat.id === selectedCategory : cat.terms.length > 0
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 sm:space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <div className="text-left">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">SpeaklyPlan</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block text-left">Vocabulario Profesional</p>
            </div>
          </button>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-3 text-sm text-gray-700">
              {user?.image ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300 shadow-sm">
                  <Image
                    src={getProfileImageUrl(user.image) || ''}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <span className="font-medium">{user?.name || user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/perfil')}
              className="text-xs sm:text-sm"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Mi Perfil</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-xs sm:text-sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="my-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* How to Use - Pronunciation Features */}
      <section className="py-4 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="container max-w-7xl mx-auto">
          <Card className="border border-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg shrink-0">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base mb-2">Práctica de Pronunciación Interactiva</h4>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="h-4 w-4" />
                      <span><strong>Escuchar:</strong> pronunciación nativa</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mic className="h-4 w-4" />
                      <span><strong>Practicar:</strong> graba tu voz</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4" />
                      <span><strong>Calificación:</strong> feedback 0-100</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

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
                    {category.terms.filter(w => w.mastered).length} de {category.terms.length} términos dominados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.terms.map((term, index) => (
                      <div
                        key={term.id}
                        className={`p-4 rounded-lg border transition-all ${
                          term.mastered
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="text-lg font-semibold">
                                  {index + 1}
                                </Badge>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">{term.term}</h3>
                                  <p className="text-sm text-gray-500">{term.pronunciation}</p>
                                  <p className="text-sm text-gray-600">{term.translation}</p>
                                </div>
                              </div>
                              <div className="mt-3 pl-10">
                                <p className="text-sm text-gray-700 italic">
                                  <span className="font-semibold">Ejemplo:</span> {term.example}
                                </p>
                                <Badge variant="secondary" className="mt-2">
                                  {term.difficulty === 'beginner' && 'Principiante'}
                                  {term.difficulty === 'intermediate' && 'Intermedio'}
                                  {term.difficulty === 'advanced' && 'Avanzado'}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant={term.mastered ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleToggleMastered(term.id, term.mastered)}
                              className={`ml-4 flex-shrink-0 ${
                                term.mastered ? 'bg-green-600 hover:bg-green-700' : ''
                              }`}
                            >
                              {term.mastered ? (
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

                          {/* Pronunciation Practice Section */}
                          <div className="pl-10 flex flex-wrap items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSpeak(term.term, term.id)}
                              disabled={isPlaying === term.id}
                              className="flex items-center gap-2"
                            >
                              <Volume2 className={`h-4 w-4 ${isPlaying === term.id ? 'animate-pulse' : ''}`} />
                              {isPlaying === term.id ? 'Reproduciendo...' : 'Escuchar'}
                            </Button>

                            {isListening === term.id ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleStopListening}
                                className="flex items-center gap-2 animate-pulse"
                              >
                                <MicOff className="h-4 w-4" />
                                Detener grabación
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartListening(term.term, term.id)}
                                className="flex items-center gap-2"
                              >
                                <Mic className="h-4 w-4" />
                                Practicar
                              </Button>
                            )}

                            {pronunciationScores[term.id] !== undefined && (
                              <Badge
                                variant={
                                  pronunciationScores[term.id] >= 80
                                    ? 'default'
                                    : pronunciationScores[term.id] >= 60
                                    ? 'secondary'
                                    : 'destructive'
                                }
                                className="flex items-center gap-1 px-3 py-1"
                              >
                                <Star className="h-3 w-3" />
                                <span>
                                  {pronunciationScores[term.id]}/100
                                  {pronunciationScores[term.id] >= 80 && ' ⭐'}
                                </span>
                              </Badge>
                            )}
                          </div>
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
