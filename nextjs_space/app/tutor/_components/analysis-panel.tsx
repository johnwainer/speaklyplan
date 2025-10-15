
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, AlertCircle, Info, Volume2, BookOpen, 
  TrendingUp, Target, Lightbulb, Award, ChevronDown, ChevronUp, Zap, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GrammarError {
  type: string;
  category: string;
  original: string;
  correction: string;
  explanation: string;
  explanationSpanish?: string;
  severity: 'low' | 'medium' | 'high';
  position: number;
}

interface GrammarAnalysis {
  errors: GrammarError[];
  feedback: {
    hasErrors: boolean;
    suggestion: string;
    accuracyScore: number;
  };
}

interface PhonemeError {
  word: string;
  phoneme: string;
  error: string;
  errorSpanish?: string;
  correction: string;
  correctionSpanish?: string;
  severity: 'low' | 'medium' | 'high';
  position: number;
}

interface PronunciationAnalysis {
  pronunciationScore: number;
  fluencyScore: number;
  phonemeErrors: PhonemeError[];
  strengths: string[];
  areasToImprove: string[];
  suggestions: string[];
  suggestionsSpanish?: string[];
  overallFeedback: string;
  overallFeedbackSpanish?: string;
}

interface AnalysisPanelProps {
  grammarAnalysis: GrammarAnalysis | null;
  pronunciationAnalysis: PronunciationAnalysis | null;
  isVisible: boolean;
}

export function AnalysisPanel({ 
  grammarAnalysis, 
  pronunciationAnalysis, 
  isVisible 
}: AnalysisPanelProps) {
  const [isPronunciationExpanded, setIsPronunciationExpanded] = useState(true);
  const [isGrammarExpanded, setIsGrammarExpanded] = useState(true);
  
  if (!isVisible || (!grammarAnalysis && !pronunciationAnalysis)) {
    return null;
  }

  const severityColors = {
    low: 'text-blue-600 bg-blue-50 border-blue-200',
    medium: 'text-orange-600 bg-orange-50 border-orange-200',
    high: 'text-red-600 bg-red-50 border-red-200'
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="space-y-3 sm:space-y-4 animate-in slide-in-from-bottom-4 duration-300">
      {/* Pronunciation Analysis */}
      {pronunciationAnalysis && (
        <Card className="overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
          {/* Header - Always Visible */}
          <div 
            onClick={() => setIsPronunciationExpanded(!isPronunciationExpanded)}
            className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-purple-900">Pronunciación</h3>
                <p className="text-[10px] sm:text-xs text-purple-600 flex items-center gap-1.5">
                  <Star className={cn("h-3 w-3", getScoreColor(pronunciationAnalysis.pronunciationScore))} />
                  {pronunciationAnalysis.pronunciationScore}/100
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                "px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white",
                pronunciationAnalysis.pronunciationScore >= 90 && "bg-green-500",
                pronunciationAnalysis.pronunciationScore >= 70 && pronunciationAnalysis.pronunciationScore < 90 && "bg-yellow-500",
                pronunciationAnalysis.pronunciationScore < 70 && "bg-red-500"
              )}>
                {pronunciationAnalysis.pronunciationScore >= 90 && '¡Excelente!'}
                {pronunciationAnalysis.pronunciationScore >= 70 && pronunciationAnalysis.pronunciationScore < 90 && 'Bien'}
                {pronunciationAnalysis.pronunciationScore < 70 && 'Practica'}
              </div>
              {isPronunciationExpanded ? (
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              ) : (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              )}
            </div>
          </div>

          {/* Expandable Content */}
          {isPronunciationExpanded && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
              {/* Scores */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-white/70 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Pronunciación</span>
                    <span className={cn("text-xs sm:text-sm font-bold", getScoreColor(pronunciationAnalysis.pronunciationScore))}>
                      {pronunciationAnalysis.pronunciationScore}
                    </span>
                  </div>
                  <Progress 
                    value={pronunciationAnalysis.pronunciationScore} 
                    className="h-1.5 sm:h-2"
                  />
                </div>
                <div className="p-2 sm:p-3 bg-white/70 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Fluidez</span>
                    <span className={cn("text-xs sm:text-sm font-bold", getScoreColor(pronunciationAnalysis.fluencyScore))}>
                      {pronunciationAnalysis.fluencyScore}
                    </span>
                  </div>
                  <Progress 
                    value={pronunciationAnalysis.fluencyScore} 
                    className="h-1.5 sm:h-2"
                  />
                </div>
              </div>

              {/* Overall Feedback */}
              <div className="p-2 sm:p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                <p className="text-xs sm:text-sm text-gray-700">
                  {pronunciationAnalysis.overallFeedbackSpanish || pronunciationAnalysis.overallFeedback}
                </p>
              </div>

              {/* Phoneme Errors */}
              {pronunciationAnalysis.phonemeErrors && pronunciationAnalysis.phonemeErrors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-700" />
                    <p className="text-[10px] sm:text-xs font-bold text-purple-900">
                      Errores de Fonemas ({pronunciationAnalysis.phonemeErrors.length})
                    </p>
                  </div>
                  {pronunciationAnalysis.phonemeErrors.slice(0, 3).map((error, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-2 sm:p-3 rounded-lg border text-xs",
                        severityColors[error.severity]
                      )}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="text-xs sm:text-sm font-bold">
                          "{error.word}" - /{error.phoneme}/
                        </span>
                        <Badge variant="outline" className="text-[10px] h-4 sm:h-5">
                          {error.severity === 'low' && '⚠️'}
                          {error.severity === 'medium' && '⚠️⚠️'}
                          {error.severity === 'high' && '⚠️⚠️⚠️'}
                        </Badge>
                      </div>
                      <p className="text-[10px] sm:text-xs mb-1">
                        ❌ {error.errorSpanish || error.error}
                      </p>
                      <p className="text-[10px] sm:text-xs font-semibold">
                        ✅ {error.correctionSpanish || error.correction}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths */}
              {pronunciationAnalysis.strengths && pronunciationAnalysis.strengths.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600" />
                    <p className="text-[10px] sm:text-xs font-bold text-green-700">Fortalezas</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pronunciationAnalysis.strengths.slice(0, 4).map((strength, i) => (
                      <Badge key={i} className="bg-green-50 text-green-700 border-green-300 text-[10px] sm:text-xs">
                        ✓ {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {pronunciationAnalysis.suggestionsSpanish && pronunciationAnalysis.suggestionsSpanish.length > 0 && (
                <div className="p-2 sm:p-3 bg-purple-100/50 rounded-lg border border-purple-300">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-700" />
                    <p className="text-[10px] sm:text-xs font-bold text-purple-900">Sugerencias</p>
                  </div>
                  <ul className="space-y-1">
                    {pronunciationAnalysis.suggestionsSpanish.slice(0, 3).map((suggestion, i) => (
                      <li key={i} className="text-[10px] sm:text-xs text-gray-700 flex items-start gap-1.5">
                        <Zap className="h-3 w-3 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Grammar Analysis */}
      {grammarAnalysis && (
        <Card className="overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
          {/* Header - Always Visible */}
          <div 
            onClick={() => setIsGrammarExpanded(!isGrammarExpanded)}
            className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-blue-900">Gramática</h3>
                <p className="text-[10px] sm:text-xs text-blue-600 flex items-center gap-1.5">
                  <Star className={cn("h-3 w-3", getScoreColor(grammarAnalysis.feedback.accuracyScore))} />
                  {grammarAnalysis.feedback.accuracyScore}/100
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {grammarAnalysis.errors && grammarAnalysis.errors.length > 0 ? (
                <div className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-orange-500 text-white">
                  {grammarAnalysis.errors.length} error{grammarAnalysis.errors.length !== 1 ? 'es' : ''}
                </div>
              ) : (
                <div className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-green-500 text-white">
                  ¡Perfecto!
                </div>
              )}
              {isGrammarExpanded ? (
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              ) : (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              )}
            </div>
          </div>

          {/* Expandable Content */}
          {isGrammarExpanded && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
              {/* Accuracy Score */}
              <div className="p-2 sm:p-3 bg-white/70 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Precisión Gramatical</span>
                  <span className={cn("text-xs sm:text-sm font-bold", getScoreColor(grammarAnalysis.feedback.accuracyScore))}>
                    {grammarAnalysis.feedback.accuracyScore}/100
                  </span>
                </div>
                <Progress 
                  value={grammarAnalysis.feedback.accuracyScore} 
                  className="h-1.5 sm:h-2"
                />
              </div>

              {/* Overall Feedback */}
              {grammarAnalysis.feedback.suggestion && (
                <div className="p-2 sm:p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                  <p className="text-xs sm:text-sm text-gray-700">
                    {grammarAnalysis.feedback.suggestion}
                  </p>
                </div>
              )}

              {/* Grammar Errors */}
              {grammarAnalysis.errors && grammarAnalysis.errors.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-700" />
                    <p className="text-[10px] sm:text-xs font-bold text-blue-900">
                      Errores Detectados ({grammarAnalysis.errors.length})
                    </p>
                  </div>
                  {grammarAnalysis.errors.slice(0, 3).map((error, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-2 sm:p-3 rounded-lg border",
                        severityColors[error.severity]
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {error.type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] h-4 sm:h-5">
                          {error.severity === 'low' && '⚠️'}
                          {error.severity === 'medium' && '⚠️⚠️'}
                          {error.severity === 'high' && '⚠️⚠️⚠️'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-[10px] sm:text-xs">
                          <span className="text-gray-600 font-medium">❌ Dijiste:</span>
                          <span className="ml-1.5 line-through">{error.original}</span>
                        </div>
                        <div className="text-[10px] sm:text-xs">
                          <span className="text-gray-600 font-medium">✅ Correcto:</span>
                          <span className="ml-1.5 font-semibold text-green-700">{error.correction}</span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600 mt-1.5 p-1.5 sm:p-2 bg-white/50 rounded flex items-start gap-1">
                          <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                          <span>{error.explanationSpanish || error.explanation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-300 shadow-sm">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-green-700 font-semibold">
                    ¡Excelente! No se detectaron errores gramaticales.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
