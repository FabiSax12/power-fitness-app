import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Select, SelectItem } from "@heroui/select"
import { DatePicker } from "@heroui/date-picker"
import { Link } from "@heroui/link"
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Weight,
  Calendar,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import { z } from 'zod'
import { parseDate } from '@internationalized/date'

// Tipos basados en la BD
interface RegisterData {
  cedula: string
  nombre: string
  apellido1: string
  apellido2: string
  genero_nombre: 'Masculino' | 'Femenino'
  contrasena: string
  correo: string
  fecha_nacimiento: string // YYYY-MM-DD format
  telefonos?: string[] // Array de números de teléfono
  nivel_fitness: string
  peso: number
}

interface RegisterResponse {
  message: string
  cliente: {
    cedula: string
    nombre: string
    correo: string
  }
}

// Validador de search params
const registerSearchSchema = {
  success: undefined as string | undefined,
}

export const Route = createFileRoute('/auth/registrar')({
  validateSearch: (search): typeof registerSearchSchema => ({
    success: z.string().optional().parse(search.success),
  }),
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.auth || {}
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RegisterPage,
})

// Función para llamada al API
const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await fetch('http://localhost:3000/api/clientes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Validadores
const validateCedula = (cedula: string) => {
  if (!cedula) return 'La cédula es requerida'
  const cedulaRegex = /^\d-\d{4}-\d{4}$/
  if (!cedulaRegex.test(cedula)) return 'Formato de cédula inválido (ej: 1-1234-5678)'
  return undefined
}

const validateNombre = (nombre: string) => {
  if (!nombre) return 'El nombre es requerido'
  if (nombre.length > 30) return 'El nombre no puede exceder 30 caracteres'
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) return 'El nombre solo puede contener letras y espacios'
  return undefined
}

const validateApellido = (apellido: string, campo: string) => {
  if (!apellido) return `${campo} es requerido`
  if (apellido.length > 30) return `${campo} no puede exceder 30 caracteres`
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(apellido)) return `${campo} solo puede contener letras y espacios`
  return undefined
}

const validateEmail = (email: string) => {
  if (!email) return 'El correo electrónico es requerido'
  if (email.length > 50) return 'El correo no puede exceder 50 caracteres'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Formato de correo electrónico inválido'
  return undefined
}

const validatePassword = (password: string) => {
  if (!password) return 'La contraseña es requerida'
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  if (password.length > 20) return 'La contraseña no puede exceder 20 caracteres'
  return undefined
}

const validateFechaNacimiento = (fecha: string) => {
  if (!fecha) return 'La fecha de nacimiento es requerida'

  const birthDate = new Date(fecha)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  if (age < 15) return 'Debe ser mayor de 15 años'
  if (age > 100) return 'Edad no válida'

  return undefined
}

const validateTelefonos = (telefonos: string) => {
  if (!telefonos.trim()) return undefined // Campo opcional

  const telefonosArray = telefonos.split(',').map(t => t.trim())
  const telefonoRegex = /^\d{8}$/

  for (const telefono of telefonosArray) {
    if (!telefonoRegex.test(telefono)) {
      return 'Todos los teléfonos deben tener 8 dígitos (ej: 88887777, 22334455)'
    }
  }

  if (telefonosArray.length > 3) {
    return 'Máximo 3 números de teléfono permitidos'
  }

  return undefined
}

const validatePeso = (peso: number) => {
  if (peso < 30 || peso > 300) return 'El peso debe estar entre 30 y 300 kg'
  return undefined
}

// Opciones para selects
const nivelesFITNESS = [
  { key: 'Principiante', label: 'Principiante' },
  { key: 'Intermedio', label: 'Intermedio' },
  { key: 'Avanzado', label: 'Avanzado' }
]

const generos = [
  { key: 'Masculino', label: 'Masculino' },
  { key: 'Femenino', label: 'Femenino' }
]

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

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { success } = Route.useSearch()

  // React Query mutation para registro
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Redirigir al login con mensaje de éxito
      navigate({
        to: '/auth/login',
        search: {
          error: undefined,
          redirect: undefined
        }
      })
    },
    onError: (error) => {
      console.error('Error de registro:', error)
    },
  })

  // TanStack Form
  const form = useForm({
    defaultValues: {
      cedula: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      genero_nombre: '' as 'Masculino' | 'Femenino',
      contrasena: '',
      correo: '',
      fecha_nacimiento: '',
      telefonos: '',
      nivel_fitness: 'Principiante',
      peso: 70.0,
    },
    onSubmit: async ({ value }) => {
      // Convertir fecha al formato requerido y procesar teléfonos
      const telefonosArray = value.telefonos.trim()
        ? value.telefonos.split(',').map(t => t.trim()).filter(t => t.length === 8)
        : undefined

      const submitData = {
        ...value,
        peso: Number(value.peso),
        telefonos: telefonosArray
      }

      await registerMutation.mutateAsync(submitData)
    },
  })

  const isFormValid =
    form.state.values.cedula &&
    form.state.values.nombre &&
    form.state.values.apellido1 &&
    form.state.values.apellido2 &&
    form.state.values.genero_nombre &&
    form.state.values.contrasena &&
    form.state.values.correo &&
    form.state.values.fecha_nacimiento &&
    !validateCedula(form.state.values.cedula) &&
    !validateNombre(form.state.values.nombre) &&
    !validateApellido(form.state.values.apellido1, 'El primer apellido') &&
    !validateApellido(form.state.values.apellido2, 'El segundo apellido') &&
    !validateEmail(form.state.values.correo) &&
    !validatePassword(form.state.values.contrasena) &&
    !validateFechaNacimiento(form.state.values.fecha_nacimiento) &&
    !validateTelefonos(form.state.values.telefonos) &&
    !validatePeso(form.state.values.peso)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Logo y Header */}
        <motion.div
          variants={logoVariants}
          className="text-center mb-8"
        >
          <img src="/pw-logo-perfil.png" alt="" className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full shadow-lg mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Power Fitness</h1>
          <p className="text-default-500">Crea tu cuenta para comenzar tu transformación</p>
        </motion.div>

        {/* Formulario de Registro */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-between w-full">
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary-600 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al login
              </Link>
              <h2 className="text-2xl font-semibold text-foreground">Crear Cuenta</h2>
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </CardHeader>

          <CardBody className="pt-2">
            {/* Mensaje de error de registro */}
            {registerMutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-danger-50 dark:bg-danger-50/10 border border-danger-200 dark:border-danger-800 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="h-5 w-5 text-danger" />
                <span className="text-danger text-sm font-medium">
                  {registerMutation.error?.message || 'Error al crear la cuenta'}
                </span>
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </h3>

                {/* Cédula */}
                <form.Field
                  name="cedula"
                  validators={{
                    onChange: (cedula) => validateCedula(cedula.value),
                  }}
                >
                  {(field) => (
                    <Input
                      type="text"
                      label="Cédula"
                      placeholder="1-1234-5678"
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                      onBlur={field.handleBlur}
                      startContent={<UserCheck className="h-4 w-4 text-default-400" />}
                      isRequired
                      classNames={{
                        input: "text-foreground",
                        inputWrapper: "bg-default-100/50"
                      }}
                      isDisabled={registerMutation.isPending}
                      isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                    />
                  )}
                </form.Field>

                {/* Grid para nombres */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <form.Field
                    name="nombre"
                    validators={{
                      onChange: (nombre) => validateNombre(nombre.value),
                    }}
                  >
                    {(field) => (
                      <Input
                        type="text"
                        label="Nombre"
                        placeholder="Tu nombre"
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        onBlur={field.handleBlur}
                        isRequired
                        classNames={{
                          input: "text-foreground",
                          inputWrapper: "bg-default-100/50"
                        }}
                        isDisabled={registerMutation.isPending}
                        isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                        errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                      />
                    )}
                  </form.Field>

                  {/* Género */}
                  <form.Field
                    name="genero_nombre"
                    validators={{
                      onChange: (genero) => !genero.value ? 'Selecciona un género' : undefined,
                    }}
                  >
                    {(field) => (
                      <Select
                        label="Género"
                        placeholder="Selecciona tu género"
                        selectedKeys={field.state.value ? [field.state.value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string
                          field.handleChange(selectedKey as 'Masculino' | 'Femenino')
                        }}
                        isRequired
                        classNames={{
                          trigger: "bg-default-100/50"
                        }}
                        isDisabled={registerMutation.isPending}
                        isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                        errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                      >
                        {generos.map((genero) => (
                          <SelectItem key={genero.key}>
                            {genero.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </form.Field>
                </div>

                {/* Grid para apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primer Apellido */}
                  <form.Field
                    name="apellido1"
                    validators={{
                      onChange: (apellido) => validateApellido(apellido.value, 'El primer apellido'),
                    }}
                  >
                    {(field) => (
                      <Input
                        type="text"
                        label="Primer Apellido"
                        placeholder="Tu primer apellido"
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        onBlur={field.handleBlur}
                        isRequired
                        classNames={{
                          input: "text-foreground",
                          inputWrapper: "bg-default-100/50"
                        }}
                        isDisabled={registerMutation.isPending}
                        isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                        errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                      />
                    )}
                  </form.Field>

                  {/* Segundo Apellido */}
                  <form.Field
                    name="apellido2"
                    validators={{
                      onChange: (apellido) => validateApellido(apellido.value, 'El segundo apellido'),
                    }}
                  >
                    {(field) => (
                      <Input
                        type="text"
                        label="Segundo Apellido"
                        placeholder="Tu segundo apellido"
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        onBlur={field.handleBlur}
                        isRequired
                        classNames={{
                          input: "text-foreground",
                          inputWrapper: "bg-default-100/50"
                        }}
                        isDisabled={registerMutation.isPending}
                        isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                        errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                      />
                    )}
                  </form.Field>
                </div>

                {/* Fecha de Nacimiento */}
                <form.Field
                  name="fecha_nacimiento"
                  validators={{
                    onChange: (fecha) => validateFechaNacimiento(fecha.value),
                  }}
                >
                  {(field) => (
                    <DatePicker
                      label="Fecha de Nacimiento"
                      value={field.state.value ? parseDate(field.state.value) : null}
                      onChange={(date) => field.handleChange(date ? date.toString() : '')}
                      startContent={<Calendar className="h-4 w-4 text-default-400" />}
                      isRequired
                      classNames={{
                        inputWrapper: "bg-default-100/50"
                      }}
                      isDisabled={registerMutation.isPending}
                      isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                      maxValue={parseDate(new Date().toISOString().split('T')[0])}
                    />
                  )}
                </form.Field>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Información de Contacto
                </h3>

                {/* Email */}
                <form.Field
                  name="correo"
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
                      isDisabled={registerMutation.isPending}
                      isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                    />
                  )}
                </form.Field>

                {/* Teléfonos */}
                <form.Field
                  name="telefonos"
                  validators={{
                    onChange: (telefonos) => validateTelefonos(telefonos.value),
                  }}
                >
                  {(field) => (
                    <Input
                      type="text"
                      label="Teléfonos (Opcional)"
                      placeholder="88887777, 22334455, 61234567"
                      description="Separa múltiples teléfonos con comas (máx. 3)"
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                      onBlur={field.handleBlur}
                      startContent={<Phone className="h-4 w-4 text-default-400" />}
                      classNames={{
                        input: "text-foreground",
                        inputWrapper: "bg-default-100/50"
                      }}
                      isDisabled={registerMutation.isPending}
                      isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                    />
                  )}
                </form.Field>

                {/* Contraseña */}
                <form.Field
                  name="contrasena"
                  validators={{
                    onChange: (password) => validatePassword(password.value),
                  }}
                >
                  {(field) => (
                    <Input
                      type={showPassword ? "text" : "password"}
                      label="Contraseña"
                      placeholder="Crea una contraseña segura"
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                      onBlur={field.handleBlur}
                      startContent={<Lock className="h-4 w-4 text-default-400" />}
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="focus:outline-none"
                          disabled={registerMutation.isPending}
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
                      isDisabled={registerMutation.isPending}
                      isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                      errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                    />
                  )}
                </form.Field>
              </div>

              {/* Información Física */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Weight className="h-5 w-5" />
                  Información Física
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nivel de Fitness */}
                  <form.Field name="nivel_fitness">
                    {(field) => (
                      <Select
                        label="Nivel de Fitness"
                        selectedKeys={[field.state.value]}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string
                          field.handleChange(selectedKey)
                        }}
                        classNames={{
                          trigger: "bg-default-100/50"
                        }}
                        isDisabled={registerMutation.isPending}
                      >
                        {nivelesFITNESS.map((nivel) => (
                          <SelectItem key={nivel.key}>
                            {nivel.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </form.Field>

                  {/* Peso */}
                  <form.Field
                    name="peso"
                    validators={{
                      onChange: (peso) => validatePeso(peso.value),
                    }}
                  >
                    {(field) => (
                      <Input
                        type="number"
                        label="Peso (kg)"
                        placeholder="70.0"
                        value={field.state.value.toString()}
                        onValueChange={(value) => field.handleChange(parseFloat(value) || 0)}
                        onBlur={field.handleBlur}
                        startContent={<Weight className="h-4 w-4 text-default-400" />}
                        classNames={{
                          input: "text-foreground",
                          inputWrapper: "bg-default-100/50"
                        }}
                        isDisabled={registerMutation.isPending}
                        isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                        errorMessage={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : ''}
                        min={30}
                        max={300}
                        step={0.1}
                      />
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Botón de Registro */}
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full font-semibold"
                    isDisabled={!isFormValid || isSubmitting || registerMutation.isPending}
                    onPress={() => form.handleSubmit()}
                    startContent={
                      registerMutation.isPending || isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )
                    }
                  >
                    {registerMutation.isPending || isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                )}
              </form.Subscribe>

              {/* Indicadores de validación */}
              <div className="text-xs text-default-400 space-y-1">
                <div className={`flex items-center gap-2 ${form.state.values.cedula && !validateCedula(form.state.values.cedula) ? 'text-success' : ''
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${form.state.values.cedula && !validateCedula(form.state.values.cedula) ? 'bg-success' : 'bg-default-300'
                    }`} />
                  Cédula válida
                </div>
                <div className={`flex items-center gap-2 ${form.state.values.correo && !validateEmail(form.state.values.correo) ? 'text-success' : ''
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${form.state.values.correo && !validateEmail(form.state.values.correo) ? 'bg-success' : 'bg-default-300'
                    }`} />
                  Correo electrónico válido
                </div>
                <div className={`flex items-center gap-2 ${form.state.values.contrasena && !validatePassword(form.state.values.contrasena) ? 'text-success' : ''
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${form.state.values.contrasena && !validatePassword(form.state.values.contrasena) ? 'bg-success' : 'bg-default-300'
                    }`} />
                  Contraseña de al menos 8 caracteres
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-default-500">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:text-primary-600"
            >
              Inicia sesión aquí
            </Link>
          </p>
          <p className="text-xs text-default-400 mt-4">
            © 2024 Power Fitness. Todos los derechos reservados.
          </p>
        </div>
      </motion.div>
    </div>
  )
}