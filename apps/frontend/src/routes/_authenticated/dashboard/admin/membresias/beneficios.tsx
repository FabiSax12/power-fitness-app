import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Plus, Edit, Trash2, Gift, Users, Settings, Eye, Badge, } from 'lucide-react'
import { z } from 'zod'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { CheckboxGroup, Checkbox } from '@heroui/checkbox'
import { Chip } from '@heroui/chip'
import { Divider } from '@heroui/divider'
import { Input } from '@heroui/input'
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { TableHeader, TableColumn, TableBody, TableRow, TableCell, Table } from '@heroui/table'
import { Tab, Tabs } from '@heroui/tabs'
import React from 'react'

// Tipos de datos
interface Beneficio {
  id: number
  nombre: string
  cantidad_tipos_membresia?: number
}

interface TipoMembresia {
  id: number
  nombre: string
  precio: number
  frecuencia: string
  beneficios?: string[] // Nombres de beneficios incluidos
  cantidad_beneficios?: number
}

interface BeneficioAsignacion {
  id_beneficio: number
  id_tipo_membresia: number
  nombre_beneficio: string
  nombre_tipo: string
}

interface CreateBeneficioRequest {
  nombre: string
  descripcion?: string
}

interface UpdateBeneficioRequest extends CreateBeneficioRequest {
  id: number
}

interface AsignarBeneficiosRequest {
  id_tipo_membresia: number
  beneficios_ids: number[]
}

// Esquemas de validación
const beneficioSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(30, 'El nombre no puede exceder 30 caracteres')
})

// API Functions
const api = {
  // Beneficios
  getBeneficios: async (): Promise<Beneficio[]> => {
    const response = await fetch('http://localhost:3000/api/beneficios')
    if (!response.ok) throw new Error('Error al obtener beneficios')
    const result = await response.json()
    return result.data || result
  },

  createBeneficio: async (data: CreateBeneficioRequest): Promise<Beneficio> => {
    const response = await fetch('http://localhost:3000/api/beneficios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Error al crear beneficio')
    const result = await response.json()
    return result.data
  },

  updateBeneficio: async (data: UpdateBeneficioRequest): Promise<Beneficio> => {
    const response = await fetch(`http://localhost:3000/api/beneficios/${data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Error al actualizar beneficio')
    const result = await response.json()
    return result.data
  },

  deleteBeneficio: async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:3000/api/beneficios/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error al eliminar beneficio')
  },

  // Tipos de membresía con beneficios
  getTiposMembresia: async (): Promise<TipoMembresia[]> => {
    const response = await fetch('http://localhost:3000/api/membresias/tipos')
    if (!response.ok) throw new Error('Error al obtener tipos de membresía')
    const result = await response.json()
    return result.data || result
  },

  // Asignaciones
  getAsignaciones: async (): Promise<BeneficioAsignacion[]> => {
    const response = await fetch('http://localhost:3000/api/beneficios/asignaciones')
    if (!response.ok) throw new Error('Error al obtener asignaciones')
    const result = await response.json()
    return result.data || result
  },

  asignarBeneficios: async (data: AsignarBeneficiosRequest): Promise<void> => {
    const response = await fetch(`http://localhost:3000/api/membresias/tipos/${data.id_tipo_membresia}/beneficios`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beneficios_ids: data.beneficios_ids })
    })
    if (!response.ok) throw new Error('Error al asignar beneficios')
  },

  getBeneficiosPorTipo: async (tipoId: number): Promise<{ id: number, nombre: string }[]> => {
    const response = await fetch(`http://localhost:3000/api/membresias/tipos/${tipoId}/beneficios`)
    if (!response.ok) throw new Error('Error al obtener beneficios del tipo')
    const result = await response.json()
    return result.data || result
  }
}

export const Route = createFileRoute('/_authenticated/dashboard/admin/membresias/beneficios')({
  component: BeneficiosPage,
})

function BeneficiosPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('beneficios')
  const [editingBeneficio, setEditingBeneficio] = useState<Beneficio | null>(null)
  const [deletingBeneficio, setDeletingBeneficio] = useState<Beneficio | null>(null)
  const [assigningTipo, setAssigningTipo] = useState<TipoMembresia | null>(null)

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateOpenChange } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()
  const { isOpen: isAssignOpen, onOpen: onAssignOpen, onOpenChange: onAssignOpenChange } = useDisclosure()

  // Queries
  const { data: beneficios = [], isLoading: loadingBeneficios } = useQuery({
    queryKey: ['beneficios'],
    queryFn: api.getBeneficios
  })

  const { data: tiposMembresia = [], isLoading: loadingTipos } = useQuery({
    queryKey: ['tipos-membresia-beneficios'],
    queryFn: api.getTiposMembresia
  })

  const { data: asignaciones = [] } = useQuery({
    queryKey: ['asignaciones-beneficios'],
    queryFn: api.getAsignaciones
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: api.createBeneficio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['tipos-membresia-beneficios'] })
      onCreateOpenChange()
    }
  })

  const updateMutation = useMutation({
    mutationFn: api.updateBeneficio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['tipos-membresia-beneficios'] })
      onEditOpenChange()
      setEditingBeneficio(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteBeneficio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['tipos-membresia-beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['asignaciones-beneficios'] })
      onDeleteOpenChange()
      setDeletingBeneficio(null)
    }
  })

  const assignMutation = useMutation({
    mutationFn: api.asignarBeneficios,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-membresia-beneficios'] })
      queryClient.invalidateQueries({ queryKey: ['asignaciones-beneficios'] })
      onAssignOpenChange()
      setAssigningTipo(null)
    }
  })

  // Event handlers
  const handleEditBeneficio = (beneficio: Beneficio) => {
    setEditingBeneficio(beneficio)
    onEditOpen()
  }

  const handleDeleteBeneficio = (beneficio: Beneficio) => {
    setDeletingBeneficio(beneficio)
    onDeleteOpen()
  }

  const handleAssignBeneficios = (tipo: TipoMembresia) => {
    setAssigningTipo(tipo)
    onAssignOpen()
  }

  const handleConfirmDelete = () => {
    if (deletingBeneficio) {
      deleteMutation.mutate(deletingBeneficio.id)
    }
  }

  // Utility functions
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(price)

  const getBeneficioColor = (cantidad: number) => {
    if (cantidad >= 5) return 'success'
    if (cantidad >= 3) return 'primary'
    if (cantidad >= 1) return 'warning'
    return 'default'
  }

  // Configuración de columnas para las tablas
  const beneficiosColumns = [
    { key: 'nombre', label: 'BENEFICIO' },
    { key: 'cantidad_tipos_membresia', label: 'TIPOS INCLUIDOS' },
    { key: 'acciones', label: 'ACCIONES' }
  ]

  const tiposColumns = [
    { key: 'info', label: 'TIPO MEMBRESÍA' },
    { key: 'precio', label: 'PRECIO' },
    { key: 'beneficios', label: 'BENEFICIOS INCLUIDOS' },
    { key: 'acciones', label: 'ACCIONES' }
  ]

  // Preparar datos para las tablas
  const beneficiosRows = beneficios.map(beneficio => ({
    key: beneficio.id.toString(),
    id: beneficio.id,
    nombre: beneficio.nombre,
    cantidad_tipos_membresia: beneficio.cantidad_tipos_membresia || 0,
    acciones: 'acciones'
  }))

  const tiposRows = tiposMembresia.map(tipo => ({
    key: tipo.id.toString(),
    id: tipo.id,
    info: { nombre: tipo.nombre, frecuencia: tipo.frecuencia },
    precio: tipo.precio,
    beneficios: tipo.beneficios || [],
    acciones: 'acciones'
  }))

  // Función para renderizar el contenido de las celdas
  const renderBeneficioCell = (item: any, columnKey: React.Key) => {
    const beneficio = beneficios.find(b => b.id.toString() === item.key)!

    switch (columnKey) {
      case 'nombre':
        return <div className="font-medium">{item.nombre}</div>
      case 'descripcion':
        return (
          <div className="text-default-500 text-sm max-w-xs truncate">
            {item.descripcion}
          </div>
        )
      case 'cantidad_tipos_membresia':
        console.log(item)
        return (
          <Chip
            color={getBeneficioColor(item.cantidad_tipos_membresia)}
            variant="flat"
            size="sm"
          >
            {item.cantidad_tipos_membresia} tipos
          </Chip>
        )
      case 'acciones':
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="primary"
              onPress={() => handleEditBeneficio(beneficio)}
            >
              <Edit size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => handleDeleteBeneficio(beneficio)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const renderTipoCell = (item: any, columnKey: React.Key) => {
    const tipo = tiposMembresia.find(t => t.id.toString() === item.key)!

    switch (columnKey) {
      case 'info':
        return (
          <div>
            <div className="font-medium">{item.info.nombre}</div>
            <div className="text-sm text-default-500">{item.info.frecuencia}</div>
          </div>
        )
      case 'precio':
        return (
          <div className="font-mono text-success">
            {formatPrice(item.precio)}
          </div>
        )
      case 'beneficios':
        return (
          <div className="flex flex-wrap gap-1 max-w-md">
            {item.beneficios && item.beneficios.length > 0 ? (
              item.beneficios.slice(0, 3).map((beneficio: string, index: number) => (
                <Chip key={index} size="sm" variant="flat" color="primary">
                  {beneficio}
                </Chip>
              ))
            ) : (
              <Chip size="sm" variant="flat" color="default">
                Sin beneficios
              </Chip>
            )}
            {item.beneficios && item.beneficios.length > 3 && (
              <Chip size="sm" variant="flat" color="secondary">
                +{item.beneficios.length - 3} más
              </Chip>
            )}
          </div>
        )
      case 'acciones':
        return (
          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={<Settings size={14} />}
            onPress={() => handleAssignBeneficios(tipo)}
          >
            Gestionar
          </Button>
        )
      default:
        return null
    }
  }

  if (loadingBeneficios || loadingTipos) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-500">Cargando beneficios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Breadcrumbs>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbItem>Admin</BreadcrumbItem>
          <BreadcrumbItem>Membresías</BreadcrumbItem>
          <BreadcrumbItem>Beneficios</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Beneficios</h1>
            <p className="text-default-500 mt-1">
              Administra beneficios y sus asignaciones a tipos de membresía
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Plus size={20} />}
            onPress={onCreateOpen}
          >
            Nuevo Beneficio
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-default-500 text-sm">Total Beneficios</p>
              <p className="text-2xl font-bold">{beneficios.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <Users className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-default-500 text-sm">Tipos Membresía</p>
              <p className="text-2xl font-bold">{tiposMembresia.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Settings className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-default-500 text-sm">Asignaciones</p>
              <p className="text-2xl font-bold">{asignaciones.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Eye className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-default-500 text-sm">Promedio por Tipo</p>
              <p className="text-2xl font-bold">
                {tiposMembresia.length > 0
                  ? Math.round(asignaciones.length / tiposMembresia.length)
                  : 0
                }
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        aria-label="Gestión de beneficios"
      >
        <Tab key="beneficios" title="Beneficios">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Lista de Beneficios</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table aria-label="Tabla de beneficios">
                <TableHeader columns={beneficiosColumns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  items={beneficiosRows}
                  emptyContent="No hay beneficios registrados"
                >
                  {(item) => (
                    <TableRow key={item.key}>
                      {(columnKey) => (
                        <TableCell>{renderBeneficioCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="asignaciones" title="Asignaciones por Tipo">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Beneficios por Tipo de Membresía</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table aria-label="Tabla de tipos con beneficios">
                <TableHeader columns={tiposColumns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  items={tiposRows}
                  emptyContent="No hay tipos de membresía"
                >
                  {(item) => (
                    <TableRow key={item.key}>
                      {(columnKey) => (
                        <TableCell>{renderTipoCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Create Modal */}
      <BeneficioModal
        isOpen={isCreateOpen}
        onOpenChange={onCreateOpenChange}
        title="Crear Nuevo Beneficio"
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <BeneficioModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        title="Editar Beneficio"
        initialData={editingBeneficio}
        onSubmit={(data) => updateMutation.mutate({ ...data, id: editingBeneficio!.id })}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-danger" />
                  Confirmar Eliminación
                </div>
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar el beneficio{" "}
                  <strong>"{deletingBeneficio?.nombre}"</strong>?
                </p>
                <p className="text-danger text-sm mt-2">
                  Se eliminará también de todos los tipos de membresía que lo incluyan.
                </p>
              </ModalBody>
              <ModalFooter>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Assign Benefits Modal */}
      {
        isAssignOpen && <AssignBenefitsModal
          isOpen={isAssignOpen}
          onOpenChange={onAssignOpenChange}
          tipo={assigningTipo}
          beneficios={beneficios}
          onSubmit={(beneficios_ids) =>
            assignMutation.mutate({
              id_tipo_membresia: assigningTipo!.id,
              beneficios_ids
            })
          }
          isLoading={assignMutation.isPending}
        />
      }
    </div>
  )
}

// Componente para modal de crear/editar beneficio
interface BeneficioModalProps {
  isOpen: boolean
  onOpenChange: () => void
  title: string
  initialData?: Beneficio | null
  onSubmit: (data: CreateBeneficioRequest) => void
  isLoading: boolean
}

function BeneficioModal({
  isOpen,
  onOpenChange,
  title,
  initialData,
  onSubmit,
  isLoading
}: BeneficioModalProps) {
  const form = useForm({
    defaultValues: {
      nombre: initialData?.nombre || '',
    },
    onSubmit: async ({ value }) => {
      try {
        const validatedData = beneficioSchema.parse(value)
        onSubmit(validatedData)
      } catch (error) {
        console.error('Error de validación:', error)
      }
    }
  })

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
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
                  onChange: beneficioSchema.shape.nombre
                }}
              >
                {(field) => (
                  <Input
                    label="Nombre del Beneficio"
                    placeholder="Ej: Acceso 24/7"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    isInvalid={field.state.meta.errors.length > 0}
                    errorMessage={field.state.meta.errors[0]?.message}
                    isRequired
                  />
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

// Componente para modal de asignar beneficios
interface AssignBenefitsModalProps {
  isOpen: boolean
  onOpenChange: () => void
  tipo: TipoMembresia | null
  beneficios: Beneficio[]
  onSubmit: (beneficios_ids: number[]) => void
  isLoading: boolean
}

function AssignBenefitsModal({
  isOpen,
  onOpenChange,
  tipo,
  beneficios,
  onSubmit,
  isLoading
}: AssignBenefitsModalProps) {
  const [selectedBeneficios, setSelectedBeneficios] = useState<string[]>([])

  // Cargar beneficios actuales cuando se abre el modal
  const { data: currentBeneficios = [] } = useQuery({
    queryKey: ['beneficios-tipo', tipo?.id],
    queryFn: () => tipo ? api.getBeneficiosPorTipo(tipo.id) : Promise.resolve([]),
    enabled: !!tipo && isOpen,
  })

  console.log('Assign tipo:', tipo)
  console.log('Beneficios actuales:', selectedBeneficios)

  // Actualizar selección cuando cambian los beneficios actuales
  React.useEffect(() => {
    if (currentBeneficios.length > 0) {
      setSelectedBeneficios(currentBeneficios.map(id => id.id.toString()))
    } else {
      setSelectedBeneficios([])
    }
  }, [currentBeneficios])

  const handleSubmit = () => {
    const beneficios_ids = selectedBeneficios.map(id => parseInt(id))
    onSubmit(beneficios_ids)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Gestionar Beneficios - {tipo?.nombre}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="p-3 bg-default-50 rounded-lg">
                  <p className="text-sm font-medium">Tipo de Membresía: {tipo?.nombre}</p>
                  <p className="text-xs text-default-500">
                    Precio: {tipo ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(tipo.precio) : ''} - {tipo?.frecuencia}
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-3">Selecciona los beneficios incluidos:</p>
                  <CheckboxGroup
                    value={selectedBeneficios}
                    onValueChange={setSelectedBeneficios}
                  >
                    <div className="space-y-2 max-h-60 overflow-y-auto flex flex-col gap-2">
                      {beneficios.map((beneficio) => (
                        <Checkbox key={beneficio.id} value={beneficio.id.toString()} isSelected={selectedBeneficios.includes(beneficio.id.toString())}>
                          <div>
                            <div className="font-medium">{beneficio.nombre}</div>
                          </div>
                        </Checkbox>
                      ))}
                    </div>
                  </CheckboxGroup>
                </div>

                <div className="text-sm text-default-500">
                  {selectedBeneficios.length} beneficio(s) seleccionado(s)
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isLoading}
              >
                Guardar Asignaciones
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}