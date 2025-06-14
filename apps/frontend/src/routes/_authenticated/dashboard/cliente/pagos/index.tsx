/* eslint-disable @typescript-eslint/no-explicit-any */


import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import {
  Card,
  CardBody,
} from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Input } from '@heroui/input'
import {
  Select,
  SelectItem
} from '@heroui/select'
import {
  Receipt,
  Download,
  Eye,
  Filter,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  FileText
} from 'lucide-react'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import type { Pago } from '@/core/entities/Pago'

export const Route = createFileRoute('/_authenticated/dashboard/cliente/pagos/')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/auth/login', search: { redirect: location.pathname, error: 'not_authenticated' } });
    }
  },
  loader: async ({ context }) => {
    // Verificar que el usuario sea cliente
    if (context.auth?.user?.tipo_usuario !== 'cliente') {
      throw new Error('Acceso denegado: Solo los clientes pueden ver sus pagos');
    }

    try {
      const cedula = context.auth.user.cedula;

      // Cargar historial de pagos del cliente
      const pagosResponse = await fetch(`http://localhost:3000/api/clientes/${cedula}/pagos`);
      if (!pagosResponse.ok) {
        throw new Error('No se pudo cargar el historial de pagos');
      }

      const pagosData = (await pagosResponse.json()).data as Pago[];

      return {
        pagos: pagosData,
      };

    } catch (error) {
      console.error('Error loading payment data:', error);
      throw new Error('No se pudieron cargar los datos de pagos');
    }
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-danger mb-4">Error al Cargar Pagos</h1>
        <p className="text-default-600 mb-6">
          {error.message || 'No se pudieron cargar tus comprobantes de pago'}
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  )
})

function RouteComponent() {
  const { pagos } = Route.useLoaderData();

  const clienteInfo = useAuthStore(state => state.user);

  const [filtroEstado, setFiltroEstado] = useState('all')
  const [filtroMetodo, setFiltroMetodo] = useState('all')
  const [busqueda, setBusqueda] = useState('')

  // Filtrar pagos según los criterios
  const pagosFiltrados = useMemo(() => {
    return pagos.filter((pago: Pago) => {
      const matchEstado = filtroEstado === 'all' || pago.estado_pago === filtroEstado
      const matchMetodo = filtroMetodo === 'all' || pago.metodo_pago === filtroMetodo
      const matchBusqueda = busqueda === '' ||
        pago.num_recibo.toString().includes(busqueda) ||
        pago.tipo_membresia.toLowerCase().includes(busqueda.toLowerCase())

      return matchEstado && matchMetodo && matchBusqueda
    })
  }, [pagos, filtroEstado, filtroMetodo, busqueda])

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    return {
      totalPagado: pagos.reduce((sum, pago) => sum + pago.monto, 0),
      pagosCompletados: pagos.filter(p => p.estado_pago === 'Completado').length,
      ultimoPago: pagos.length > 0 ? Math.max(...pagos.map(p => new Date(p.fecha_pago).getTime())) : null,
      metodoPrincipal: pagos.length > 0 ?
        pagos.reduce((acc: { [key: string]: number }, pago) => {
          acc[pago.metodo_pago] = (acc[pago.metodo_pago] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number }) : {}
    }
  }, [pagos])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Completado': return 'success'
      case 'Pendiente': return 'warning'
      case 'Cancelado': return 'danger'
      case 'Reembolsado': return 'secondary'
      default: return 'default'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Completado': return CheckCircle
      case 'Pendiente': return Clock
      case 'Cancelado': return XCircle
      case 'Reembolsado': return RefreshCw
      default: return Clock
    }
  }

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(monto)
  }

  const metodoPrincipal = Object.keys(estadisticas.metodoPrincipal).reduce((a, b) =>
    estadisticas.metodoPrincipal[a] > estadisticas.metodoPrincipal[b] ? a : b, ''
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-content1 border-b border-divider px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Comprobantes de Pago</h1>
            <p className="text-default-500 mt-1">
              {clienteInfo?.nombre + ' ' + clienteInfo?.apellido1} • Historial de transacciones
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-default-500">Total pagado</p>
              <p className="text-lg font-bold text-success">
                {formatearMonto(estadisticas.totalPagado)}
              </p>
            </div>
            <Chip
              color="primary"
              variant="flat"
              startContent={<Receipt className="w-4 h-4" />}
            >
              {pagos.length} comprobantes
            </Chip>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="text-center p-4">
              <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {formatearMonto(estadisticas.totalPagado)}
              </p>
              <p className="text-sm text-default-500">Total pagado</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center p-4">
              <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {estadisticas.pagosCompletados}
              </p>
              <p className="text-sm text-default-500">Pagos exitosos</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center p-4">
              <CreditCard className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-lg font-bold text-foreground">
                {metodoPrincipal}
              </p>
              <p className="text-sm text-default-500">Método preferido</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center p-4">
              <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-lg font-bold text-foreground">
                {estadisticas.ultimoPago ?
                  new Date(estadisticas.ultimoPago).toLocaleDateString('es-CR', { month: 'short', year: 'numeric' })
                  : 'N/A'
                }
              </p>
              <p className="text-sm text-default-500">Último pago</p>
            </CardBody>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por número de recibo o tipo de membresía..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  startContent={<Search className="w-4 h-4 text-default-400" />}
                  className="w-full"
                />
              </div>

              <Select
                placeholder="Estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-48"
              >
                <SelectItem key="all">Todos los estados</SelectItem>
                <SelectItem key="Completado">Completado</SelectItem>
                <SelectItem key="Pendiente">Pendiente</SelectItem>
                <SelectItem key="Cancelado">Cancelado</SelectItem>
                <SelectItem key="Reembolsado">Reembolsado</SelectItem>
              </Select>

              <Select
                placeholder="Método de pago"
                value={filtroMetodo}
                onChange={(e) => setFiltroMetodo(e.target.value)}
                className="w-48"
              >
                <SelectItem key="all">Todos los métodos</SelectItem>
                <SelectItem key="Efectivo" >Efectivo</SelectItem>
                <SelectItem key="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
                <SelectItem key="Tarjeta de Débito">Tarjeta de Débito</SelectItem>
                <SelectItem key="SINPE Móvil">SINPE Móvil</SelectItem>
                <SelectItem key="Transferencia Bancaria">Transferencia</SelectItem>
              </Select>

              <Button
                color="primary"
                variant="bordered"
                startContent={<Filter className="w-4 h-4" />}
                onClick={() => {
                  setFiltroEstado('all')
                  setFiltroMetodo('all')
                  setBusqueda('')
                }}
              >
                Limpiar
              </Button>
            </div>
          </CardBody >
        </Card>

        {/* Lista de comprobantes */}
        < div className="space-y-4" >
          {
            pagosFiltrados.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <FileText className="w-16 h-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No se encontraron comprobantes
                  </h3>
                  <p className="text-default-500">
                    {pagos.length === 0
                      ? 'Aún no tienes pagos registrados'
                      : 'Intenta ajustar los filtros de búsqueda'
                    }
                  </p>
                </CardBody>
              </Card>
            ) : (
              pagosFiltrados
                .sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())
                .map((pago) => {
                  const EstadoIcon = getEstadoIcon(pago.estado_pago)

                  return (
                    <Card key={pago.num_recibo} className="hover:shadow-lg transition-shadow">
                      <CardBody>
                        <div className="flex items-center justify-between">
                          {/* Información principal */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Receipt className="w-6 h-6 text-primary" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">
                                  Recibo #{pago.num_recibo}
                                </h3>
                                <Chip
                                  color={getEstadoColor(pago.estado_pago)}
                                  size="sm"
                                  startContent={<EstadoIcon className="w-3 h-3" />}
                                >
                                  {pago.estado_pago}
                                </Chip>
                              </div>
                              <p className="text-sm text-default-500">
                                {pago.tipo_membresia} • {pago.metodo_pago}
                              </p>
                              <p className="text-xs text-default-400">
                                {new Date(pago.fecha_pago).toLocaleDateString('es-CR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Monto y acciones */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-foreground">
                                {formatearMonto(pago.monto)}
                              </p>
                              {/* {pago.periodo_membresia && (
                                <p className="text-xs text-default-500">
                                  Período: {pago.periodo_membresia}
                                </p>
                              )} */}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                color="primary"
                                variant="bordered"
                                startContent={<Eye className="w-4 h-4" />}
                                onClick={() => {
                                  // En un app real, esto abriría el detalle del comprobante
                                  console.log('Ver comprobante:', pago.num_recibo)
                                }}
                              >
                                Ver
                              </Button>

                              {pago.estado_pago === 'Completado' && (
                                <Button
                                  size="sm"
                                  color="success"
                                  variant="bordered"
                                  startContent={<Download className="w-4 h-4" />}
                                  onClick={() => {
                                    // En un app real, esto descargaría el PDF
                                    console.log('Descargar comprobante:', pago.num_recibo)
                                  }}
                                >
                                  PDF
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )
                })
            )
          }
        </div>
      </div >
    </div >
  )
}