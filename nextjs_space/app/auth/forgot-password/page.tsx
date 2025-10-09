
'use client';

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        toast({
          title: "Email enviado",
          description: "Si tu email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Ocurrió un error inesperado.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu solicitud.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SpeaklyPlan</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600">
            No te preocupes, te ayudaremos a recuperarla
          </p>
        </div>

        {/* Form or Success Message */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-center">
              {submitted ? '✓ Solicitud enviada' : 'Restablecer contraseña'}
            </CardTitle>
            <CardDescription className="text-center">
              {submitted 
                ? 'Revisa tu bandeja de entrada' 
                : 'Ingresa tu email para recibir un enlace de restablecimiento'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar enlace de restablecimiento
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Email enviado exitosamente</p>
                    <p className="text-green-700">
                      Si existe una cuenta asociada a <strong>{email}</strong>, recibirás un email con instrucciones para restablecer tu contraseña.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Consejo:</strong> Revisa tu carpeta de spam si no recibes el email en unos minutos.
                  </p>
                </div>

                <Button 
                  onClick={() => setSubmitted(false)} 
                  variant="outline" 
                  className="w-full"
                >
                  Enviar a otro email
                </Button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">o</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  ¿Recordaste tu contraseña?{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                    Inicia sesión
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                    Regístrate
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
