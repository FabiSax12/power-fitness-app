import {
  Card,
  CardBody,
  CardHeader,
} from '@heroui/card'
import {
  ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

interface Props {
  progresoDataLength?: number;
  analisisData: {
    metric: string;
    value: number;
    fullMark: number;
  }[];
  estadisticas: {
    cambioPeso: number;
    reduccionGrasa: number;
    mejoraEdadMetabolica: number;
    cambioMedidas: number;
  } | null;
}

export const AnalisisTab = ({ analisisData, estadisticas, progresoDataLength }: Props) => {
  console.log('AnalisisTab', analisisData)

  return (
    <div className="space-y-8">
      {/* Radar de capacidades físicas */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-xl font-bold text-foreground">Análisis de Capacidades Físicas</h3>
            <p className="text-default-500">Evaluación integral de tu condición física actual</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analisisData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                {/* <PolarRadiusAxis angle={90} domain={[0, 100]} /> */}
                <Radar
                  name="Nivel Actual"
                  dataKey="value"
                  stroke="hsl(var(--heroui-primary))"
                  fill="hsl(var(--heroui-primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Resumen de transformación */}
      {estadisticas && (
        <Card className="bg-gradient-to-r from-primary to-secondary">
          <CardBody className="p-8 text-center text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">¡Increíble Transformación!</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold">{-estadisticas.cambioPeso.toFixed(1)}kg</div>
                <div className="text-primary-foreground/80">Peso perdido</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{-estadisticas.cambioMedidas.toFixed(1)}cm</div>
                <div className="text-primary-foreground/80">Músculo ganado</div>
              </div>
              <div>
                <div className="text-3xl font-bold">-{estadisticas.mejoraEdadMetabolica}</div>
                <div className="text-primary-foreground/80">Años metabólicos</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{progresoDataLength || 0}</div>
                <div className="text-primary-foreground/80">Registros</div>
              </div>
            </div>
            <p className="text-lg text-primary-foreground/90">
              Has demostrado una dedicación excepcional. ¡Sigue así y alcanzarás todas tus metas!
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}