import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs'
import {
  UserPlus,
  ArrowLeft,
  Save,
  Shield,
  Dumbbell,
  User
} from 'lucide-react'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'

export const Route = createFileRoute('/_authenticated/dashboard/admin/usuarios/crear')({
  component: RouteComponent,
})

// Esquemas de validación con Zod
const personaBaseSchema = z.object({
  cedula: z.string().regex(/^\d-\d{4}-\d{4}$/, 'Formato de cédula inválido (ej: 1-1234-5678)'),
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(30, 'Máximo 30 caracteres'),
  apellido1: z.string().min(2, 'Mínimo 2 caracteres').max(30, 'Máximo 30 caracteres'),
  apellido2: z.string().min(2, 'Mínimo 2 caracteres').max(30, 'Máximo 30 caracteres'),
  genero: z.enum(['Masculino', 'Femenino'], { errorMap: () => ({ message: 'Seleccione un género' }) }),
  contraseña: z.string().min(8, 'Mínimo 8 caracteres'),
  correo: z.string().email('Correo electrónico inválido'),
  fecha_nacimiento: z.string().refine((date) => {
    const birthDate = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    return age >= 15 && age <= 100
  }, 'Edad debe estar entre 15 y 100 años')
})

const clienteSchema = personaBaseSchema.extend({
  tipo_usuario: z.literal('cliente'),
  peso: z.number().min(30).max(300).optional(),
  nivel_fitness: z.enum(['Principiante', 'Intermedio', 'Avanzado']).optional()
})

const entrenadorSchema = personaBaseSchema.extend({
  tipo_usuario: z.literal('entrenador'),
  experiencia: z.string().max(255).optional()
})

const administrativoSchema = personaBaseSchema.extend({
  tipo_usuario: z.literal('administrativo'),
  id_cargo: z.enum(['1', '2', '3']).optional()
})

const userFormSchema = z.discriminatedUnion('tipo_usuario', [
  clienteSchema,
  entrenadorSchema,
  administrativoSchema
])

type UserFormData = z.infer<typeof userFormSchema>

const API_BASE_URL = 'http://localhost:3000/api'

// Servicio API
const usersService = {
  create: async (userData: UserFormData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al crear usuario')
    return data
  }
}

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Mutation para crear usuario
  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate({ to: '/dashboard/admin/usuarios' })
    },
    onError: (error) => {
      console.error('Error al crear usuario:', error)
    }
  })

  // Formulario con TanStack Form
  const form = useForm({
    defaultValues: {
      cedula: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      genero: 'Masculino',
      contraseña: '',
      correo: '',
      fecha_nacimiento: '',
      tipo_usuario: 'cliente',
      peso: 70,
      nivel_fitness: 'Principiante',
      experiencia: '',
      id_cargo: '1',
    } as UserFormData,
    validators: {
      onChange: userFormSchema,
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(value)
    },
  })

  const handleCancel = () => {
    navigate({ to: '/dashboard/admin/usuarios' })
  }

  const getUserTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'administrativo': return <Shield className="w-5 h-5 text-primary" />
      case 'entrenador': return <Dumbbell className="w-5 h-5 text-success" />
      case 'cliente': return <User className="w-5 h-5 text-secondary" />
      default: return <User className="w-5 h-5" />
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <BreadcrumbItem onPress={() => navigate({ to: '/dashboard/admin/usuarios' })}>
          Usuarios
        </BreadcrumbItem>
        <BreadcrumbItem>Crear Usuario</BreadcrumbItem>
      </Breadcrumbs>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="flat"
            onPress={handleCancel}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Crear Nuevo Usuario</h1>
              <p className="text-default-500">Complete la información para crear un nuevo usuario en el sistema</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mostrar errores si los hay */}
      {createMutation.error && (
        <Card className="border-danger-200 bg-danger-50">
          <CardBody>
            <p className="text-danger text-sm">
              Error al crear usuario: {createMutation.error.message}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Formulario */}
      <div className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Información Básica</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Cédula y Tipo de Usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="cedula"
                children={(field) => (
                  <Input
                    label="Cédula"
                    placeholder="1-1234-5678"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                    description="Formato: #-####-####"
                  />
                )}
              />
              <form.Field
                name="tipo_usuario"
                children={(field) => (
                  <Select
                    label="Tipo de Usuario"
                    placeholder="Seleccione el tipo de usuario"
                    selectedKeys={field.state.value ? [field.state.value as string] : []}
                    onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as any)}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                    startContent={getUserTypeIcon(field.state.value)}
                  >
                    <SelectItem key="cliente" startContent={<User className="w-4 h-4" />}>
                      Cliente
                    </SelectItem>
                    <SelectItem key="entrenador" startContent={<Dumbbell className="w-4 h-4" />}>
                      Entrenador
                    </SelectItem>
                    <SelectItem key="administrativo" startContent={<Shield className="w-4 h-4" />}>
                      Administrativo
                    </SelectItem>
                  </Select>
                )}
              />
            </div>

            {/* Nombres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form.Field
                name="nombre"
                children={(field) => (
                  <Input
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                  />
                )}
              />
              <form.Field
                name="apellido1"
                children={(field) => (
                  <Input
                    label="Primer Apellido"
                    placeholder="Primer apellido"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                  />
                )}
              />
              <form.Field
                name="apellido2"
                children={(field) => (
                  <Input
                    label="Segundo Apellido"
                    placeholder="Segundo apellido"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                  />
                )}
              />
            </div>

            {/* Contacto y Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="correo"
                children={(field) => (
                  <Input
                    label="Correo Electrónico"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                  />
                )}
              />
              <form.Field
                name="genero"
                children={(field) => (
                  <Select
                    label="Género"
                    placeholder="Seleccione el género"
                    selectedKeys={[field.state.value]}
                    onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as any)}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                  >
                    <SelectItem key="Masculino">Masculino</SelectItem>
                    <SelectItem key="Femenino">Femenino</SelectItem>
                  </Select>
                )}
              />
            </div>

            {/* Seguridad y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="contraseña"
                children={(field) => (
                  <Input
                    label="Contraseña"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                    description="Debe tener al menos 8 caracteres"
                  />
                )}
              />
              <form.Field
                name="fecha_nacimiento"
                children={(field) => (
                  <Input
                    label="Fecha de Nacimiento"
                    type="date"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                    description="Edad entre 15 y 100 años"
                  />
                )}
              />
            </div>
          </CardBody>
        </Card>

        {/* Información Específica por Tipo */}
        <form.Subscribe
          selector={(state) => state.values.tipo_usuario}
          children={(tipoUsuario) => (
            <>
              {tipoUsuario === 'cliente' && (
                <Card>
                  <CardHeader className="flex items-center gap-2">
                    <User className="w-5 h-5 text-secondary" />
                    <h2 className="text-xl font-semibold">Información del Cliente</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field
                        name="peso"
                        children={(field) => (
                          <Input
                            label="Peso (kg)"
                            type="number"
                            placeholder="70"
                            value={String(field.state.value)}
                            onValueChange={(value) => field.handleChange(Number(value) || 70)}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]?.message}
                            min={30}
                            max={300}
                            description="Peso entre 30kg y 300kg"
                            endContent={<span className="text-default-400 text-small">kg</span>}
                          />
                        )}
                      />
                      <form.Field
                        name="nivel_fitness"
                        children={(field) => (
                          <Select
                            label="Nivel de Fitness"
                            placeholder="Seleccione el nivel"
                            selectedKeys={field.state.value ? [field.state.value] : []}
                            onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as any)}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]?.message}
                            description="Nivel de experiencia en ejercicio"
                          >
                            <SelectItem key="Principiante">Principiante</SelectItem>
                            <SelectItem key="Intermedio">Intermedio</SelectItem>
                            <SelectItem key="Avanzado">Avanzado</SelectItem>
                          </Select>
                        )}
                      />
                    </div>
                  </CardBody>
                </Card>
              )}

              {tipoUsuario === 'entrenador' && (
                <Card>
                  <CardHeader className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-success" />
                    <h2 className="text-xl font-semibold">Información del Entrenador</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <form.Field
                      name="experiencia"
                      children={(field) => (
                        <Input
                          label="Experiencia Profesional"
                          placeholder="Ej: 5 años en entrenamiento personalizado, especialista en fuerza..."
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          isInvalid={field.state.meta.errors.length > 0}
                          errorMessage={field.state.meta.errors[0]?.message}
                          description="Describa la experiencia, certificaciones y especialidades"
                        />
                      )}
                    />
                  </CardBody>
                </Card>
              )}

              {tipoUsuario === 'administrativo' && (
                <Card>
                  <CardHeader className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Información Administrativa</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="max-w-md">
                      <form.Field
                        name="id_cargo"
                        children={(field) => (
                          <Select
                            label="Cargo"
                            placeholder="Seleccione el cargo"
                            selectedKeys={field.state.value ? [field.state.value] : []}
                            onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as any)}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]?.message}
                            description="Posición en la organización"
                          >
                            <SelectItem key="1">Gerente General</SelectItem>
                            <SelectItem key="2">Recepcionista</SelectItem>
                            <SelectItem key="3">Limpieza</SelectItem>
                          </Select>
                        )}
                      />
                    </div>
                  </CardBody>
                </Card>
              )}
            </>
          )}
        />

        {/* Botones de Acción */}
        <Card>
          <CardBody>
            <div className="flex justify-end gap-3">
              <Button
                variant="flat"
                onPress={handleCancel}
                isDisabled={createMutation.isPending}
              >
                Cancelar
              </Button>
              <form.Subscribe
                selector={(state) => state.canSubmit}
                children={(canSubmit) => (
                  <Button
                    color="primary"
                    isLoading={createMutation.isPending}
                    isDisabled={!canSubmit}
                    startContent={!createMutation.isPending && <Save className="w-4 h-4" />}
                    onPress={form.handleSubmit}
                  >
                    {createMutation.isPending ? 'Creando Usuario...' : 'Crear Usuario'}
                  </Button>
                )}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}