import {
  Card,
  CardBody,
  CardHeader,
} from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Progress } from '@heroui/progress'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface Props {
  progresoData: Array<{
    mes: string,
    peso_total: number,
    masa_muscular: number,
    grasa_corporal: number
  }>
  medicionesData: {
    progreso: number;
    grupo: string;
    inicial: any;
    actual: any;
  }[]
}

export const MedicionesTab = ({ medicionesData, progresoData }: Props) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-xl font-bold text-foreground">Detalle de Mediciones por Grupo Muscular</h3>
            <p className="text-default-500">Masa muscular en kilogramos</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-divider">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Grupo Muscular</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Inicial</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Actual</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Cambio</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">% Progreso</th>
                </tr>
              </thead>
              <tbody>
                {medicionesData.map((grupo, index) => (
                  <tr key={grupo.grupo} className={index % 2 === 0 ? 'bg-default-50' : 'bg-content1'}>
                    <td className="py-4 px-4 font-medium text-foreground">{grupo.grupo}</td>
                    <td className="py-4 px-4 text-center text-default-500">{grupo.inicial} kg</td>
                    <td className="py-4 px-4 text-center text-foreground font-semibold">{grupo.actual} kg</td>
                    <td className="py-4 px-4 text-center">
                      <Chip color="success" variant="flat" size="sm">
                        +{(grupo.actual - grupo.inicial).toFixed(1)} kg
                      </Chip>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress
                          value={Math.min(grupo.progreso, 100)}
                          className="w-16"
                          color="primary"
                          size="sm"
                        />
                        <span className="text-sm font-medium text-primary">
                          {grupo.progreso.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Gráfico de edad metabólica */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-xl font-bold text-foreground">Evolución de Edad Metabólica</h3>
            <p className="text-default-500">Mejora en la eficiencia metabólica</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progresoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--heroui-content1))',
                    border: '1px solid hsl(var(--heroui-divider))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="edad_metabolica"
                  stroke="hsl(var(--heroui-secondary))"
                  strokeWidth={4}
                  name="Edad Metabólica"
                  dot={{ fill: 'hsl(var(--heroui-secondary))', strokeWidth: 2, r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}