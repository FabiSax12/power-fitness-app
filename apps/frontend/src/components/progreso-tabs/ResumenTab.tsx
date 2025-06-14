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
  Flame
} from 'lucide-react'

interface Props {
  estadisticas: {
    perdidaPeso: number,
    gananciaMusculo: number,
    reduccionGrasa: number,
    mejoraEdadMetabolica: number
  }
  progresoData: Array<{
    mes: string,
    peso_total: number,
    masa_muscular: number,
    grasa_corporal: number
  }>
  medicionesData?: {
    progreso: number;
    grupo: string;
    inicial: any;
    actual: any;
  }[]
}

export function ReseumenTab({ estadisticas, progresoData, medicionesData }: Props) {
  return (
    <div className="space-y-8">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Scale}
          titulo="Pérdida de Peso"
          valor={estadisticas.perdidaPeso.toFixed(1)}
          unidad="kg"
          cambio="-6.5%"
          color="success"
        />
        <MetricCard
          icon={Activity}
          titulo="Ganancia Muscular"
          valor={estadisticas.gananciaMusculo.toFixed(1)}
          unidad="kg"
          cambio="+22.8%"
          color="primary"
        />
        <MetricCard
          icon={Flame}
          titulo="Reducción de Grasa"
          valor={estadisticas.reduccionGrasa.toFixed(1)}
          unidad="%"
          cambio="-31.2%"
          color="warning"
        />
        <MetricCard
          icon={Heart}
          titulo="Edad Metabólica"
          valor={estadisticas.mejoraEdadMetabolica}
          unidad=" años"
          cambio="-26.2%"
          color="secondary"
        />
      </div>

      {/* Gráfico de evolución */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-xl font-bold text-foreground">Evolución de Composición Corporal</h3>
            <p className="text-default-500">Progreso mensual desde el inicio</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progresoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--heroui-content1))',
                    border: '1px solid hsl(var(--heroui-divider))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="peso_total"
                  stroke="hsl(var(--heroui-primary))"
                  strokeWidth={3}
                  name="Peso Total (kg)"
                  dot={{ fill: 'hsl(var(--heroui-primary))', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="masa_muscular"
                  stroke="hsl(var(--heroui-success))"
                  strokeWidth={3}
                  name="Masa Muscular (kg)"
                  dot={{ fill: 'hsl(var(--heroui-success))', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="grasa_corporal"
                  stroke="hsl(var(--heroui-warning))"
                  strokeWidth={3}
                  name="Grasa Corporal (%)"
                  dot={{ fill: 'hsl(var(--heroui-warning))', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Progreso por grupo muscular */}
      {medicionesData && (
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-xl font-bold text-foreground">Desarrollo Muscular por Grupo</h3>
              <p className="text-default-500">Comparación primer vs último registro</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medicionesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grupo" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--heroui-content1))',
                      border: '1px solid hsl(var(--heroui-divider))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="inicial" fill="hsl(var(--heroui-default-300))" name="Inicial" />
                  <Bar dataKey="actual" fill="hsl(var(--heroui-primary))" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      )}
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