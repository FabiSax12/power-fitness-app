import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Shield,
  Dumbbell,
  User,
  MoreVertical,
  Filter
} from 'lucide-react'
import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Divider } from '@heroui/divider'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { Input } from '@heroui/input'
import { Pagination } from '@heroui/pagination'
import { Select, SelectItem } from '@heroui/select'
import { Table, TableHeader, TableColumn, TableRow, TableCell, TableBody } from '@heroui/table'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal'
import { Spinner } from '@heroui/spinner'

export const Route = createFileRoute('/_authenticated/dashboard/admin/usuarios/')({
  component: RouteComponent,
})

// Esquemas de validación con Zod
const personaBaseSchema = z.object({
  cedula: z.string().regex(/^\d-\d{4}-\d{4}$/, 'Formato de cédula inválido (ej: 1-1234-5678)'),
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(30, 'Máximo 30 caracteres'),
  apellido1: z.string().min(2, 'Mínimo 2 caracteres').max(30, 'Máximo 30 caracteres'),
  apellido2: z.string().min(2, 'Mínimo 2 caracteres').max(30, 'Máximo 30 caracteres'),
  genero: z.enum(['1', '2', '3'], { errorMap: () => ({ message: 'Seleccione un género' }) }),
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
  id_nivel_fitness: z.enum(['1', '2', '3']).optional()
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

// Tipos de datos
interface Persona {
  cedula: string
  nombre: string
  apellido1: string
  apellido2: string
  genero: number
  contraseña: string
  correo: string
  fecha_registro: string
  fecha_nacimiento: string
}

interface Administrativo extends Persona {
  id_cargo: number
  tipo: 'administrativo'
}

interface Cliente extends Persona {
  id_nivel_fitness: number
  estado: boolean
  peso: number
  tipo: 'cliente'
}

interface Entrenador extends Persona {
  experiencia: string
  tipo: 'entrenador'
}

type Usuario = Administrativo | Cliente | Entrenador

interface UsersResponse {
  data: {
    administrativos: Omit<Administrativo, 'tipo'>[]
    clientes: Omit<Cliente, 'tipo'>[]
    entrenadores: Omit<Entrenador, 'tipo'>[]
  }
}

const API_BASE_URL = 'http://localhost:3000/api'

// Servicios API
const usersService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) throw new Error('Error al cargar usuarios')

    const result: UsersResponse = await response.json()

    return [
      ...result.data.administrativos.map(u => ({ ...u, tipo: 'administrativo' as const })),
      ...result.data.clientes.map(u => ({ ...u, tipo: 'cliente' as const })),
      ...result.data.entrenadores.map(u => ({ ...u, tipo: 'entrenador' as const }))
    ]
  },

  create: async (userData: UserFormData): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Error al crear usuario')
    return response.json()
  },

  update: async (cedula: string, userData: Partial<UserFormData>): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/users/${cedula}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Error al actualizar usuario')
    return response.json()
  },

  delete: async (cedula: string, tipo: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${cedula}?tipo=${tipo}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error al eliminar usuario')
  }
}

// Componente principal
function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [modalMode, setModalMode] = useState<'edit' | 'view'>('edit')
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUserType, setSelectedUserType] = useState<string>('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Queries
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ cedula, data }: { cedula: string; data: Partial<UserFormData> }) =>
      usersService.update(cedula, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ({ cedula, tipo }: { cedula: string; tipo: string }) =>
      usersService.delete(cedula, tipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  // Formulario con TanStack Form
  const form = useForm({
    defaultValues: {
      cedula: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      genero: '1' as const,
      contraseña: '',
      correo: '',
      fecha_nacimiento: '',
      tipo_usuario: 'cliente' as const,
      peso: 70,
      id_nivel_fitness: '1' as const,
      experiencia: '',
      id_cargo: '1' as const,
    } satisfies UserFormData,
    validators: {
      // onChange: userFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (modalMode === 'create') {
        await createMutation.mutateAsync(value)
      } else if (modalMode === 'edit' && selectedUser) {
        await updateMutation.mutateAsync({
          cedula: selectedUser.cedula,
          data: value
        })
      }
    },
  })

  // Datos filtrados y paginados
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm ||
        `${user.nombre} ${user.apellido1} ${user.apellido2}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cedula.includes(searchTerm) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedUserType === 'todos' || user.tipo === selectedUserType

      return matchesSearch && matchesType
    })
  }, [users, searchTerm, selectedUserType])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  // Estadísticas
  const stats = useMemo(() => {
    const administrativos = users.filter(u => u.tipo === 'administrativo').length
    const clientes = users.filter(u => u.tipo === 'cliente').length
    const entrenadores = users.filter(u => u.tipo === 'entrenador').length

    return {
      total: users.length,
      administrativos,
      clientes,
      entrenadores
    }
  }, [users])

  // Handlers
  const openModal = (mode: 'create' | 'edit' | 'view', user?: Usuario) => {
    setModalMode(mode)
    setSelectedUser(user || null)

    if (mode === 'edit' && user) {
      form.setFieldValue('cedula', user.cedula)
      form.setFieldValue('nombre', user.nombre)
      form.setFieldValue('apellido1', user.apellido1)
      form.setFieldValue('apellido2', user.apellido2)
      form.setFieldValue('genero', String(user.genero) as '1' | '2' | '3')
      form.setFieldValue('correo', user.correo)
      form.setFieldValue('fecha_nacimiento', user.fecha_nacimiento)
      form.setFieldValue('tipo_usuario', user.tipo)

      if (user.tipo === 'cliente') {
        form.setFieldValue('peso', user.peso)
        form.setFieldValue('id_nivel_fitness', String(user.id_nivel_fitness) as '1' | '2' | '3')
      } else if (user.tipo === 'entrenador') {
        form.setFieldValue('experiencia', user.experiencia || '')
      } else if (user.tipo === 'administrativo') {
        form.setFieldValue('id_cargo', String(user.id_cargo) as '1' | '2' | '3')
      }
    } else if (mode === 'create') {
      form.reset()
    }

    onOpen()
  }

  const handleDelete = async (user: Usuario) => {
    if (confirm(`¿Está seguro de que desea eliminar a ${user.nombre} ${user.apellido1}?`)) {
      await deleteMutation.mutateAsync({ cedula: user.cedula, tipo: user.tipo })
    }
  }

  const getUserIcon = (tipo: string) => {
    switch (tipo) {
      case 'administrativo': return <Shield className="w-4 h-4" />
      case 'entrenador': return <Dumbbell className="w-4 h-4" />
      case 'cliente': return <User className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getUserChipColor = (tipo: string) => {
    switch (tipo) {
      case 'administrativo': return 'primary'
      case 'entrenador': return 'success'
      case 'cliente': return 'secondary'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <p className="text-danger">Error al cargar usuarios: {error.message}</p>
            <Button color="primary" variant="flat" onPress={() => refetch()} className="mt-4">
              Reintentar
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-default-500">Administra administrativos, clientes y entrenadores</p>
          </div>
        </div>
        <Button
          color="primary"
          onPress={() => navigate({ to: '/dashboard/admin/usuarios/crear'})}
          startContent={<Plus className="w-4 h-4" />}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center gap-3">
            <Avatar icon={<Users />} className="bg-default-100" />
            <div>
              <p className="text-small text-default-500">Total</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3">
            <Avatar icon={<Shield />} className="bg-primary-100" />
            <div>
              <p className="text-small text-default-500">Administrativos</p>
              <p className="text-xl font-semibold">{stats.administrativos}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3">
            <Avatar icon={<User />} className="bg-secondary-100" />
            <div>
              <p className="text-small text-default-500">Clientes</p>
              <p className="text-xl font-semibold">{stats.clientes}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3">
            <Avatar icon={<Dumbbell />} className="bg-success-100" />
            <div>
              <p className="text-small text-default-500">Entrenadores</p>
              <p className="text-xl font-semibold">{stats.entrenadores}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por nombre, cédula o correo..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<Search className="w-4 h-4 text-default-400" />}
              className="flex-1"
            />
            <Select
              placeholder="Filtrar por tipo"
              selectedKeys={[selectedUserType]}
              onSelectionChange={(keys) => setSelectedUserType(Array.from(keys)[0] as string)}
              startContent={<Filter className="w-4 h-4" />}
              className="w-full sm:w-48"
            >
              <SelectItem key="todos">Todos los tipos</SelectItem>
              <SelectItem key="administrativo">Administrativos</SelectItem>
              <SelectItem key="cliente">Clientes</SelectItem>
              <SelectItem key="entrenador">Entrenadores</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Tabla */}
      <Card>
        <CardBody className="p-0">
          <Table aria-label="Tabla de usuarios">
            <TableHeader>
              <TableColumn>Usuario</TableColumn>
              <TableColumn>Tipo</TableColumn>
              <TableColumn>Correo</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Registro</TableColumn>
              <TableColumn width={50}>Acciones</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No se encontraron usuarios">
              {paginatedUsers.map((user) => (
                <TableRow key={`${user.tipo}-${user.cedula}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        icon={getUserIcon(user.tipo)}
                        className="bg-default-100"
                        size="sm"
                      />
                      <div>
                        <p className="font-medium">{user.nombre} {user.apellido1} {user.apellido2}</p>
                        <p className="text-small text-default-500">{user.cedula}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getUserChipColor(user.tipo)}
                      variant="flat"
                      size="sm"
                      startContent={getUserIcon(user.tipo)}
                    >
                      {user.tipo}
                    </Chip>
                  </TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>
                    <Chip
                      color={user.tipo === 'cliente' && !user.estado ? 'danger' : 'success'}
                      variant="flat"
                      size="sm"
                    >
                      {user.tipo === 'cliente' ? (user.estado ? 'Activo' : 'Inactivo') : 'Activo'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {new Date(user.fecha_registro).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="view"
                          startContent={<Eye className="w-4 h-4" />}
                          onPress={() => openModal('view', user)}
                        >
                          Ver detalles
                        </DropdownItem>
                        <DropdownItem
                          key="edit"
                          startContent={<Edit2 className="w-4 h-4" />}
                          onPress={() => openModal('edit', user)}
                        >
                          Editar
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<Trash2 className="w-4 h-4" />}
                          onPress={() => handleDelete(user)}
                        >
                          Eliminar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            showShadow
          />
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {modalMode === 'edit' && 'Editar Usuario'}
                {modalMode === 'view' && 'Detalles del Usuario'}
              </ModalHeader>
              <ModalBody>
                {modalMode === 'view' && selectedUser ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-small text-default-500">Nombre completo</p>
                        <p className="font-medium">{selectedUser.nombre} {selectedUser.apellido1} {selectedUser.apellido2}</p>
                      </div>
                      <div>
                        <p className="text-small text-default-500">Cédula</p>
                        <p className="font-medium">{selectedUser.cedula}</p>
                      </div>
                      <div>
                        <p className="text-small text-default-500">Correo</p>
                        <p className="font-medium">{selectedUser.correo}</p>
                      </div>
                      <div>
                        <p className="text-small text-default-500">Tipo</p>
                        <Chip color={getUserChipColor(selectedUser.tipo)} variant="flat" size="sm">
                          {selectedUser.tipo}
                        </Chip>
                      </div>
                      <div>
                        <p className="text-small text-default-500">Fecha de Registro</p>
                        <p className="font-medium">{new Date(selectedUser.fecha_registro).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-small text-default-500">Fecha de Nacimiento</p>
                        <p className="font-medium">{new Date(selectedUser.fecha_nacimiento).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {selectedUser.tipo === 'cliente' && (
                      <>
                        <Divider />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-small text-default-500">Peso</p>
                            <p className="font-medium">{selectedUser.peso} kg</p>
                          </div>
                          <div>
                            <p className="text-small text-default-500">Estado</p>
                            <Chip color={selectedUser.estado ? 'success' : 'danger'} variant="flat" size="sm">
                              {selectedUser.estado ? 'Activo' : 'Inactivo'}
                            </Chip>
                          </div>
                        </div>
                      </>
                    )}
                    {selectedUser.tipo === 'entrenador' && selectedUser.experiencia && (
                      <>
                        <Divider />
                        <div>
                          <p className="text-small text-default-500">Experiencia</p>
                          <p className="font-medium">{selectedUser.experiencia}</p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      form.handleSubmit()
                    }}
                    className="space-y-4"
                  >
                    {/* Información básica */}
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
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
                            isDisabled={modalMode === 'edit'}
                          />
                        )}
                      />
                      <form.Field
                        name="tipo_usuario"
                        children={(field) => (
                          <Select
                            label="Tipo de Usuario"
                            selectedKeys={[field.state.value]}
                            onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as any)}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
                            isDisabled={modalMode === 'edit'}
                          >
                            <SelectItem key="cliente">Cliente</SelectItem>
                            <SelectItem key="entrenador">Entrenador</SelectItem>
                            <SelectItem key="administrativo">Administrativo</SelectItem>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <form.Field
                        name="nombre"
                        children={(field) => (
                          <Input
                            label="Nombre"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
                          />
                        )}
                      />
                      <form.Field
                        name="apellido1"
                        children={(field) => (
                          <Input
                            label="Primer Apellido"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
                          />
                        )}
                      />
                      <form.Field
                        name="apellido2"
                        children={(field) => (
                          <Input
                            label="Segundo Apellido"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field
                        name="correo"
                        children={(field) => (
                          <Input
                            label="Correo Electrónico"
                            type="email"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
                          />
                        )}
                      />
                      <form.Field
                        name="genero"
                        children={(field) => (
                          <Select
                            label="Género"
                            selectedKeys={[field.state.value]}
                            onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as any)}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
                          >
                            <SelectItem key="1">Masculino</SelectItem>
                            <SelectItem key="2">Femenino</SelectItem>
                            <SelectItem key="3">Otro</SelectItem>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field
                        name="contraseña"
                        children={(field) => (
                          <Input
                            label="Contraseña"
                            type="password"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            isInvalid={field.state.meta.errors.length > 0}
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
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
                            errorMessage={field.state.meta.errors[0]}
                            isRequired
                          />
                        )}
                      />
                    </div>

                    {/* Campos específicos por tipo de usuario */}
                    <form.Subscribe
                      selector={(state) => state.values.tipo_usuario}
                      children={(tipoUsuario) => (
                        <>
                          {tipoUsuario === 'cliente' && (
                            <>
                              <Divider />
                              <h3 className="text-lg font-semibold">Información del Cliente</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <form.Field
                                  name="peso"
                                  children={(field) => (
                                    <Input
                                      label="Peso (kg)"
                                      type="number"
                                      value={String(field.state.value)}
                                      onValueChange={(value) => field.handleChange(Number(value) || 70)}
                                      isInvalid={field.state.meta.errors.length > 0}
                                      errorMessage={field.state.meta.errors[0]}
                                      min={30}
                                      max={300}
                                    />
                                  )}
                                />
                                <form.Field
                                  name="id_nivel_fitness"
                                  children={(field) => (
                                    <Select
                                      label="Nivel de Fitness"
                                      selectedKeys={[field.state.value]}
                                      onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as any)}
                                      isInvalid={field.state.meta.errors.length > 0}
                                      errorMessage={field.state.meta.errors[0]}
                                    >
                                      <SelectItem key="1">Principiante</SelectItem>
                                      <SelectItem key="2">Intermedio</SelectItem>
                                      <SelectItem key="3">Avanzado</SelectItem>
                                    </Select>
                                  )}
                                />
                              </div>
                            </>
                          )}

                          {tipoUsuario === 'entrenador' && (
                            <>
                              <Divider />
                              <h3 className="text-lg font-semibold">Información del Entrenador</h3>
                              <form.Field
                                name="experiencia"
                                children={(field) => (
                                  <Input
                                    label="Experiencia"
                                    placeholder="Describe la experiencia profesional..."
                                    value={field.state.value}
                                    onValueChange={field.handleChange}
                                    isInvalid={field.state.meta.errors.length > 0}
                                    errorMessage={field.state.meta.errors[0]}
                                  />
                                )}
                              />
                            </>
                          )}

                          {tipoUsuario === 'administrativo' && (
                            <>
                              <Divider />
                              <h3 className="text-lg font-semibold">Información Administrativa</h3>
                              <form.Field
                                name="id_cargo"
                                children={(field) => (
                                  <Select
                                    label="Cargo"
                                    selectedKeys={[field.state.value]}
                                    onSelectionChange={(keys) => field.handleChange(Array.from(keys)[0] as any)}
                                    isInvalid={field.state.meta.errors.length > 0}
                                    errorMessage={field.state.meta.errors[0]}
                                    className="max-w-xs"
                                  >
                                    <SelectItem key="1">Gerente General</SelectItem>
                                    <SelectItem key="2">Recepcionista</SelectItem>
                                    <SelectItem key="3">Limpieza</SelectItem>
                                  </Select>
                                )}
                              />
                            </>
                          )}
                        </>
                      )}
                    />
                  </form>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
                </Button>
                {modalMode !== 'view' && (
                  <Button
                    color="primary"
                    onPress={form.handleSubmit}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                    isDisabled={!form.state.canSubmit}
                  >
                    {'Guardar Cambios'}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}