import {
  Card,
  CardBody,
  CardHeader,
} from '@heroui/card'
import {
  Target,
  Award, Trophy
} from 'lucide-react'

interface Props {
  logrosData: Array<{
    fecha: string;
    titulo: string;
    descripcion: string;
    tipo: string;
  }>
}

export const LogrosTab = ({ logrosData }: Props) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-xl font-bold text-foreground">Historial de Logros y Hitos</h3>
            <p className="text-default-500">Tus momentos más importantes en este viaje</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {logrosData.map((logro, index) => {
              const iconos = {
                'logro': Trophy,
                'milestone': Target,
                'record': Award
              }
              const colores = {
                'logro': 'warning',
                'milestone': 'primary',
                'record': 'secondary'
              }
              const Icon = iconos[logro.tipo] || Trophy

              return (
                <Card key={index} shadow="sm" className="bg-default-50">
                  <CardBody>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full bg-${colores[logro.tipo]}/10 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 text-${colores[logro.tipo]}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground">{logro.titulo}</h4>
                          <span className="text-sm text-default-500">
                            {new Date(logro.fecha).toLocaleDateString('es-CR')}
                          </span>
                        </div>
                        <p className="text-default-600">{logro.descripcion}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}