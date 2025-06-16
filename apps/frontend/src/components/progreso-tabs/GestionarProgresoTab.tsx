import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  Edit,
  Trash2,
  Eye,
  Activity,
  TrendingUp,
  Ruler
} from 'lucide-react'
import { Button } from '@heroui/button'
import { Card, CardHeader, CardBody } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Divider } from '@heroui/divider'
import { Input, Textarea } from '@heroui/input'
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import type { ProgresoCliente, DetalleProgreso, MedicionProgreso } from '@/core/types/vw_ProgresoCliente'

interface EditarProgresoData {
  peso_kg: number
  porcentaje_grasa: number
  edad_metabolica: number
  detalles: { titulo: string; descripcion: string }[]
  mediciones: {
    musculo_nombre: string
    medida_cm: number
  }[]
}

// API Functions
const api = {
  getRegistrosProgreso: async (cedula: string): Promise<ProgresoCliente[]> => {
    const response = await fetch(`http://localhost:3000/api/clientes/${cedula}/progreso`)
    if (!response.ok) throw new Error('Error al obtener registros')
    const result = await response.json()
    return result.data || result
  },

  getDetalleProgreso: async (idProgreso: number): Promise<{ detalles: DetalleProgreso[], mediciones: MedicionProgreso[] }> => {
    const response = await fetch(`http://localhost:3000/api/progreso/${idProgreso}/detalle`)
    if (!response.ok) throw new Error('Error al obtener detalle del progreso')
    const result = await response.json()
    return result.data || result
  },

  updateProgreso: async (idProgreso: number, data: EditarProgresoData): Promise<void> => {
    const response = await fetch(`http://localhost:3000/api/progreso/${idProgreso}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Error al actualizar progreso')
  },

  deleteProgreso: async (idProgreso: number): Promise<void> => {
    const response = await fetch(`http://localhost:3000/api/progreso/${idProgreso}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error al eliminar progreso')
  }
}

interface GestionarProgresoTabProps {
  cedula: string
}

export function GestionarProgresoTab({ cedula }: GestionarProgresoTabProps) {
  const queryClient = useQueryClient()
  const [selectedProgreso, setSelectedProgreso] = useState<ProgresoCliente | null>(null)
  const [editingProgreso, setEditingProgreso] = useState<ProgresoCliente | null>(null)
  const [deletingProgreso, setDeletingProgreso] = useState<ProgresoCliente | null>(null)
  const [editFormData, setEditFormData] = useState<EditarProgresoData | null>(null)

  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()

  // Queries
  const { data: registros = [], isLoading, refetch } = useQuery({
    queryKey: ['registros-progreso', cedula],
    queryFn: () => api.getRegistrosProgreso(cedula)
  })

  // const { data: detalleProgreso } = useQuery({
  //   queryKey: ['detalle-progreso', selectedProgreso?.id_progreso],
  //   queryFn: () => selectedProgreso ? api.getDetalleProgreso(selectedProgreso.id_progreso) : null,
  //   enabled: !!selectedProgreso && isViewOpen
  // })

  const { data: detalleEdicion, isSuccess } = useQuery({
    queryKey: ['detalle-edicion', editingProgreso?.id_progreso],
    queryFn: () => editingProgreso ? registros.find(r => r.id_progreso === editingProgreso.id_progreso) : null,
    enabled: !!editingProgreso
  })

  useEffect(() => {
    if (detalleEdicion && isSuccess) {
      setEditFormData({
        edad_metabolica: detalleEdicion.edad_metabolica,
        peso_kg: detalleEdicion.peso_kg,
        porcentaje_grasa: detalleEdicion.porcentaje_grasa,
        detalles: detalleEdicion.detalles.map(d => ({ titulo: d.titulo, descripcion: d.descripcion })),
        mediciones: detalleEdicion.mediciones.map(m => ({
          musculo_nombre: m.musculo_nombre,
          medida_cm: m.medida_cm
        }))
      })
    }
  }, [detalleEdicion])

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: EditarProgresoData }) => api.updateProgreso(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-progreso'] })
      queryClient.invalidateQueries({ queryKey: ['progreso-completo'] })
      onEditOpenChange()
      setEditingProgreso(null)
      setEditFormData(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteProgreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-progreso'] })
      queryClient.invalidateQueries({ queryKey: ['progreso-completo'] })
      onDeleteOpenChange()
      setDeletingProgreso(null)
    }
  })

  // Event handlers
  const handleView = (registro: ProgresoCliente) => {
    setSelectedProgreso(registro)
    onViewOpen()
  }

  const handleEdit = (registro: ProgresoCliente) => {
    setEditingProgreso(registro)
    onEditOpen()
  }

  const handleDelete = (registro: ProgresoCliente) => {
    setDeletingProgreso(registro)
    onDeleteOpen()
  }

  const handleSaveEdit = () => {
    if (editingProgreso && editFormData) {
      updateMutation.mutate({ id: editingProgreso.id_progreso, data: editFormData })
    }
  }

  const handleConfirmDelete = () => {
    if (deletingProgreso) {
      deleteMutation.mutate(deletingProgreso.id_progreso)
    }
  }

  // Configuración de tabla
  const columns = [
    { key: 'fecha', label: 'FECHA' },
    // { key: 'resumen', label: 'RESUMEN' },
    { key: 'detalles', label: 'DETALLES' },
    { key: 'mediciones', label: 'MEDICIONES' },
    { key: 'acciones', label: 'ACCIONES' }
  ]

  const rows = registros.map(registro => ({
    key: registro.id_progreso.toString(),
    id_progreso: registro.id_progreso,
    fecha: registro.fecha,
    fecha_legible: registro.fecha_legible,
    cantidad_detalles: registro.cantidad_detalles,
    cantidad_mediciones: registro.cantidad_mediciones
  }))

  const renderCell = (item: any, columnKey: React.Key) => {
    const registro = registros.find(r => r.id_progreso.toString() === item.key)!

    switch (columnKey) {
      case 'fecha':
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium">{item.fecha_legible}</div>
              {/* <div className="text-xs text-default-500">
                {new Date(item.fecha).toLocaleDateString('es-CR')}
              </div> */}
            </div>
          </div>
        )
      case 'resumen':
        return (
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-success" />
            <span className="font-medium">Registro #{item.id_progreso}</span>
          </div>
        )
      case 'detalles':
        return (
          <Chip
            color={item.cantidad_detalles > 0 ? "primary" : "default"}
            variant="flat"
            size="sm"
            startContent={<TrendingUp className="w-3 h-3" />}
          >
            {item.cantidad_detalles} logros
          </Chip>
        )
      case 'mediciones':
        return (
          <Chip
            color={item.cantidad_mediciones > 0 ? "secondary" : "default"}
            variant="flat"
            size="sm"
            startContent={<Ruler className="w-3 h-3" />}
          >
            {item.cantidad_mediciones} medidas
          </Chip>
        )
      case 'acciones':
        return (
          <div className="flex gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="primary"
              onPress={() => handleView(registro)}
            >
              <Eye size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="warning"
              onPress={() => handleEdit(registro)}
            >
              <Edit size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => handleDelete(registro)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-500">Cargando registros de progreso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between w-full items-center">
            <div>
              <h2 className="text-xl font-semibold">Gestionar Registros de Progreso</h2>
              <p className="text-default-500 text-sm">
                Visualiza, edita o elimina tus registros de progreso existentes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Chip color="primary" variant="flat">
                {registros.length} registros
              </Chip>
              <Button
                color="primary"
                variant="flat"
                onPress={() => refetch()}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabla de registros */}
      <Card>
        <CardBody>
          <Table aria-label="Tabla de registros de progreso">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={rows}
              emptyContent="No tienes registros de progreso"
            >
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal para ver detalles */}
      {
        isViewOpen && <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange} scrollBehavior='inside' size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Detalle del Progreso - {selectedProgreso?.fecha_legible}
                  </div>
                </ModalHeader>
                <ModalBody>
                  {selectedProgreso && (
                    <div className="space-y-6">
                      {/* Detalles/Logros */}
                      {selectedProgreso.detalles.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Logros y Detalles
                          </h3>
                          <div className="space-y-3">
                            {selectedProgreso.detalles.map((detalle) => (
                              <Card key={detalle.id_detalles}>
                                <CardBody className="py-3">
                                  <h4 className="font-medium text-primary">{detalle.titulo}</h4>
                                  <p className="text-sm text-default-600 mt-1">{detalle.descripcion}</p>
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      <Divider />

                      {/* Mediciones */}
                      {selectedProgreso.mediciones.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Ruler className="w-4 h-4" />
                            Mediciones Corporales
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card key={'peso'}>
                              <CardBody className="py-3">
                                <h4 className="font-medium text-secondary">Peso</h4>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                  <div>
                                    <span className="text-default-500">Medida:</span>
                                    <span className="ml-1 font-medium">{selectedProgreso.peso_kg} kg</span>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>

                            <Card key={'grasa'}>
                              <CardBody className="py-3">
                                <h4 className="font-medium text-secondary">Grasa</h4>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                  <div>
                                    <span className="text-default-500">Medida:</span>
                                    <span className="ml-1 font-medium">{selectedProgreso.porcentaje_grasa}%</span>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                            {selectedProgreso.mediciones.map((medicion) => (
                              <Card key={medicion.id_medicion}>
                                <CardBody className="py-3">
                                  <h4 className="font-medium text-secondary">{medicion.musculo_nombre}</h4>
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <div>
                                      <span className="text-default-500">Medida:</span>
                                      <span className="ml-1 font-medium">{medicion.medida_cm} cm</span>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      }

      {/* Modal para editar */}
      {
        isEditOpen && <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} scrollBehavior='inside' size="4xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-warning" />
                    Editar Progreso - {editingProgreso?.fecha_legible}
                  </div>
                </ModalHeader>
                <ModalBody>
                  {editFormData && (
                    <div className="space-y-6">
                      {/* Editar Detalles */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Logros y Detalles</h3>
                        <div className="space-y-3">
                          {editFormData.detalles.map((detalle, index) => (
                            <div key={index} className="space-y-2">
                              <Input
                                label="Título"
                                value={detalle.titulo}
                                onChange={(e) => {
                                  const newDetalles = [...editFormData.detalles]
                                  newDetalles[index].titulo = e.target.value
                                  setEditFormData({ ...editFormData, detalles: newDetalles })
                                }}
                              />
                              <Textarea
                                label="Descripción"
                                value={detalle.descripcion}
                                onChange={(e) => {
                                  const newDetalles = [...editFormData.detalles]
                                  newDetalles[index].descripcion = e.target.value
                                  setEditFormData({ ...editFormData, detalles: newDetalles })
                                }}
                              />
                              <Divider />
                            </div>
                          ))}
                        </div>
                      </div>


                      {/* Editar Mediciones */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Mediciones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          <Card>
                            <CardBody>
                              <h4 className="font-medium mb-3">Peso</h4>
                              <Input
                                label="Peso (kg)"
                                type="number"
                                step="0.1"
                                value={editFormData.peso_kg.toString()}
                                onChange={(e) => {
                                  setEditFormData({ ...editFormData, peso_kg: parseFloat(e.target.value) || 0 })
                                }}
                              />
                            </CardBody>
                          </Card>

                          <Card>
                            <CardBody>
                              <h4 className="font-medium mb-3">Grasa</h4>
                              <Input
                                label="Grasa (%)"
                                type="number"
                                step="0.1"
                                value={editFormData.porcentaje_grasa.toString()}
                                onChange={(e) => {
                                  setEditFormData({ ...editFormData, porcentaje_grasa: parseFloat(e.target.value) || 0 })
                                }}
                              />
                            </CardBody>
                          </Card>

                          {editFormData.mediciones.map((medicion, index) => (
                            <Card key={index}>
                              <CardBody>
                                <h4 className="font-medium mb-3">{medicion.musculo_nombre}</h4>
                                <Input
                                  label="Medida (cm)"
                                  type="number"
                                  step="0.1"
                                  value={medicion.medida_cm.toString()}
                                  onChange={(e) => {
                                    const newMediciones = [...editFormData.mediciones]
                                    newMediciones[index].medida_cm = parseFloat(e.target.value) || 0
                                    setEditFormData({ ...editFormData, mediciones: newMediciones })
                                  }}
                                />
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="warning"
                    onPress={handleSaveEdit}
                    isLoading={updateMutation.isPending}
                  >
                    Guardar Cambios
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      }

      {/* Modal para confirmar eliminación */}
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
                  ¿Estás seguro de que deseas eliminar el registro de progreso del{" "}
                  <strong>{deletingProgreso?.fecha_legible}</strong>?
                </p>
                <p className="text-danger text-sm mt-2">
                  Esta acción no se puede deshacer. Se eliminarán todos los detalles y mediciones asociados.
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
    </div >
  )
}