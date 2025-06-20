import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// Schema para validar los datos de la vista vw_PerformanceEntrenadores
const TrainerPerformanceSchema = z.object({
  cedula_entrenador: z.string(),
  nombre_completo: z.string(),
  correo: z.string(),
  fecha_ingreso: z.string(),
  meses_en_gimnasio: z.number(),
  cantidad_especialidades: z.number().nullable(),
  lista_especialidades: z.string().nullable(),
  cantidad_certificaciones: z.number().nullable(),
  certificaciones_activas: z.number().nullable(),
  clientes_actuales: z.number().nullable(),
  total_clientes_historicos: z.number().nullable(),
  clientes_nuevos_ultimo_mes: z.number().nullable(),
  rutinas_activas: z.number().nullable(),
  total_rutinas_creadas: z.number().nullable(),
  rutinas_ultimo_mes: z.number().nullable(),
  ejercicios_promedio_por_rutina: z.number().nullable(),
  clases_programadas: z.number().nullable(),
  clases_ultimo_mes: z.number().nullable(),
  total_inscripciones_clases: z.number().nullable(),
  promedio_asistencia_clase: z.number().nullable(),
  clientes_con_membresia_activa: z.number().nullable(),
  tasa_retencion_porcentaje: z.number().nullable(),
  clientes_con_progreso_reciente: z.number().nullable(),
  total_registros_progreso: z.number().nullable(),
  carga_trabajo: z.string().nullable(),
  evaluacion_retencion: z.string().nullable(),
  ingresos_generados_ultimo_mes: z.number().nullable(),
  ingresos_totales_historicos: z.number().nullable(),
})

export type TrainerPerformance = z.infer<typeof TrainerPerformanceSchema>

const TrainersPerformanceResponseSchema = z.object({
  entrenadores: z.array(TrainerPerformanceSchema),
  total: z.number(),
})

export type TrainersPerformanceResponse = z.infer<typeof TrainersPerformanceResponseSchema>

// Simulación de API - reemplazar con llamada real al backend
const fetchEntrenadoresPerformance = async (): Promise<TrainerPerformance> => {

  const data = await fetch('http://localhost:3000/api/views/trainers-performance').then(res => res.json())
  return TrainerPerformanceSchema.parse(data)
  // return TrainersPerformanceResponseSchema.parse(data)

  // Datos simulados para desarrollo
  const mockData: TrainersPerformanceResponse = {
    entrenadores: [
      {
        cedula_entrenador: "1-2345-6789",
        nombre_completo: "Alejandro Quesada Mendoza",
        correo: "alejandro.quesada@headtrainer.com",
        fecha_ingreso: "2021-02-28",
        meses_en_gimnasio: 48,
        cantidad_especialidades: 1,
        lista_especialidades: "Gimnasio",
        cantidad_certificaciones: 2,
        certificaciones_activas: 2,
        clientes_actuales: 15,
        total_clientes_historicos: 32,
        clientes_nuevos_ultimo_mes: 3,
        rutinas_activas: 15,
        total_rutinas_creadas: 28,
        rutinas_ultimo_mes: 4,
        ejercicios_promedio_por_rutina: 8.5,
        clases_programadas: 0,
        clases_ultimo_mes: 0,
        total_inscripciones_clases: 0,
        promedio_asistencia_clase: null,
        clientes_con_membresia_activa: 14,
        tasa_retencion_porcentaje: 93.3,
        clientes_con_progreso_reciente: 12,
        total_registros_progreso: 89,
        carga_trabajo: "ALTA",
        evaluacion_retencion: "EXCELENTE",
        ingresos_generados_ultimo_mes: 675000,
        ingresos_totales_historicos: 2850000,
      },
      {
        cedula_entrenador: "1-1234-5678",
        nombre_completo: "Carlos Eduardo Ramírez Solano",
        correo: "carlos.ramirez@trainer.com",
        fecha_ingreso: "2020-03-22",
        meses_en_gimnasio: 56,
        cantidad_especialidades: 2,
        lista_especialidades: "Gimnasio, CrossFit",
        cantidad_certificaciones: 1,
        certificaciones_activas: 1,
        clientes_actuales: 12,
        total_clientes_historicos: 28,
        clientes_nuevos_ultimo_mes: 2,
        rutinas_activas: 12,
        total_rutinas_creadas: 25,
        rutinas_ultimo_mes: 3,
        ejercicios_promedio_por_rutina: 7.2,
        clases_programadas: 5,
        clases_ultimo_mes: 8,
        total_inscripciones_clases: 45,
        promedio_asistencia_clase: 9.0,
        clientes_con_membresia_activa: 11,
        tasa_retencion_porcentaje: 91.7,
        clientes_con_progreso_reciente: 10,
        total_registros_progreso: 76,
        carga_trabajo: "MEDIA",
        evaluacion_retencion: "EXCELENTE",
        ingresos_generados_ultimo_mes: 540000,
        ingresos_totales_historicos: 3120000,
      },
      {
        cedula_entrenador: "2-2345-6789",
        nombre_completo: "María Fernanda González Herrera",
        correo: "maria.gonzalez@fitnesscr.com",
        fecha_ingreso: "2021-07-15",
        meses_en_gimnasio: 41,
        cantidad_especialidades: 2,
        lista_especialidades: "Gimnasio, CrossFit",
        cantidad_certificaciones: 1,
        certificaciones_activas: 1,
        clientes_actuales: 8,
        total_clientes_historicos: 18,
        clientes_nuevos_ultimo_mes: 1,
        rutinas_activas: 8,
        total_rutinas_creadas: 16,
        rutinas_ultimo_mes: 2,
        ejercicios_promedio_por_rutina: 6.8,
        clases_programadas: 3,
        clases_ultimo_mes: 6,
        total_inscripciones_clases: 32,
        promedio_asistencia_clase: 10.7,
        clientes_con_membresia_activa: 7,
        tasa_retencion_porcentaje: 87.5,
        clientes_con_progreso_reciente: 6,
        total_registros_progreso: 42,
        carga_trabajo: "MEDIA",
        evaluacion_retencion: "EXCELENTE",
        ingresos_generados_ultimo_mes: 360000,
        ingresos_totales_historicos: 1980000,
      },
      {
        cedula_entrenador: "1-3456-7890",
        nombre_completo: "Diego Alberto Morales Vindas",
        correo: "diego.morales@crossfitcr.com",
        fecha_ingreso: "2020-11-08",
        meses_en_gimnasio: 50,
        cantidad_especialidades: 1,
        lista_especialidades: "CrossFit",
        cantidad_certificaciones: 1,
        certificaciones_activas: 1,
        clientes_actuales: 6,
        total_clientes_historicos: 15,
        clientes_nuevos_ultimo_mes: 1,
        rutinas_activas: 6,
        total_rutinas_creadas: 13,
        rutinas_ultimo_mes: 1,
        ejercicios_promedio_por_rutina: 9.2,
        clases_programadas: 8,
        clases_ultimo_mes: 12,
        total_inscripciones_clases: 78,
        promedio_asistencia_clase: 9.8,
        clientes_con_membresia_activa: 5,
        tasa_retencion_porcentaje: 83.3,
        clientes_con_progreso_reciente: 4,
        total_registros_progreso: 28,
        carga_trabajo: "BAJA",
        evaluacion_retencion: "EXCELENTE",
        ingresos_generados_ultimo_mes: 270000,
        ingresos_totales_historicos: 1650000,
      }
    ],
    total: 4
  }

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500))

  return TrainersPerformanceResponseSchema.parse(mockData)
}

export const useTrainersPerformance = () => {
  return useQuery({
    queryKey: ['entrenadores-performance'],
    queryFn: fetchEntrenadoresPerformance,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}