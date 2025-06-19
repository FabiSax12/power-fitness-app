import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import { Button } from '@heroui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@heroui/drawer'
import { useDisclosure } from '@heroui/use-disclosure'
import { Input } from '@heroui/input'
import {
  Card,
  CardBody,
  CardHeader,
} from '@heroui/card'
import { Chip, } from '@heroui/chip'
import { Divider } from '@heroui/divider'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs'
import { Plus, Edit, Trash2, DollarSign, Calendar, Users } from 'lucide-react'
import { z } from 'zod'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'

// Tipos de datos
interface TipoMembresia {
  id: number
  nombre: string
  precio: number
  frecuencia: string
}

interface Frecuencia {
  id_frecuencia: number
  frecuencia: string
}

interface CreateTipoMembresiaRequest {
  nombre: string
  precio: number
  id_frecuencia: number
}

interface UpdateTipoMembresiaRequest extends CreateTipoMembresiaRequest {
  id: number
}

// Esquemas de validación
const tipoMembresiaSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(25, 'El nombre no puede exceder 25 caracteres'),
  precio: z.number()
    .min(0, 'El precio debe ser mayor a 0')
    .max(999999.99, 'El precio es demasiado alto'),
  id_frecuencia: z.number()
    .min(1, 'Debe seleccionar una frecuencia')
})

// API Functions
const api = {
  getTiposMembresia: async (): Promise<TipoMembresia[]> => {
    const response = await fetch('http://localhost:3000/api/membresias/tipos')
    if (!response.ok) throw new Error('Error al obtener tipos de membresía')
    const { data } = await response.json()
    return data
  },

  getFrecuencias: async (): Promise<Frecuencia[]> => {
    const response = await fetch('http://localhost:3000/api/membresias/frecuencias')
    if (!response.ok) throw new Error('Error al obtener frecuencias')
    return response.json()
  },

  createTipoMembresia: async (data: CreateTipoMembresiaRequest): Promise<TipoMembresia> => {
    const response = await fetch('http://localhost:3000/api/membresias/tipos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Error al crear tipo de membresía')
    return response.json()
  },

  updateTipoMembresia: async (data: UpdateTipoMembresiaRequest): Promise<TipoMembresia> => {
    const response = await fetch(`http://localhost:3000/api/membresias/tipos/${data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Error al actualizar tipo de membresía')
    return response.json()
  },

  deleteTipoMembresia: async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:3000/api/membresias/tipos/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error al eliminar tipo de membresía')
  }
}

export const Route = createFileRoute('/_authenticated/dashboard/admin/membresias/')({
  component: TiposMembresiaPage,
})

function TiposMembresiaPage() {
  const queryClient = useQueryClient()
  const [editingItem, setEditingItem] = useState<TipoMembresia | null>(null)
  const [deletingItem, setDeletingItem] = useState<TipoMembresia | null>(null)

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateOpenChange } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()

  // Queries
  const { data: tiposMembresia = [], isLoading, error } = useQuery({
    queryKey: ['tipos-membresia'],
    queryFn: api.getTiposMembresia
  })

  const { data: frecuencias = [] } = useQuery({
    queryKey: ['frecuencias'],
    queryFn: api.getFrecuencias
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: api.createTipoMembresia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-membresia'] })
      onCreateOpenChange()
    }
  })

  const updateMutation = useMutation({
    mutationFn: api.updateTipoMembresia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-membresia'] })
      onEditOpenChange()
      setEditingItem(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteTipoMembresia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-membresia'] })
      onDeleteOpenChange()
      setDeletingItem(null)
    }
  })

  // Event handlers
  const handleEdit = (item: TipoMembresia) => {
    setEditingItem(item)
    onEditOpen()
  }

  const handleDelete = (item: TipoMembresia) => {
    setDeletingItem(item)
    onDeleteOpen()
  }

  const handleConfirmDelete = () => {
    if (deletingItem) {
      deleteMutation.mutate(deletingItem.id)
    }
  }

  // Utility functions
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(price)

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'diaria': return 'warning'
      case 'semanal': return 'secondary'
      case 'mensual': return 'primary'
      case 'anual': return 'success'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-500">Cargando tipos de membresía...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <p className="text-danger mb-4">Error al cargar los datos</p>
            <Button
              color="primary"
              onPress={() => queryClient.invalidateQueries({ queryKey: ['tipos-membresia'] })}
            >
              Reintentar
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Breadcrumbs>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbItem>Admin</BreadcrumbItem>
          <BreadcrumbItem>Membresías</BreadcrumbItem>
          <BreadcrumbItem>Tipos</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tipos de Membresía</h1>
            <p className="text-default-500 mt-1">
              Gestiona los diferentes tipos de membresía disponibles
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Plus size={20} />}
            onPress={onCreateOpen}
          >
            Nuevo Tipo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-default-500 text-sm">Total Tipos</p>
              <p className="text-2xl font-bold">{tiposMembresia.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-default-500 text-sm">Precio Promedio</p>
              <p className="text-2xl font-bold">
                {tiposMembresia.length > 0
                  ? formatPrice(tiposMembresia.reduce((sum, t) => sum + t.precio, 0) / tiposMembresia.length)
                  : '₡0'
                }
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-default-500 text-sm">Frecuencias</p>
              <p className="text-2xl font-bold">{frecuencias.length}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Lista de Tipos de Membresía</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Tabla de tipos de membresía">
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>PRECIO</TableColumn>
              <TableColumn>FRECUENCIA</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No hay tipos de membresía registrados">
              {tiposMembresia.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell>
                    <div className="font-medium">{tipo.nombre}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-success">
                      {formatPrice(tipo.precio)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getFrequencyColor(tipo.frecuencia)}
                      variant="flat"
                      size="sm"
                    >
                      {tipo.frecuencia}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => handleEdit(tipo)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(tipo)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Create Drawer */}
      {
        isCreateOpen && <TipoMembresiaModal
          isOpen={isCreateOpen}
          onOpenChange={onCreateOpenChange}
          title="Crear Nuevo Tipo de Membresía"
          frecuencias={frecuencias}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      }

      {/* Edit Drawer */}
      {
        isEditOpen && <TipoMembresiaModal
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
          title="Editar Tipo de Membresía"
          frecuencias={frecuencias}
          initialData={editingItem}
          onSubmit={(data) => updateMutation.mutate({ ...data, id: editingItem!.id })}
          isLoading={updateMutation.isPending}
        />
      }

      {/* Delete Confirmation Drawer */}
      <Drawer isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>Confirmar Eliminación</DrawerHeader>
              <DrawerBody>
                <p>
                  ¿Estás seguro de que deseas eliminar el tipo de membresía{" "}
                  <strong>"{deletingItem?.nombre}"</strong>?
                </p>
                <p className="text-danger text-sm mt-2">
                  Esta acción no se puede deshacer y podría afectar a las membresías existentes.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={deleteMutation.isPending}
                >
                  Eliminar
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

// Componente reutilizable para el Drawer de crear/editar
interface TipoMembresiaModalProps {
  isOpen: boolean
  onOpenChange: () => void
  title: string
  frecuencias: Frecuencia[]
  initialData?: TipoMembresia | null
  onSubmit: (data: CreateTipoMembresiaRequest) => void
  isLoading: boolean
}

function TipoMembresiaModal({
  isOpen,
  onOpenChange,
  title,
  frecuencias,
  initialData,
  onSubmit,
  isLoading
}: TipoMembresiaModalProps) {
  console.log(initialData)


  const form = useForm({
    defaultValues: {
      nombre: initialData?.nombre || '',
      precio: initialData?.precio || 0,
      id_frecuencia: initialData ?
        frecuencias.find(f => f.frecuencia === initialData.frecuencia)?.id_frecuencia || 0
        : 0
    },
    onSubmit: async ({ value }) => {
      try {
        const validatedData = tipoMembresiaSchema.parse(value)
        onSubmit(validatedData)
      } catch (error) {
        console.error('Error de validación:', error)
      }
    },

  })

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      scrollBehavior="inside"
      backdrop="opaque"
      classNames={{
        wrapper: "z-[99999]",
        backdrop: "z-[99998]",
        base: "z-[99999]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <ModalHeader>{title}</ModalHeader>
            <ModalBody className="space-y-4">
              <form.Field
                name="nombre"
                validators={{
                  onChange: tipoMembresiaSchema.shape.nombre
                }}
              >
                {(field) => (
                  <Input
                    label="Nombre"
                    placeholder="Ej: Premium Mensual"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                  />
                )}
              </form.Field>

              <form.Field
                name="precio"
                validators={{
                  onChange: tipoMembresiaSchema.shape.precio
                }}
              >
                {(field) => (
                  <Input
                    label="Precio"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999.99"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">₡</span>
                      </div>
                    }
                    value={field.state.value.toString()}
                    onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                    onBlur={field.handleBlur}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                  />
                )}
              </form.Field>

              <form.Field
                name="id_frecuencia"
                validators={{
                  onChange: tipoMembresiaSchema.shape.id_frecuencia
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Frecuencia <span className="text-danger">*</span>
                    </label>
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                      onBlur={field.handleBlur}
                      className={`
                        w-full px-3 py-2 rounded-lg border-2 bg-default-100
                        focus:bg-default-50 focus:outline-none focus:border-primary
                        ${field.state.meta.errors.length > 0
                          ? 'border-danger text-danger'
                          : 'border-default-300 text-foreground'
                        }
                      `}
                    >
                      <option value="0" disabled>Selecciona una frecuencia</option>
                      {frecuencias.map((frecuencia) => (
                        <option
                          key={frecuencia.id_frecuencia}
                          value={frecuencia.id_frecuencia}
                        >
                          {frecuencia.frecuencia}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors.length > 0 && (
                      <span className="text-xs text-danger">
                        {field.state.meta.errors[0]?.message}
                      </span>
                    )}
                  </div>
                )}
              </form.Field>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
              >
                {initialData ? 'Actualizar' : 'Crear'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}