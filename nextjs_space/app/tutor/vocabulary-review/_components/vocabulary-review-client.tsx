
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Home, ArrowLeft, Check, X, RotateCcw, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface VocabularyCard {
  id: string;
  word: string;
  translation: string;
  context: string | null;
  difficulty: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  lastReviewedAt: Date | null;
}

interface VocabularyReviewClientProps {
  dueCards: VocabularyCard[];
  allCards: VocabularyCard[];
  userId: string;
}

const QUALITY_LEVELS = [
  { value: 0, label: 'No recordé', emoji: '😵', color: 'bg-red-500' },
  { value: 1, label: 'Muy difícil', emoji: '😰', color: 'bg-orange-500' },
  { value: 2, label: 'Difícil', emoji: '😟', color: 'bg-yellow-500' },
  { value: 3, label: 'Recordé', emoji: '🙂', color: 'bg-blue-500' },
  { value: 4, label: 'Fácil', emoji: '😊', color: 'bg-green-500' },
  { value: 5, label: 'Muy fácil', emoji: '😎', color: 'bg-emerald-500' },
];

export default function VocabularyReviewClient({
  dueCards: initialDueCards,
  allCards: initialAllCards,
  userId,
}: VocabularyReviewClientProps) {
  const [reviewMode, setReviewMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<string[]>([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [dueCards, setDueCards] = useState(initialDueCards);
  const [allCards, setAllCards] = useState(initialAllCards);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCard, setNewCard] = useState({ word: '', translation: '', context: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const currentCard = reviewMode && dueCards.length > 0 ? dueCards[currentCardIndex] : null;
  const progress = dueCards.length > 0 ? ((reviewedCards.length / dueCards.length) * 100) : 0;

  const startReview = () => {
    if (dueCards.length === 0) {
      toast.error('No hay tarjetas para revisar en este momento');
      return;
    }
    setReviewMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setReviewedCards([]);
    setSessionStats({ correct: 0, total: 0 });
  };

  const handleQualityResponse = async (quality: number) => {
    if (!currentCard) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tutor/vocabulary-cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          quality,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      // Update stats
      const wasCorrect = quality >= 3;
      setSessionStats((prev) => ({
        correct: prev.correct + (wasCorrect ? 1 : 0),
        total: prev.total + 1,
      }));

      // Mark card as reviewed
      setReviewedCards((prev) => [...prev, currentCard.id]);

      // Move to next card
      if (currentCardIndex < dueCards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
        setShowAnswer(false);
      } else {
        // Session complete
        toast.success('¡Sesión de repaso completada!');
        setReviewMode(false);
        
        // Award points
        await fetch('/api/tutor/gamification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'award_points',
            points: dueCards.length * 5,
            reason: 'Sesión de repaso completada',
          }),
        });
        
        // Refresh page data
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Error al actualizar tarjeta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewCard = async () => {
    if (!newCard.word.trim() || !newCard.translation.trim()) {
      toast.error('Palabra y traducción son requeridas');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tutor/vocabulary-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add card');
      }

      toast.success('¡Tarjeta agregada!');
      setShowAddDialog(false);
      setNewCard({ word: '', translation: '', context: '' });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al agregar tarjeta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reviewMode && currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
          <div className="container flex h-16 max-w-4xl mx-auto items-center justify-between px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReviewMode(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Salir
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {reviewedCards.length + 1} / {dueCards.length}
              </span>
            </div>
          </div>
        </header>

        <div className="container max-w-4xl mx-auto py-8 px-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Card Display */}
          <Card className="p-8 mb-6 min-h-[300px] flex flex-col items-center justify-center">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Repeticiones: {currentCard.repetitions}
              </Badge>
              <h2 className="text-4xl font-bold mb-6">{currentCard.word}</h2>
              
              {!showAnswer ? (
                <Button
                  size="lg"
                  onClick={() => setShowAnswer(true)}
                  className="mt-4"
                >
                  Mostrar Respuesta
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xl font-medium text-blue-900">
                      {currentCard.translation}
                    </p>
                  </div>
                  {currentCard.context && (
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-muted-foreground">
                      <p className="italic">{currentCard.context}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Quality Response Buttons */}
          {showAnswer && (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground mb-4">
                ¿Qué tan bien recordaste esta palabra?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {QUALITY_LEVELS.map((level) => (
                  <Button
                    key={level.value}
                    variant="outline"
                    className={`h-auto py-4 flex flex-col gap-2 hover:${level.color} hover:text-white transition-colors`}
                    onClick={() => handleQualityResponse(level.value)}
                    disabled={isSubmitting}
                  >
                    <span className="text-2xl">{level.emoji}</span>
                    <span className="font-medium">{level.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {reviewedCards.length > 0 && (
            <div className="mt-8 flex justify-center gap-4">
              <Badge variant="outline" className="gap-1">
                ✓ {sessionStats.correct} correctas
              </Badge>
              <Badge variant="outline" className="gap-1">
                Total: {sessionStats.total}
              </Badge>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-6xl mx-auto items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">Repaso de Vocabulario</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Palabra
            </Button>
            <Link href="/tutor">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Volver al Tutor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-3xl font-bold text-blue-600">{dueCards.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Tarjetas por revisar</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-3xl font-bold text-green-600">{allCards.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Total de tarjetas</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-3xl font-bold text-purple-600">
              {allCards.filter((c) => c.repetitions >= 3).length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Palabras dominadas</p>
          </Card>
        </div>

        {/* Start Review Button */}
        {dueCards.length > 0 && (
          <Card className="p-8 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">¡Es hora de repasar!</h3>
              <p className="mb-6">Tienes {dueCards.length} tarjetas esperando por ti</p>
              <Button size="lg" variant="secondary" onClick={startReview}>
                <RotateCcw className="h-5 w-5 mr-2" />
                Comenzar Sesión de Repaso
              </Button>
            </div>
          </Card>
        )}

        {/* All Cards List */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Todas tus tarjetas</h3>
          {allCards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">Aún no tienes tarjetas de vocabulario</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Palabra
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {allCards.map((card) => (
                <Card key={card.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg">{card.word}</h4>
                        <Badge variant="secondary">{card.translation}</Badge>
                      </div>
                      {card.context && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          {card.context}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Repeticiones</p>
                        <p className="font-bold">{card.repetitions}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Próximo repaso</p>
                        <p className="font-medium">
                          {new Date(card.nextReviewDate) <= new Date()
                            ? 'Ahora'
                            : new Date(card.nextReviewDate).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric',
                              })}
                        </p>
                      </div>
                      {card.repetitions >= 3 && (
                        <Badge className="bg-green-500">✓ Dominada</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Card Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Palabra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="word">Palabra en Inglés *</Label>
              <Input
                id="word"
                placeholder="e.g., resilient"
                value={newCard.word}
                onChange={(e) => setNewCard({ ...newCard, word: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="translation">Traducción *</Label>
              <Input
                id="translation"
                placeholder="e.g., resiliente"
                value={newCard.translation}
                onChange={(e) => setNewCard({ ...newCard, translation: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="context">Contexto (opcional)</Label>
              <Textarea
                id="context"
                placeholder="e.g., She showed resilient behavior during difficult times."
                value={newCard.context}
                onChange={(e) => setNewCard({ ...newCard, context: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addNewCard} disabled={isSubmitting}>
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
