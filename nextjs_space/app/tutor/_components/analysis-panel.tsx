
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, AlertCircle, Info, Volume2, BookOpen, 
  TrendingUp, Target, Lightbulb, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  if (!isVisible || (!grammarAnalysis && !pronunciationAnalysis)) {
    return null;
  }

  const severityColors = {
    low: 'text-blue-600 bg-blue-50 border-blue-200',
    medium: 'text-orange-600 bg-orange-50 border-orange-200',
    high: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
      {/* Pronunciation Analysis */}
      {pronunciationAnalysis && (
        <Card className="p-4 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Análisis de Pronunciación</h3>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Pronunciación</span>
                <span className="text-sm font-bold text-purple-600">
                  {pronunciationAnalysis.pronunciationScore}/100
                </span>
              </div>
              <Progress 
                value={pronunciationAnalysis.pronunciationScore} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Fluidez</span>
                <span className="text-sm font-bold text-purple-600">
                  {pronunciationAnalysis.fluencyScore}/100
                </span>
              </div>
              <Progress 
                value={pronunciationAnalysis.fluencyScore} 
                className="h-2"
              />
            </div>
          </div>

          {/* Overall Feedback */}
          <div className="p-3 bg-white rounded-lg border mb-3">
            <p className="text-sm text-gray-700 mb-1">
              {pronunciationAnalysis.overallFeedback}
            </p>
            {pronunciationAnalysis.overallFeedbackSpanish && (
              <p className="text-xs text-gray-500 italic">
                {pronunciationAnalysis.overallFeedbackSpanish}
              </p>
            )}
          </div>

          {/* Phoneme Errors */}
          {pronunciationAnalysis.phonemeErrors && pronunciationAnalysis.phonemeErrors.length > 0 && (
            <div className="space-y-2 mb-3">
              <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <Target className="h-3 w-3" />
                Errores de Fonemas:
              </p>
              {pronunciationAnalysis.phonemeErrors.map((error, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-2 rounded-lg border text-xs",
                    severityColors[error.severity]
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium">
                      "{error.word}" - /{error.phoneme}/
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {error.severity === 'low' && '⚠️'}
                      {error.severity === 'medium' && '⚠️⚠️'}
                      {error.severity === 'high' && '⚠️⚠️⚠️'}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-1">
                    ❌ {error.errorSpanish || error.error}
                  </p>
                  <p className="text-gray-900 font-medium">
                    ✅ {error.correctionSpanish || error.correction}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Strengths */}
          {pronunciationAnalysis.strengths && pronunciationAnalysis.strengths.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-green-700 flex items-center gap-1 mb-2">
                <Award className="h-3 w-3" />
                Fortalezas:
              </p>
              <div className="flex flex-wrap gap-2">
                {pronunciationAnalysis.strengths.map((strength, i) => (
                  <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {pronunciationAnalysis.suggestionsSpanish && pronunciationAnalysis.suggestionsSpanish.length > 0 && (
            <div>
              <p className="text-xs font-medium text-purple-700 flex items-center gap-1 mb-2">
                <Lightbulb className="h-3 w-3" />
                Sugerencias de Práctica:
              </p>
              <ul className="space-y-1">
                {pronunciationAnalysis.suggestionsSpanish.map((suggestion, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-1">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Grammar Analysis */}
      {grammarAnalysis && (
        <Card className="p-4 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Análisis Gramatical</h3>
          </div>

          {/* Accuracy Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Precisión Gramatical</span>
              <span className="text-sm font-bold text-blue-600">
                {grammarAnalysis.feedback.accuracyScore}/100
              </span>
            </div>
            <Progress 
              value={grammarAnalysis.feedback.accuracyScore} 
              className="h-2"
            />
          </div>

          {/* Overall Feedback */}
          {grammarAnalysis.feedback.suggestion && (
            <div className="p-3 bg-white rounded-lg border mb-3">
              <p className="text-sm text-gray-700">
                {grammarAnalysis.feedback.suggestion}
              </p>
            </div>
          )}

          {/* Grammar Errors */}
          {grammarAnalysis.errors && grammarAnalysis.errors.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Errores Detectados:
              </p>
              {grammarAnalysis.errors.map((error, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-3 rounded-lg border",
                    severityColors[error.severity]
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {error.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {error.severity === 'low' && '⚠️ Menor'}
                      {error.severity === 'medium' && '⚠️ Medio'}
                      {error.severity === 'high' && '⚠️ Importante'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-gray-600">❌ Dijiste:</span>
                      <span className="ml-2 font-medium line-through">{error.original}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">✅ Correcto:</span>
                      <span className="ml-2 font-medium text-green-700">{error.correction}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 p-2 bg-white/50 rounded">
                      <Info className="h-3 w-3 inline mr-1" />
                      {error.explanationSpanish || error.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">
                ¡Excelente! No se detectaron errores gramaticales.
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
