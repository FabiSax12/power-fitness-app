export interface VWDashboardCliente {
  cedula: string
  nombre_completo: string
  correo: string
  fecha_registro: string
  edad: number
  nivel_fitness: string
  peso_actual: number
  id_membresia: number
  tipo_membresia_actual: string
  precio_membresia: number
  membresia_inicio: string
  membresia_vencimiento: string
  estado_membresia: string
  situacion_membresia: string
  dias_restantes: number
  total_pagado: number
  ultimo_pago: string
  cantidad_pagos: number
  rutinas_activas: number | null
  ultimo_entrenador: string | null
  fecha_ultima_rutina: string | null // Date
  ultimo_progreso: string | null// Date
  total_registros_progreso: number | null
  riesgo_abandono: string
  valor_total_cliente: number
}
