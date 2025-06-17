export interface VW_ProgresoCliente {
  // Información del cliente
  cedula: string
  nombre_completo: string
  correo: string
  peso_registrado_cliente: number // Peso inicial del cliente en su perfil
  nivel_fitness: string
  edad_actual: number

  // Información del progreso específico
  id_progreso: number
  fecha: string
  peso_progreso: number // Peso registrado en este progreso específico (NUEVO)
  porcentaje_grasa: number // % de grasa corporal (NUEVO)
  edad_metabolica: number
  año: number
  mes: number
  nombre_mes: string
  periodo_legible: string
  numero_registro: number
  es_primer_registro: number
  es_ultimo_registro: number

  // Mediciones del registro (medidas corporales en cm)
  grupos_musculares_medidos: number
  medida_promedio_cm: number
  medida_minima_cm: number
  medida_maxima_cm: number

  // Mediciones por grupo muscular específico (en centímetros - ACTUALIZADAS)
  biceps_cm: number
  pectorales_cm: number
  cuadriceps_cm: number
  gluteos_cm: number
  espalda_cm: number
  abdominales_cm: number
  hombros_cm: number
  triceps_cm: number
  pantorrillas_cm: number
  isquiotibiales_cm: number
  core_cm: number
  antebrazos_cm: number
  cintura_cm: number // NUEVO
  cadera_cm: number // NUEVO
  cuello_cm: number // NUEVO
  muslo_cm: number // NUEVO
  brazo_cm: number // NUEVO

  // Detalles del progreso
  detalles_completos: string
  logros_count: number
  objetivos_count: number
  total_detalles: number

  // Estadísticas comparativas del cliente
  total_registros: number
  fecha_inicio: string
  fecha_ultimo_registro: string
  dias_total_seguimiento: number

  // Cambios totales (desde el inicio hasta ahora - ACTUALIZADOS)
  cambio_peso: number // Cambio en peso corporal (kg)
  reduccion_grasa_porcentaje: number // Reducción en % de grasa corporal
  mejora_edad_metabolica: number // Mejora en edad metabólica (años)
  cambio_medidas_promedio: number // Cambio promedio en medidas corporales (cm)

  // Cálculos de progreso porcentual (ACTUALIZADOS)
  cambio_peso_pct: number
  reduccion_grasa_pct: number
  mejora_edad_metabolica_pct: number
  cambio_medidas_pct: number

  // Indicadores de evaluación (ACTUALIZADOS)
  evaluacion_constancia: string
  evaluacion_progreso_general: string // Antes era evaluacion_progreso_muscular
  evaluacion_grasa_corporal: string // NUEVO

  // Información del entrenador
  entrenador_actual: string

  // Métricas adicionales (NUEVAS)
  frecuencia_registro_mensual: number
  imc_estimado: number | null
}

export interface ProgresoCliente {
  id_progreso: number
  fecha: string
  fecha_legible: string
  peso_kg: number
  porcentaje_grasa: number
  edad_metabolica: number
  detalles: DetalleProgreso[]
  mediciones: MedicionProgreso[]
  cantidad_detalles: number
  cantidad_mediciones: number
}

export interface DetalleProgreso {
  id_detalles: number
  titulo: string
  descripcion: string
}

export interface MedicionProgreso {
  id_medicion: number
  musculo_nombre: string
  medida_cm: number
}