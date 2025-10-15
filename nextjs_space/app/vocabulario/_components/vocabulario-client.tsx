
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
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
  Star,
  Sparkles,
  Zap,
  Award,
  Filter
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getProfileImageUrl } from '@/lib/utils'
import { AppHeader } from '@/components/app-header'
import { SectionNavigator } from '@/components/section-navigator'

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
      <AppHeader currentSection="vocabulario" />

      {/* Section Navigator */}
      <SectionNavigator currentSection="vocabulario" />

      {/* How to Use - Pronunciation Features */}
      <section className="py-3 sm:py-4 px-3 sm:px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="container max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <CardContent className="p-3 sm:p-6 relative z-10 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 max-w-full">
                  <motion.div 
                    className="p-2 sm:p-3 bg-white/20 rounded-xl shrink-0"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Volume2 className="h-5 w-5 sm:h-7 sm:w-7" />
                  </motion.div>
                  <div className="flex-1 w-full min-w-0 overflow-hidden">
                    <h4 className="font-bold text-sm sm:text-xl mb-2 sm:mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Práctica de Pronunciación con IA</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 w-full">
                      <motion.div 
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 min-w-0"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                      >
                        <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                        <div className="min-w-0 overflow-hidden">
                          <strong className="block text-xs sm:text-base truncate">Escuchar</strong>
                          <span className="text-xs text-blue-100 truncate block">Pronunciación nativa</span>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 min-w-0"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                      >
                        <Mic className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                        <div className="min-w-0 overflow-hidden">
                          <strong className="block text-xs sm:text-base truncate">Practicar</strong>
                          <span className="text-xs text-blue-100 truncate block">Graba tu voz</span>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 min-w-0"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                      >
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                        <div className="min-w-0 overflow-hidden">
                          <strong className="block text-xs sm:text-base truncate">Calificación</strong>
                          <span className="text-xs text-blue-100 truncate block">Feedback 0-100</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-4 sm:py-8 px-3 sm:px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        <div className="container max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
                <CardContent className="p-4 sm:p-6 text-center relative z-10">
                  <motion.div 
                    className="flex items-center justify-center mb-2 sm:mb-3"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                      <TrendingUp className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="text-3xl sm:text-4xl font-bold"
                    key={progress.percentage}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {progress.percentage}%
                  </motion.div>
                  <div className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-blue-100">Tu Progreso</div>
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 absolute top-2 sm:top-3 right-2 sm:right-3 opacity-50" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
                <CardContent className="p-4 sm:p-6 text-center relative z-10">
                  <motion.div 
                    className="flex items-center justify-center mb-2 sm:mb-3"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                      <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="text-3xl sm:text-4xl font-bold"
                    key={progress.learned}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {progress.learned}
                  </motion.div>
                  <div className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-green-100">Dominadas</div>
                  <Award className="h-3 w-3 sm:h-4 sm:w-4 absolute top-2 sm:top-3 right-2 sm:right-3 opacity-50" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
                <CardContent className="p-4 sm:p-6 text-center relative z-10">
                  <motion.div 
                    className="flex items-center justify-center mb-2 sm:mb-3"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                      <Brain className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>
                  </motion.div>
                  <div className="text-3xl sm:text-4xl font-bold">{progress.total}</div>
                  <div className="text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-purple-100">Total Términos</div>
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 absolute top-2 sm:top-3 right-2 sm:right-3 opacity-50" />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-4 sm:mt-8 bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Progreso General</span>
              <span className="text-xs sm:text-sm font-bold text-blue-600">{progress.learned}/{progress.total}</span>
            </div>
            <div className="relative">
              <Progress value={progress.percentage} className="h-3 sm:h-4" />
              <motion.div
                className="absolute top-0 left-0 h-3 sm:h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 sm:mt-3 text-center">
              ¡Sigue así! Has dominado <span className="font-bold text-green-600">{progress.percentage}%</span> del vocabulario 🎉
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-3 sm:py-6 px-3 sm:px-4">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
              <CardHeader className="relative z-10 p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-2xl">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Search className="h-4 w-4 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
                  </motion.div>
                  Buscar Vocabulario
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Encuentra términos por palabra en inglés, traducción o contexto de uso
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Search Bar - Full Width */}
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                    <Input
                      placeholder="Escribe aquí para buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 sm:pl-14 pr-3 sm:pr-4 h-11 sm:h-14 text-base sm:text-lg border-2 focus:border-blue-500 transition-all rounded-xl shadow-lg"
                    />
                  </div>

                  {/* Filters - Separate Row */}
                  <div className="flex items-start gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Categorías:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={selectedCategory === null ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(null)}
                          className={`h-8 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 ${selectedCategory === null ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : ''}`}
                        >
                          Todas
                        </Button>
                      </motion.div>
                      {categories.map(cat => (
                        <motion.div key={cat.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant={selectedCategory === cat.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`h-8 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 ${selectedCategory === cat.id ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : ''}`}
                          >
                            {cat.name}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Vocabulary Content */}
      <main className="py-4 sm:py-8 px-3 sm:px-4">
        <div className="container max-w-7xl mx-auto space-y-4 sm:space-y-8">
          <AnimatePresence>
            {filteredCategories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardContent className="p-12 text-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    </motion.div>
                    <p className="text-xl text-gray-600">No se encontraron resultados para tu búsqueda.</p>
                    <p className="text-sm text-gray-500 mt-2">Intenta con otros términos o cambia los filtros</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                >
                  <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
                    <CardHeader className="relative z-10 border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {category.name}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-base mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                            <span className="truncate">{category.terms.filter(w => w.mastered).length} de {category.terms.length} términos dominados</span>
                          </CardDescription>
                        </div>
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="flex-shrink-0"
                        >
                          <div className="p-2 sm:p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                            <BookOpen className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                          </div>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 relative z-10">
                      <div className="space-y-3 sm:space-y-4">
                        {category.terms.map((term, index) => (
                          <motion.div
                            key={term.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, x: 10 }}
                          >
                            <div
                              className={`p-4 sm:p-6 rounded-2xl border-2 transition-all shadow-lg relative overflow-hidden ${
                                term.mastered
                                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-green-200'
                                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-blue-200'
                              }`}
                            >
                              {/* Sparkle effect for mastered words */}
                              {term.mastered && (
                                <motion.div
                                  className="absolute top-2 right-2"
                                  animate={{ 
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                </motion.div>
                              )}

                              <div className="flex flex-col space-y-3 sm:space-y-4">
                                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                  <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 mb-2 sm:mb-3">
                                      <Badge 
                                        variant="outline" 
                                        className="text-sm sm:text-lg font-bold px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 self-start"
                                      >
                                        #{index + 1}
                                      </Badge>
                                      <div className="flex-1 w-full">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">{term.term}</h3>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
                                          <p className="text-xs sm:text-sm text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                                            {term.pronunciation}
                                          </p>
                                          <p className="text-sm sm:text-base text-gray-700 font-semibold">{term.translation}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-3 sm:mt-4 pl-2 border-l-4 border-purple-300">
                                      <p className="text-xs sm:text-sm text-gray-700 italic pl-3 sm:pl-4">
                                        <span className="font-bold text-purple-600">📝 Ejemplo:</span> {term.example}
                                      </p>
                                    </div>
                                    <div className="mt-2 sm:mt-3 flex items-center gap-2">
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs sm:text-sm font-semibold ${
                                          term.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                          term.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-red-100 text-red-700'
                                        }`}
                                      >
                                        {term.difficulty === 'beginner' && '⭐ Principiante'}
                                        {term.difficulty === 'intermediate' && '⭐⭐ Intermedio'}
                                        {term.difficulty === 'advanced' && '⭐⭐⭐ Avanzado'}
                                      </Badge>
                                    </div>
                                  </div>
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto"
                                  >
                                    <Button
                                      variant={term.mastered ? 'default' : 'outline'}
                                      size="default"
                                      onClick={() => handleToggleMastered(term.id, term.mastered)}
                                      className={`w-full sm:w-auto flex-shrink-0 shadow-lg h-9 sm:h-10 text-sm sm:text-base ${
                                        term.mastered 
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0' 
                                          : 'hover:bg-blue-50 hover:border-blue-400'
                                      }`}
                                    >
                                      {term.mastered ? (
                                        <>
                                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                          Dominada
                                        </>
                                      ) : (
                                        <>
                                          <Circle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                          Marcar
                                        </>
                                      )}
                                    </Button>
                                  </motion.div>
                                </div>

                                {/* Pronunciation Practice Section */}
                                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-semibold w-full sm:w-auto">
                                    <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Práctica:
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial min-w-[120px]">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSpeak(term.term, term.id)}
                                        disabled={isPlaying === term.id}
                                        className={`w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm ${
                                          isPlaying === term.id 
                                            ? 'bg-blue-50 border-blue-400 text-blue-700' 
                                            : 'hover:bg-blue-50 hover:border-blue-400'
                                        }`}
                                      >
                                        <Volume2 className={`h-3 w-3 sm:h-4 sm:w-4 ${isPlaying === term.id ? 'animate-pulse' : ''}`} />
                                        <span className="truncate">{isPlaying === term.id ? 'Reproduciendo...' : 'Escuchar'}</span>
                                      </Button>
                                    </motion.div>

                                    {isListening === term.id ? (
                                      <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="flex-1 sm:flex-initial min-w-[120px]"
                                      >
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={handleStopListening}
                                          className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm"
                                        >
                                          <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />
                                          <span className="truncate">Detener</span>
                                        </Button>
                                      </motion.div>
                                    ) : (
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial min-w-[120px]">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleStartListening(term.term, term.id)}
                                          className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 hover:bg-purple-50 hover:border-purple-400 h-8 sm:h-9 text-xs sm:text-sm"
                                        >
                                          <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                                          <span className="truncate">Practicar</span>
                                        </Button>
                                      </motion.div>
                                    )}

                                    {pronunciationScores[term.id] !== undefined && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="flex-1 sm:flex-initial min-w-[100px]"
                                      >
                                        <Badge
                                          variant={
                                            pronunciationScores[term.id] >= 80
                                              ? 'default'
                                              : pronunciationScores[term.id] >= 60
                                              ? 'secondary'
                                              : 'destructive'
                                          }
                                          className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold w-full ${
                                            pronunciationScores[term.id] >= 80
                                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0'
                                              : pronunciationScores[term.id] >= 60
                                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0'
                                              : 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-0'
                                          }`}
                                        >
                                          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                                          <span className="truncate">
                                            {pronunciationScores[term.id]}/100
                                            {pronunciationScores[term.id] >= 80 && ' 🎉'}
                                          </span>
                                        </Badge>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
