// routes/_authenticated/dashboard/entrenador/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardBody,
  CardHeader,
} from '@heroui/card'
import { Chip, } from '@heroui/chip'
import { Progress, } from '@heroui/progress'
import { Avatar, } from '@heroui/avatar'
import { Tabs, Tab } from '@heroui/tabs'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import {
  Users,
  TrendingUp,
  Award,
  DollarSign,
  Activity,
  Target,
  BarChart3
} from 'lucide-react'
import { useTrainersPerformance } from '@/hooks/useTrainersPerformance'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { TopPerformerCard, AlertsCard, EfficiencyCard, TeamProgressCard } from '@/components/EntrenadorStatsCards'

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/')({
  component: EntrenadorDashboard,
})

// Componente de métricas rápidas
const MetricCard = ({
  title,
  value,
  icon: Icon,
  color = "primary",
  subtitle,
  change
}: {
  title: string
  value: string | number
  icon: any
  color?: "primary" | "secondary" | "success" | "warning" | "danger"
  subtitle?: string
  change?: string
}) => (
  <Card className="border-none bg-gradient-to-br from-white to-slate-50">
    <CardBody className="flex flex-row items-center gap-4 p-6">
      <div className={`p-3 rounded-xl bg-${color}/10`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
        {change && (
          <Chip size="sm" color="success" variant="flat" className="mt-1">
            {change}
          </Chip>
        )}
      </div>
    </CardBody>
  </Card>
)

// Componente para mostrar especialidades
const EspecialidadesChip = ({ especialidades }: { especialidades: string | null }) => {
  if (!especialidades) return <span className="text-gray-400">Sin especialidades</span>

  return (
    <div className="flex flex-wrap gap-1">
      {especialidades.split(',').map((esp, index) => (
        <Chip key={index} size="sm" color="secondary" variant="flat">
          {esp.trim()}
        </Chip>
      ))}
    </div>
  )
}

// Componente para evaluar el rendimiento
const PerformanceIndicator = ({
  carga_trabajo,
  evaluacion_retencion
}: {
  carga_trabajo: string | null
  evaluacion_retencion: string | null
}) => {
  const getCargaColor = (carga: string | null) => {
    switch (carga) {
      case 'ALTA': return 'danger'
      case 'MEDIA': return 'warning'
      case 'BAJA': return 'success'
      default: return 'default'
    }
  }

  const getRetencionColor = (evaluacion: string | null) => {
    switch (evaluacion) {
      case 'EXCELENTE': return 'success'
      case 'BUENO': return 'primary'
      case 'REGULAR': return 'warning'
      case 'NECESITA MEJORA': return 'danger'
      default: return 'default'
    }
  }

  return (
    <div className="flex gap-2">
      <Chip
        size="sm"
        color={getCargaColor(carga_trabajo)}
        variant="flat"
      >
        Carga: {carga_trabajo || 'N/A'}
      </Chip>
      <Chip
        size="sm"
        color={getRetencionColor(evaluacion_retencion)}
        variant="flat"
      >
        Retención: {evaluacion_retencion || 'N/A'}
      </Chip>
    </div>
  )
}

// Componente principal del dashboard
function EntrenadorDashboard() {
  const { data, isLoading, error } = useTrainersPerformance()

  return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando métricas de entrenadores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-danger-50 border-danger-200">
        <CardBody>
          <p className="text-danger">Error al cargar los datos: {error.message}</p>
        </CardBody>
      </Card>
    )
  }

  if (!data?.length) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-gray-600">No hay datos de entrenadores disponibles</p>
        </CardBody>
      </Card>
    )
  }

  const entrenadores = data

  // Cálculos para métricas generales
  const totalClientes = entrenadores.reduce((sum, e) => sum + (e.clientes_actuales || 0), 0)
  const totalRutinasActivas = entrenadores.reduce((sum, e) => sum + (e.rutinas_activas || 0), 0)
  const totalIngresosMes = entrenadores.reduce((sum, e) => sum + (e.ingresos_generados_ultimo_mes || 0), 0)
  const promedioRetencion = entrenadores.reduce((sum, e) => sum + (e.tasa_retencion_porcentaje || 0), 0) / entrenadores.length

  // Datos para gráficos
  const clientesPorEntrenador = entrenadores.map(e => ({
    nombre: e.nombre_completo.split(' ')[0],
    clientes: e.clientes_actuales || 0,
    rutinas: e.rutinas_activas || 0
  }))

  const distribucionCarga = entrenadores.reduce((acc, e) => {
    const carga = e.carga_trabajo || 'Sin datos'
    acc[carga] = (acc[carga] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const cargaData = Object.entries(distribucionCarga).map(([name, value]) => ({
    name,
    value,
    color: name === 'ALTA' ? '#ef4444' : name === 'MEDIA' ? '#f59e0b' : '#10b981'
  }))

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Entrenadores</h1>
          <p className="text-gray-600">Métricas de rendimiento y performance del equipo</p>
        </div>
        <Chip color="success" variant="flat" size="lg">
          {entrenadores.length} Entrenadores Activos
        </Chip>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Clientes"
          value={totalClientes}
          icon={Users}
          color="primary"
          subtitle="Clientes activos"
        />
        <MetricCard
          title="Rutinas Activas"
          value={totalRutinasActivas}
          icon={Activity}
          color="secondary"
          subtitle="En progreso"
        />
        <MetricCard
          title="Ingresos Mensuales"
          value={`₡${totalIngresosMes.toLocaleString()}`}
          icon={DollarSign}
          color="success"
          subtitle="Último mes"
        />
        <MetricCard
          title="Retención Promedio"
          value={`${promedioRetencion.toFixed(1)}%`}
          icon={TrendingUp}
          color="warning"
          subtitle="Promedio del equipo"
        />
      </div>

      {/* Tarjetas de Estadísticas Avanzadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TopPerformerCard entrenadores={entrenadores} />
        <AlertsCard entrenadores={entrenadores} />
        <EfficiencyCard entrenadores={entrenadores} />
        <TeamProgressCard entrenadores={entrenadores} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Clientes por Entrenador
            </h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={clientesPorEntrenador}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clientes" fill="#3b82f6" name="Clientes" />
                <Bar dataKey="rutinas" fill="#06b6d4" name="Rutinas" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Distribución de Carga de Trabajo
            </h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={cargaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {cargaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Tabla Detallada de Entrenadores */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Detalle de Entrenadores
          </h3>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="Vistas de entrenadores" className="w-full">
            <Tab key="general" title="Vista General">
              <div className="overflow-x-auto">
                <Table aria-label="Tabla de entrenadores">
                  <TableHeader>
                    <TableColumn>ENTRENADOR</TableColumn>
                    <TableColumn>ESPECIALIDADES</TableColumn>
                    <TableColumn>CLIENTES</TableColumn>
                    <TableColumn>RUTINAS</TableColumn>
                    <TableColumn>RETENCIÓN</TableColumn>
                    <TableColumn>PERFORMANCE</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {entrenadores.map((entrenador) => (
                      <TableRow key={entrenador.cedula_entrenador}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              size="sm"
                              name={entrenador.nombre_completo}
                              className="bg-primary-100 text-primary-600"
                            />
                            <div>
                              <p className="font-medium">{entrenador.nombre_completo}</p>
                              <p className="text-xs text-gray-500">{entrenador.correo}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <EspecialidadesChip especialidades={entrenador.lista_especialidades} />
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-lg">{entrenador.clientes_actuales || 0}</p>
                            <p className="text-xs text-gray-500">
                              +{entrenador.clientes_nuevos_ultimo_mes || 0} este mes
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-lg">{entrenador.rutinas_activas || 0}</p>
                            <p className="text-xs text-gray-500">
                              {entrenador.ejercicios_promedio_por_rutina?.toFixed(1) || 0} ej/rutina
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <Progress
                              value={entrenador.tasa_retencion_porcentaje || 0}
                              color={
                                (entrenador.tasa_retencion_porcentaje || 0) >= 90 ? "success" :
                                  (entrenador.tasa_retencion_porcentaje || 0) >= 70 ? "warning" : "danger"
                              }
                              size="sm"
                              className="mb-1"
                            />
                            <p className="text-sm font-medium">
                              {entrenador.tasa_retencion_porcentaje?.toFixed(1) || 0}%
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <PerformanceIndicator
                            carga_trabajo={entrenador.carga_trabajo}
                            evaluacion_retencion={entrenador.evaluacion_retencion}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>

            <Tab key="financiero" title="Financiero">
              <div className="overflow-x-auto">
                <Table aria-label="Tabla financiera de entrenadores">
                  <TableHeader>
                    <TableColumn>ENTRENADOR</TableColumn>
                    <TableColumn>INGRESOS MENSUAL</TableColumn>
                    <TableColumn>INGRESOS TOTAL</TableColumn>
                    <TableColumn>PROMEDIO POR CLIENTE</TableColumn>
                    <TableColumn>ANTIGUEDAD</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {entrenadores.map((entrenador) => {
                      const promedioPorCliente = entrenador.clientes_actuales && entrenador.ingresos_generados_ultimo_mes
                        ? entrenador.ingresos_generados_ultimo_mes / entrenador.clientes_actuales
                        : 0

                      return (
                        <TableRow key={entrenador.cedula_entrenador}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar
                                size="sm"
                                name={entrenador.nombre_completo}
                                className="bg-success-100 text-success-600"
                              />
                              <p className="font-medium">{entrenador.nombre_completo}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <p className="font-semibold text-success-600">
                                ₡{(entrenador.ingresos_generados_ultimo_mes || 0).toLocaleString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <p className="font-semibold">
                                ₡{(entrenador.ingresos_totales_historicos || 0).toLocaleString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <p className="font-medium">
                                ₡{promedioPorCliente.toLocaleString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <p className="font-medium">{entrenador.meses_en_gimnasio} meses</p>
                              <p className="text-xs text-gray-500">
                                Desde {new Date(entrenador.fecha_ingreso).toLocaleDateString()}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </Tab>

            <Tab key="actividad" title="Actividad">
              <div className="overflow-x-auto">
                <Table aria-label="Tabla de actividad de entrenadores">
                  <TableHeader>
                    <TableColumn>ENTRENADOR</TableColumn>
                    <TableColumn>CLASES</TableColumn>
                    <TableColumn>PROGRESO CLIENTES</TableColumn>
                    <TableColumn>CERTIFICACIONES</TableColumn>
                    <TableColumn>ACTIVIDAD RECIENTE</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {entrenadores.map((entrenador) => (
                      <TableRow key={entrenador.cedula_entrenador}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              size="sm"
                              name={entrenador.nombre_completo}
                              className="bg-secondary-100 text-secondary-600"
                            />
                            <p className="font-medium">{entrenador.nombre_completo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold">{entrenador.clases_programadas || 0}</p>
                            <p className="text-xs text-gray-500">
                              {entrenador.promedio_asistencia_clase?.toFixed(1) || 0} promedio asistencia
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-primary-600">
                              {entrenador.clientes_con_progreso_reciente || 0}
                            </p>
                            <p className="text-xs text-gray-500">
                              de {entrenador.clientes_actuales || 0} con progreso reciente
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Award className="w-4 h-4 text-warning-500" />
                              <p className="font-semibold">{entrenador.cantidad_certificaciones || 0}</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {entrenador.certificaciones_activas || 0} activas
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">
                              {entrenador.rutinas_ultimo_mes || 0} rutinas creadas
                            </p>
                            <p className="text-sm">
                              {entrenador.clases_ultimo_mes || 0} clases impartidas
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  )
}