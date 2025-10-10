
'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Mail, Lock, User, UserPlus, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  // Función para calcular la fortaleza de la contraseña
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    
    // Longitud
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 10
    
    // Mayúsculas
    if (/[A-Z]/.test(password)) strength += 20
    
    // Minúsculas
    if (/[a-z]/.test(password)) strength += 20
    
    // Números
    if (/[0-9]/.test(password)) strength += 15
    
    // Caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) strength += 20
    
    return Math.min(strength, 100)
  }

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500'
    if (passwordStrength < 60) return 'bg-yellow-500'
    if (passwordStrength < 80) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength < 30) return 'Débil'
    if (passwordStrength < 60) return 'Regular'
    if (passwordStrength < 80) return 'Buena'
    return 'Excelente'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Calcular fortaleza si es el campo de contraseña
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive"
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error de validación",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario')
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Iniciando sesión...",
      })

      // Auto-login after successful registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }

    } catch (error: any) {
      toast({
        title: "Error en el registro",
        description: error.message || "Ocurrió un error inesperado.",
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Comienza tu transformación hacia el inglés fluido</p>
        </div>

        {/* Register Form */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-center">Únete a SpeaklyPlan</CardTitle>
            <CardDescription className="text-center">
              Crea tu cuenta gratuita para acceder al plan completo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
                
                {/* Indicador de fortaleza */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Fortaleza:</span>
                      </div>
                      <span className={`font-medium ${
                        passwordStrength < 30 ? 'text-red-600' :
                        passwordStrength < 60 ? 'text-yellow-600' :
                        passwordStrength < 80 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    
                    {/* Consejos de seguridad */}
                    <div className="text-xs text-gray-500 space-y-1 mt-2">
                      <p className="font-medium">Para una contraseña segura, incluye:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                          Al menos 8 caracteres
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                          Letras mayúsculas
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                          Letras minúsculas
                        </li>
                        <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                          Números
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                          Caracteres especiales (!@#$%^&*)
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  'Creando cuenta...'
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear Cuenta Gratuita
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
