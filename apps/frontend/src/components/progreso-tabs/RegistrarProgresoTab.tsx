import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Textarea } from "@heroui/input"
import { DatePicker } from "@heroui/date-picker"
import { Select, SelectItem } from "@heroui/select"
import { Divider } from "@heroui/divider"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { z } from "zod"
import {
  Plus,
  Trash2,
  Calendar,
  FileText,
  Activity,
  Save,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { useAuthStore } from "@/modules/auth/stores/authStore"
import { parseDate, getLocalTimeZone, today, type CalendarDate } from "@internationalized/date"

// Esquemas de validación
const detalleSchema = z.object({
  titulo: z.string().min(1, "El título es requerido").max(30, "Máximo 30 caracteres"),
  descripcion: z.string().min(1, "La descripción es requerida").max(255, "Máximo 255 caracteres")
})

const medicionSchema = z.object({
  musculo: z.string().min(1, "Selecciona un grupo muscular"),
  cm: z.number().min(0, "Debe ser mayor a 0").max(200, "Máximo 200cm"),
})

const formSchema = z.object({
  fecha: z.custom<CalendarDate>((date) => {
    if (!date || typeof date.compare !== "function") return false
    // No permitir fechas futuras
    return date.compare(today(getLocalTimeZone())) <= 0
  }, {
    message: "La fecha no puede ser futura"
  }),
  detalles: z.array(detalleSchema).min(1, "Agrega al menos un detalle"),
  mediciones: z.array(medicionSchema).min(1, "Agrega al menos una medición"),
  porcentaje_grasa: z.number().min(0, "Debe ser mayor a 0").max(100, "Máximo 100%"),
  edad_metabolica: z.number().min(10, "Mínimo 10 años").max(100, "Máximo 100 años"),
  peso_kg: z.number().min(0, "Debe ser mayor a 0").max(500, "Máximo 500kg"),
})

// Grupos musculares disponibles
const gruposMusculares = [
  'Bíceps', 'Tríceps', 'Pectorales', 'Espalda', 'Hombros',
  'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Pantorrillas',
  'Abdominales', 'Core', 'Antebrazos'
]

interface Props {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export const RegistrarProgresoTab = ({ onSuccess, onError }: Props) => {
  const cedula_cliente = useAuthStore((state) => state.user?.cedula)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const form = useForm({
    validators: {
      onChange: formSchema
    },
    defaultValues: {
      fecha: parseDate(new Date().toISOString().split('T')[0]),
      detalles: [{ titulo: "", descripcion: "" }],
      mediciones: [{
        musculo: "",
        cm: 1,
      }],
      porcentaje_grasa: 0,
      peso_kg: 30,
      edad_metabolica: 25,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      setSubmitStatus(null)

      try {
        // Formatear detalles: 'titulo1:descripcion1,titulo2:descripcion2'
        const detallesString = value.detalles
          .filter(d => d.titulo.trim() && d.descripcion.trim())
          .map(d => `${d.titulo.trim()}:${d.descripcion.trim()}`)
          .join(',')

        // Formatear mediciones: 'musculo:kg_musculo:kg_grasa:cm:edad_metabolica'
        const medicionesString = value.mediciones
          .filter(m => m.musculo.trim())
          .map(m => `${m.musculo}:${m.cm}`)
          .join(',')

        // Validar que tenemos datos
        if (!detallesString || !medicionesString) {
          throw new Error('Debes completar al menos un detalle y una medición')
        }

        const response = await fetch(`http://localhost:3000/api/clientes/${cedula_cliente}/progreso`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fecha: value.fecha.toString(),
            peso_kg: value.peso_kg,
            porcentaje_grasa: value.porcentaje_grasa,
            edad_metabolica: value.edad_metabolica,
            detalles: detallesString,
            mediciones: medicionesString
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Error al registrar progreso')
        }

        const result = await response.json()
        setSubmitStatus('success')

        // Resetear formulario
        form.reset()

        if (onSuccess) {
          onSuccess(result)
        }

      } catch (error) {
        console.error('Error:', error)
        setSubmitStatus('error')
        if (onError) {
          onError(error.message)
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  })

  const agregarDetalle = () => {
    const detallesActuales = form.getFieldValue('detalles')
    form.setFieldValue('detalles', [...detallesActuales, { titulo: "", descripcion: "" }])
  }

  const eliminarDetalle = (index: number) => {
    const detallesActuales = form.getFieldValue('detalles')
    if (detallesActuales.length > 1) {
      form.setFieldValue('detalles', detallesActuales.filter((_, i) => i !== index))
    }
  }

  const agregarMedicion = () => {
    const medicionesActuales = form.getFieldValue('mediciones')
    form.setFieldValue('mediciones', [...medicionesActuales, {
      musculo: "",
      kg_musculo: 0,
      cm: 0
    }])
  }

  const eliminarMedicion = (index: number) => {
    const medicionesActuales = form.getFieldValue('mediciones')
    if (medicionesActuales.length > 1) {
      form.setFieldValue('mediciones', medicionesActuales.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Estado de envío */}
      {submitStatus === 'success' && (
        <Card className="bg-success-50 border-success-200">
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <CheckCircle className="w-5 h-5 text-success" />
            <p className="text-success-700">¡Progreso registrado exitosamente!</p>
          </CardBody>
        </Card>
      )}

      {submitStatus === 'error' && (
        <Card className="bg-danger-50 border-danger-200">
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <AlertCircle className="w-5 h-5 text-danger" />
            <p className="text-danger-700">Error al registrar el progreso. Inténtalo de nuevo.</p>
          </CardBody>
        </Card>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        {/* Fecha */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Fecha del Registro</h3>
            </div>
          </CardHeader>
          <CardBody>
            <form.Field name="fecha">
              {(field) => (
                <DatePicker
                  label="Fecha"
                  value={field.state.value}
                  maxValue={today(getLocalTimeZone())}
                  onChange={(date) => field.handleChange(date ?? parseDate(new Date().toISOString()))}
                  isInvalid={field.state.meta.errors.length > 0}
                  errorMessage={field.state.meta.errors[0]?.message}
                  className="max-w-sm"
                />
              )}
            </form.Field>
          </CardBody>
        </Card>

        {/* Detalles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Detalles del Progreso</h3>
              </div>
              <Button
                type="button"
                color="primary"
                variant="bordered"
                size="sm"
                startContent={<Plus className="w-4 h-4" />}
                onPress={agregarDetalle}
              >
                Agregar Detalle
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <form.Field name="detalles">
              {(field) => (
                <div className="space-y-4">
                  {field.state.value.map((detalle, index) => (
                    <Card key={index} shadow="sm" className="bg-default-50">
                      <CardBody>
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <Input
                              label="Título"
                              placeholder="ej: Nuevo récord personal"
                              value={detalle.titulo}
                              onChange={(e) => {
                                const newDetalles = [...field.state.value]
                                newDetalles[index].titulo = e.target.value
                                field.handleChange(newDetalles)
                              }}
                              maxLength={30}
                            />
                            <Textarea
                              label="Descripción"
                              placeholder="Describe tu logro o progreso..."
                              value={detalle.descripcion}
                              onChange={(e) => {
                                const newDetalles = [...field.state.value]
                                newDetalles[index].descripcion = e.target.value
                                field.handleChange(newDetalles)
                              }}
                              maxLength={255}
                              minRows={2}
                            />
                          </div>
                          {field.state.value.length > 1 && (
                            <Button
                              type="button"
                              color="danger"
                              variant="light"
                              size="sm"
                              isIconOnly
                              onClick={() => eliminarDetalle(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </form.Field>
          </CardBody>
        </Card>

        {/* Mediciones */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Mediciones Corporales</h3>
              </div>
              <Button
                type="button"
                color="primary"
                variant="bordered"
                size="sm"
                startContent={<Plus className="w-4 h-4" />}
                onClick={agregarMedicion}
              >
                Agregar Medición
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 mb-4">
              <form.Field name="peso_kg">
                {
                  (field) => <Input
                    type="number"
                    label="Peso (kg)"
                    placeholder="30.0"
                    step="0.1"
                    min="30"
                    max="100"
                    value={field.state.value.toString()}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      field.handleChange(value)
                    }}
                  />
                }
              </form.Field>

              <form.Field name="porcentaje_grasa">
                {
                  (field) => <Input
                    type="number"
                    label="Grasa Corporal (%)"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    max="100"
                    value={field.state.value.toString()}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      field.handleChange(value)
                    }}
                  />
                }
              </form.Field>

              <form.Field name="edad_metabolica">
                {
                  (field) => <Input
                    type="number"
                    label="Edad Metabólica"
                    placeholder="25"
                    min="10"
                    max="100"
                    value={field.state.value.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 25
                      field.handleChange(value)
                    }}
                  />
                }
              </form.Field>

            </div>

            <form.Field name="mediciones">
              {(field) => (
                <div className="space-y-4">
                  {field.state.value.map((medicion, index) => (
                    <Card key={index} shadow="sm" className="bg-default-50">
                      <CardBody>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <Select
                                label="Grupo Muscular"
                                placeholder="Selecciona músculo"
                                selectedKeys={medicion.musculo ? [medicion.musculo] : []}
                                onSelectionChange={(keys) => {
                                  const newMediciones = [...field.state.value]
                                  newMediciones[index].musculo = String(Array.from(keys)[0] || "")
                                  field.handleChange(newMediciones)
                                }}
                              >
                                {gruposMusculares.map((musculo) => (
                                  <SelectItem key={musculo}>
                                    {musculo}
                                  </SelectItem>
                                ))}
                              </Select>
                              <Input
                                type="number"
                                label="Medida (cm)"
                                placeholder="0.0"
                                step="0.1"
                                min="0"
                                max="200"
                                value={medicion.cm.toString()}
                                onChange={(e) => {
                                  const newMediciones = [...field.state.value]
                                  newMediciones[index].cm = parseFloat(e.target.value) || 0
                                  field.handleChange(newMediciones)
                                }}
                              />

                            </div>
                          </div>

                          {field.state.value.length > 1 && (
                            <Button
                              type="button"
                              color="danger"
                              variant="light"
                              size="sm"
                              isIconOnly
                              onClick={() => eliminarMedicion(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </form.Field>
          </CardBody>
        </Card>

        <Divider />

        {/* Botón de envío */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            color="default"
            variant="bordered"
            onClick={() => form.reset()}
            isDisabled={isSubmitting}
          >
            Limpiar Formulario
          </Button>

          <Button
            type="submit"
            color="primary"
            startContent={<Save className="w-4 h-4" />}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Progreso'}
          </Button>
        </div>
      </form>
    </div>
  )
}