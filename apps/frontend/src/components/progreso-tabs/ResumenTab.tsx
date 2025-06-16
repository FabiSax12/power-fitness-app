import {
  Card,
  CardBody,
  CardHeader,
} from '@heroui/card'
import { Chip } from '@heroui/chip'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import {
  TrendingUp, TrendingDown, Activity,
  Heart, Scale,
  Flame, Ruler
} from 'lucide-react'

interface Props {
  estadisticas: {
    cambioPeso: number,           // Cambio en peso corporal (kg)
    reduccionGrasa: number,       // Reducción en % de grasa corporal
    mejoraEdadMetabolica: number, // Mejora en edad metabólica (años)
    cambioMedidas: number         // Cambio promedio en medidas corporales (cm)
  }
  progresoData: Array<{
    fecha: string,
    mes: string,
    peso_total: number,           // peso_kg del progreso
    grasa_corporal: number,       // porcentaje_grasa
    edad_metabolica: number,      // edad_metabolica
    medida_promedio?: number      // medida_promedio_cm
  }>
  medicionesData?: Array<{
    grupo: string,
    inicial: number,              // Medida inicial en cm
    actual: number,               // Medida actual en cm
    progreso: number              // % de cambio
  }>
}

export function ReseumenTab({ estadisticas, progresoData, medicionesData }: Props) {
  // Calcular porcentajes de cambio para las métricas
  const calcularPorcentajeCambio = (inicial: number, actual: number): string => {
    if (inicial === 0) return "0%"
    const cambio = ((actual - inicial) / inicial) * 100
    return `${cambio > 0 ? '+' : ''}${cambio.toFixed(1)}%`
  }

  // Obtener datos para calcular porcentajes
  const primerRegistro = progresoData[0]
  const ultimoRegistro = progresoData[progresoData.length - 1]

  const porcentajePeso = primerRegistro && ultimoRegistro
    ? calcularPorcentajeCambio(primerRegistro.peso_total, ultimoRegistro.peso_total)
    : "0%"

  const porcentajeGrasa = primerRegistro && ultimoRegistro
    ? calcularPorcentajeCambio(primerRegistro.grasa_corporal, ultimoRegistro.grasa_corporal)
    : "0%"

  const porcentajeEdadMetabolica = primerRegistro && ultimoRegistro
    ? calcularPorcentajeCambio(primerRegistro.edad_metabolica, ultimoRegistro.edad_metabolica)
    : "0%"

  const porcentajeMedidas = primerRegistro && ultimoRegistro && primerRegistro.medida_promedio && ultimoRegistro.medida_promedio
    ? calcularPorcentajeCambio(primerRegistro.medida_promedio, ultimoRegistro.medida_promedio)
    : "0%"

  return (
    <div className="space-y-8">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Scale}
          titulo="Cambio de Peso"
          valor={estadisticas.cambioPeso > 0 ? `+${estadisticas.cambioPeso.toFixed(1)}` : estadisticas.cambioPeso.toFixed(1)}
          unidad="kg"
          cambio={porcentajePeso}
          tipo={estadisticas.cambioPeso <= 0 ? 'success' : 'danger'}
          color={estadisticas.cambioPeso <= 0 ? 'success' : 'warning'}
        />
        <MetricCard
          icon={Flame}
          titulo="Reducción de Grasa"
          valor={estadisticas.reduccionGrasa > 0 ? `${estadisticas.reduccionGrasa.toFixed(1)}` : '0'}
          unidad="%"
          cambio={porcentajeGrasa}
          tipo={estadisticas.reduccionGrasa > 0 ? 'success' : 'danger'}
          color="warning"
        />
        <MetricCard
          icon={Heart}
          titulo="Mejora Edad Metabólica"
          valor={estadisticas.mejoraEdadMetabolica > 0 ? `${estadisticas.mejoraEdadMetabolica}` : '0'}
          unidad=" años"
          cambio={porcentajeEdadMetabolica}
          tipo={estadisticas.mejoraEdadMetabolica > 0 ? 'success' : 'danger'}
          color="secondary"
        />
        <MetricCard
          icon={Ruler}
          titulo="Cambio Medidas"
          valor={estadisticas.cambioMedidas > 0 ? `+${estadisticas.cambioMedidas.toFixed(1)}` : estadisticas.cambioMedidas.toFixed(1)}
          unidad="cm"
          cambio={porcentajeMedidas}
          tipo={estadisticas.cambioMedidas >= 0 ? 'success' : 'danger'}
          color="primary"
        />
      </div>

      {/* Gráfico de evolución */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-xl font-bold text-foreground">Evolución de Composición Corporal</h3>
            <p className="text-default-500">Progreso a lo largo del tiempo</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progresoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--heroui-content1))',
                    border: '1px solid hsl(var(--heroui-divider))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'Peso Corporal (kg)') return [`${value} kg`, name]
                    if (name === 'Grasa Corporal (%)') return [`${value}%`, name]
                    if (name === 'Edad Metabólica (años)') return [`${value} años`, name]
                    if (name === 'Medida Promedio (cm)') return [`${value} cm`, name]
                    return [value, name]
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="peso_total"
                  stroke="hsl(var(--heroui-primary))"
                  strokeWidth={3}
                  name="Peso Corporal (kg)"
                  dot={{ fill: 'hsl(var(--heroui-primary))', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="grasa_corporal"
                  stroke="hsl(var(--heroui-warning))"
                  strokeWidth={3}
                  name="Grasa Corporal (%)"
                  dot={{ fill: 'hsl(var(--heroui-warning))', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="edad_metabolica"
                  stroke="hsl(var(--heroui-secondary))"
                  strokeWidth={3}
                  name="Edad Metabólica (años)"
                  dot={{ fill: 'hsl(var(--heroui-secondary))', strokeWidth: 2, r: 6 }}
                />
                {progresoData.some(d => d.medida_promedio) && (
                  <Line
                    type="monotone"
                    dataKey="medida_promedio"
                    stroke="hsl(var(--heroui-success))"
                    strokeWidth={3}
                    name="Medida Promedio (cm)"
                    dot={{ fill: 'hsl(var(--heroui-success))', strokeWidth: 2, r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Progreso por grupo muscular - Medidas corporales */}
      {medicionesData && medicionesData.length > 0 && (
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-xl font-bold text-foreground">Desarrollo por Grupo Muscular</h3>
              <p className="text-default-500">Medidas corporales: comparación inicial vs actual (cm)</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medicionesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="grupo"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: 'Medidas (cm)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--heroui-content1))',
                      border: '1px solid hsl(var(--heroui-divider))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value, name, props) => {
                      const { payload } = props
                      if (name === 'Inicial') return [`${value} cm`, 'Medida Inicial']
                      if (name === 'Actual') return [`${value} cm`, 'Medida Actual']
                      return [value, name]
                    }}
                    labelFormatter={(label) => `Grupo: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="inicial"
                    fill="hsl(var(--heroui-default-300))"
                    name="Inicial"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="actual"
                    fill="hsl(var(--heroui-primary))"
                    name="Actual"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Resumen de progreso */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-foreground">Resumen de Progreso</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground">Composición Corporal</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Peso inicial:</span>
                  <span className="font-medium">{primerRegistro?.peso_total?.toFixed(1) || 'N/A'} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Peso actual:</span>
                  <span className="font-medium">{ultimoRegistro?.peso_total?.toFixed(1) || 'N/A'} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Grasa inicial:</span>
                  <span className="font-medium">{primerRegistro?.grasa_corporal || 'N/A'}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Grasa actual:</span>
                  <span className="font-medium">{ultimoRegistro?.grasa_corporal || 'N/A'}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground">Métricas de Salud</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Edad metabólica inicial:</span>
                  <span className="font-medium">{primerRegistro?.edad_metabolica || 'N/A'} años</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Edad metabólica actual:</span>
                  <span className="font-medium">{ultimoRegistro?.edad_metabolica || 'N/A'} años</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Total registros:</span>
                  <span className="font-medium">{progresoData.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Período:</span>
                  <span className="font-medium">
                    {primerRegistro?.mes} - {ultimoRegistro?.mes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  titulo,
  valor,
  unidad,
  cambio,
  tipo = 'success',
  color = 'primary'
}: {
  icon: React.ComponentType<any>,
  titulo: string,
  valor: number | string,
  unidad?: string,
  cambio: string,
  tipo?: 'success' | 'danger',
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}) {
  return (
    <Card className="h-full">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
          <Chip
            color={tipo === 'success' ? 'success' : 'danger'}
            variant="flat"
            startContent={tipo === 'success' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            size="sm"
          >
            {cambio}
          </Chip>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground">{valor}{unidad}</p>
          <p className="text-sm text-default-500">{titulo}</p>
        </div>
      </CardBody>
    </Card>
  )
}