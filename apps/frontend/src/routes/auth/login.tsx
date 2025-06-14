import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Checkbox } from "@heroui/checkbox"
import { Link } from "@heroui/link"
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Dumbbell,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { z } from 'zod'

// Tipos basados en la BD
interface User {
  cedula: string
  nombre: string
  apellido1: string
  apellido2: string
  tipo_usuario: 'cliente' | 'entrenador' | 'administrativo'
  correo: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: User
  message: string
}

// Validador de search params
const loginSearchSchema = {
  redirect: undefined as string | undefined,
  error: undefined as string | undefined,
}

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search): typeof loginSearchSchema => ({
    redirect: z.string().optional().parse(search.redirect),
    error: z.string().optional().parse(search.error),
  }),
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.auth || {}
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})

// Función para llamada al API
const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Validadores
const validateEmail = (email: string) => {
  if (!email) return 'El correo electrónico es requerido'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Formato de correo electrónico inválido'
  return undefined
}

const validatePassword = (password: string) => {
  if (!password) return 'La contraseña es requerida'
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  return undefined
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth, setRememberMe, rememberMe } = useAuthStore()
  const navigate = useNavigate()
  const { redirect, error: urlError } = Route.useSearch()

  // Mensajes de error desde URL
  const getUrlErrorMessage = (error: string) => {
    switch (error) {
      case 'invalid_user_type':
        return 'Tipo de usuario inválido. Por favor, contacta al administrador.'
      case 'session_expired':
        return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      case 'unauthorized':
        return 'No tienes permisos para acceder a esa página.'
      default:
        return 'Ha ocurrido un error. Por favor, inicia sesión nuevamente.'
    }
  }

  // React Query mutation para login
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.user, data.token)

      // Redirigir a la página solicitada o al dashboard
      const targetUrl = redirect || '/dashboard'
      navigate({ to: targetUrl })
    },
    onError: (error) => {
      console.error('Error de login:', error)
    },
  })

  // TanStack Form
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value)
    },
  })


  const isFormValid = form.state.values.email &&
    form.state.values.password &&
    !validateEmail(form.state.values.email) &&
    !validatePassword(form.state.values.password)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !loginMutation.isPending) {
      form.handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo y Header */}
        <motion.div
          variants={logoVariants}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-lg mb-4">
            <Dumbbell className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Power Fitness</h1>
          <p className="text-default-500">Ingresa a tu cuenta para continuar</p>
        </motion.div>

        {/* Formulario de Login */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <h2 className="text-2xl font-semibold text-foreground">Iniciar Sesión</h2>
          </CardHeader>

          <CardBody className="pt-2">
            {/* Mensaje de éxito */}
            {loginMutation.isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-success-50 dark:bg-success-50/10 border border-success-200 dark:border-success-800 rounded-lg flex items-center gap-2"
              >
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-success text-sm font-medium">
                  ¡Inicio de sesión exitoso! Redirigiendo...
                </span>
              </motion.div>
            )}

            {/* Mensaje de error de URL */}
            {urlError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-warning-50 dark:bg-warning-50/10 border border-warning-200 dark:border-warning-800 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="h-5 w-5 text-warning" />
                <span className="text-warning text-sm font-medium">
                  {getUrlErrorMessage(urlError)}
                </span>
              </motion.div>
            )}

            {/* Mensaje de error de login */}
            {loginMutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-danger-50 dark:bg-danger-50/10 border border-danger-200 dark:border-danger-800 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="h-5 w-5 text-danger" />
                <span className="text-danger text-sm font-medium">
                  {loginMutation.error?.message || 'Error de autenticación'}
                </span>
              </motion.div>
            )}

            {/* Mensaje de redirección */}
            {redirect && (
              <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-50/10 border border-primary-200 dark:border-primary-800 rounded-lg">
                <p className="text-primary text-sm">
                  Inicia sesión para acceder a la página solicitada
                </p>
              </div>
            )}

            <div className="space-y-6" onKeyDown={handleKeyPress}>
              {/* Campo de Email */}
              <form.Field
                name="email"
                validators={{
                  onChange: (email) => validateEmail(email.value),
                }}
              >
                {(field) => (
                  <Input
                    type="email"
                    label="Correo Electrónico"
                    placeholder="tu@email.com"
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    onBlur={field.handleBlur}
                    startContent={<Mail className="h-4 w-4 text-default-400" />}
                    isRequired
                    classNames={{
                      input: "text-foreground",
                      inputWrapper: "bg-default-100/50"
                    }}
                    isDisabled={loginMutation.isPending}
                    isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                    errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                  />
                )}
              </form.Field>

              {/* Campo de Contraseña */}
              <form.Field
                name="password"
                validators={{
                  onChange: (password) => validatePassword(password.value),
                }}
              >
                {(field) => (
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Contraseña"
                    placeholder="Ingresa tu contraseña"
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    onBlur={field.handleBlur}
                    startContent={<Lock className="h-4 w-4 text-default-400" />}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none"
                        disabled={loginMutation.isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-default-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-default-400" />
                        )}
                      </button>
                    }
                    isRequired
                    classNames={{
                      input: "text-foreground",
                      inputWrapper: "bg-default-100/50"
                    }}
                    isDisabled={loginMutation.isPending}
                    isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                    errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                  />
                )}
              </form.Field>

              {/* Opciones adicionales */}
              <div className="flex justify-between items-center">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={(checked) => setRememberMe(checked)}
                  size="sm"
                  classNames={{
                    label: "text-small text-default-500"
                  }}
                  isDisabled={loginMutation.isPending}
                >
                  Recordarme
                </Checkbox>

                <Link
                  href="/auth/forgot-password"
                  size="sm"
                  className="text-primary hover:text-primary-600"
                  isDisabled={loginMutation.isPending}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de Login */}
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {
                  ([canSubmit, isSubmitting]) => (
                    <Button
                      color="primary"
                      size="lg"
                      className="w-full font-semibold"
                      isDisabled={!canSubmit || isSubmitting || loginMutation.isPending}
                      onPress={() => form.handleSubmit()}
                      startContent={
                        loginMutation.isPending || isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Shield className="h-4 w-4" />
                        )
                      }
                    >
                      {loginMutation.isPending || isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                  )
                }
              </form.Subscribe>

              {/* Indicador de validación en tiempo real */}
              <div className="text-xs text-default-400 space-y-1">
                <div className={`flex items-center gap-2 ${form.state.values.email && !validateEmail(form.state.values.email) ? 'text-success' : ''
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${form.state.values.email && !validateEmail(form.state.values.email) ? 'bg-success' : 'bg-default-300'
                    }`} />
                  Correo electrónico válido
                </div>
                <div className={`flex items-center gap-2 ${form.state.values.password && !validatePassword(form.state.values.password) ? 'text-success' : ''
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${form.state.values.password && !validatePassword(form.state.values.password) ? 'bg-success' : 'bg-default-300'
                    }`} />
                  Contraseña de al menos 8 caracteres
                </div>
              </div>
            </div>

            {/* <Divider className="my-6" /> */}

            {/* Enlaces adicionales */}
            {/* <div className="text-center space-y-3">
              <p className="text-sm text-default-500">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/auth/register"
                  className="text-primary font-medium hover:text-primary-600"
                  isDisabled={loginMutation.isPending}
                >
                  Regístrate aquí
                </Link>
              </p>

              <div className="pt-4">
                <p className="text-xs text-default-400">
                  Al iniciar sesión, aceptas nuestros{' '}
                  <Link href="/terms" size="sm" className="text-primary">
                    Términos de Servicio
                  </Link>{' '}
                  y{' '}
                  <Link href="/privacy" size="sm" className="text-primary">
                    Política de Privacidad
                  </Link>
                </p>
              </div>
            </div> */}
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-default-400">
            © 2024 Power Fitness. Todos los derechos reservados.
          </p>
        </div>
      </motion.div>
    </div>
  )
}