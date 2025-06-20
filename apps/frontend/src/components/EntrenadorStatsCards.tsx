import { Card, CardBody, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Progress } from '@heroui/progress'
import { Divider } from '@heroui/divider'
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  Star
} from 'lucide-react'
import { type TrainerPerformance } from '@/hooks/useTrainersPerformance'

interface StatsCardsProps {
  entrenadores: TrainerPerformance[]
}

// Componente para mostrar el top performer
export const TopPerformerCard = ({ entrenadores }: StatsCardsProps) => {
  const topPerformer = entrenadores.reduce((best, current) => {
    const currentScore = (current.tasa_retencion_porcentaje || 0) +
      (current.clientes_actuales || 0) * 2 +
      (current.ingresos_generados_ultimo_mes || 0) / 10000
    const bestScore = (best.tasa_retencion_porcentaje || 0) +
      (best.clientes_actuales || 0) * 2 +
      (best.ingresos_generados_ultimo_mes || 0) / 10000
    return currentScore > bestScore ? current : best
  }, entrenadores[0])

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-800">Entrenador Destacado</h3>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="font-bold text-xl text-amber-900">{topPerformer.nombre_completo}</p>
            <p className="text-sm text-amber-700">{topPerformer.correo}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-800">{topPerformer.clientes_actuales}</p>
              <p className="text-xs text-amber-600">Clientes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-800">{topPerformer.tasa_retencion_porcentaje?.toFixed(1)}%</p>
              <p className="text-xs text-amber-600">Retención</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-amber-700">Especialidades:</span>
              <span className="text-amber-800 font-medium">
                {topPerformer.cantidad_especialidades || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-700">Experiencia:</span>
              <span className="text-amber-800 font-medium">
                {topPerformer.meses_en_gimnasio} meses
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// Componente para alertas y notificaciones
export const AlertsCard = ({ entrenadores }: StatsCardsProps) => {
  const entrenadoresCargaAlta = entrenadores.filter(e => e.carga_trabajo === 'ALTA')
  const entrenadoresBajaRetencion = entrenadores.filter(e => (e.tasa_retencion_porcentaje || 0) < 80)
  const entrenadoresPocosClientes = entrenadores.filter(e => (e.clientes_actuales || 0) < 5)

  const totalAlertas = entrenadoresCargaAlta.length + entrenadoresBajaRetencion.length + entrenadoresPocosClientes.length

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-red-100 border-rose-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-semibold text-rose-800">Alertas</h3>
          </div>
          <Chip size="sm" color="danger" variant="flat">
            {totalAlertas} alertas
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="pt-0 space-y-3">
        {entrenadoresCargaAlta.length > 0 && (
          <div className="p-3 bg-rose-100 rounded-lg">
            <p className="text-sm font-medium text-rose-800 mb-1">
              Carga de trabajo alta ({entrenadoresCargaAlta.length})
            </p>
            <p className="text-xs text-rose-600">
              {entrenadoresCargaAlta.map(e => e.nombre_completo.split(' ')[0]).join(', ')}
            </p>
          </div>
        )}

        {entrenadoresBajaRetencion.length > 0 && (
          <div className="p-3 bg-orange-100 rounded-lg">
            <p className="text-sm font-medium text-orange-800 mb-1">
              Baja retención ({entrenadoresBajaRetencion.length})
            </p>
            <p className="text-xs text-orange-600">
              {entrenadoresBajaRetencion.map(e => e.nombre_completo.split(' ')[0]).join(', ')}
            </p>
          </div>
        )}

        {entrenadoresPocosClientes.length > 0 && (
          <div className="p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">
              Pocos clientes ({entrenadoresPocosClientes.length})
            </p>
            <p className="text-xs text-yellow-600">
              {entrenadoresPocosClientes.map(e => e.nombre_completo.split(' ')[0]).join(', ')}
            </p>
          </div>
        )}

        {totalAlertas === 0 && (
          <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-800">Todo está funcionando bien</p>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

// Componente para métricas de eficiencia
export const EfficiencyCard = ({ entrenadores }: StatsCardsProps) => {
  const totalClientes = entrenadores.reduce((sum, e) => sum + (e.clientes_actuales || 0), 0)
  const totalEntrenadores = entrenadores.length
  const promedioClientesPorEntrenador = totalClientes / totalEntrenadores

  const totalRutinas = entrenadores.reduce((sum, e) => sum + (e.rutinas_activas || 0), 0)
  const promedioRutinasPorEntrenador = totalRutinas / totalEntrenadores

  const entrenadoresConClases = entrenadores.filter(e => (e.clases_programadas || 0) > 0).length
  const porcentajeConClases = (entrenadoresConClases / totalEntrenadores) * 100

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-800">Métricas de Eficiencia</h3>
        </div>
      </CardHeader>
      <CardBody className="pt-0 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-blue-700">Clientes por entrenador</span>
            <span className="font-bold text-blue-800">{promedioClientesPorEntrenador.toFixed(1)}</span>
          </div>
          <Progress
            value={(promedioClientesPorEntrenador / 15) * 100}
            color="primary"
            size="sm"
            className="mb-2"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-blue-700">Rutinas por entrenador</span>
            <span className="font-bold text-blue-800">{promedioRutinasPorEntrenador.toFixed(1)}</span>
          </div>
          <Progress
            value={(promedioRutinasPorEntrenador / 15) * 100}
            color="secondary"
            size="sm"
            className="mb-2"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-blue-700">Con clases programadas</span>
            <span className="font-bold text-blue-800">{porcentajeConClases.toFixed(0)}%</span>
          </div>
          <Progress
            value={porcentajeConClases}
            color="success"
            size="sm"
            className="mb-2"
          />
        </div>

        <Divider />

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-800">{totalClientes}</p>
            <p className="text-xs text-blue-600">Total Clientes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-800">{totalRutinas}</p>
            <p className="text-xs text-blue-600">Total Rutinas</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// Componente para progreso del equipo
export const TeamProgressCard = ({ entrenadores }: StatsCardsProps) => {
  const totalClientesConProgreso = entrenadores.reduce((sum, e) => sum + (e.clientes_con_progreso_reciente || 0), 0)
  const totalClientes = entrenadores.reduce((sum, e) => sum + (e.clientes_actuales || 0), 0)
  const porcentajeProgreso = totalClientes > 0 ? (totalClientesConProgreso / totalClientes) * 100 : 0

  const totalRegistrosProgreso = entrenadores.reduce((sum, e) => sum + (e.total_registros_progreso || 0), 0)
  const promedioRegistrosPorCliente = totalClientes > 0 ? totalRegistrosProgreso / totalClientes : 0

  const entrenadoresExcelentes = entrenadores.filter(e => e.evaluacion_retencion === 'EXCELENTE').length
  const porcentajeExcelentes = (entrenadoresExcelentes / entrenadores.length) * 100

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Progreso del Equipo</h3>
        </div>
      </CardHeader>
      <CardBody className="pt-0 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-green-700">Clientes con progreso reciente</span>
            <span className="font-bold text-green-800">{porcentajeProgreso.toFixed(1)}%</span>
          </div>
          <Progress
            value={porcentajeProgreso}
            color="success"
            size="sm"
            className="mb-2"
          />
          <p className="text-xs text-green-600">
            {totalClientesConProgreso} de {totalClientes} clientes
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-green-700">Entrenadores excelentes</span>
            <span className="font-bold text-green-800">{porcentajeExcelentes.toFixed(0)}%</span>
          </div>
          <Progress
            value={porcentajeExcelentes}
            color="primary"
            size="sm"
            className="mb-2"
          />
          <p className="text-xs text-green-600">
            {entrenadoresExcelentes} de {entrenadores.length} entrenadores
          </p>
        </div>

        <Divider />

        <div className="text-center">
          <p className="text-2xl font-bold text-green-800">{promedioRegistrosPorCliente.toFixed(1)}</p>
          <p className="text-sm text-green-600">Registros promedio por cliente</p>
        </div>
      </CardBody>
    </Card>
  )
}