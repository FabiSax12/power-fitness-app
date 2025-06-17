
/**
 * "id_membresia": null,
    "tipo_membresia_actual": null,
    "precio_membresia": null,
    "membresia_inicio": null,
    "membresia_vencimiento": null,
    "estado_membresia": null,

    "dias_restantes": null,
    "total_pagado": null,
    "ultimo_pago": null,
    "cantidad_pagos": null,
    "rutinas_activas": null,
    "ultimo_entrenador": null,
    "fecha_ultima_rutina": null,
    "ultimo_progreso": null,
    "total_registros_progreso": null,

     "valor_total_cliente": null
 */

export interface VWDashboardCliente {
  cedula: string
  nombre_completo: string
  correo: string
  fecha_registro: string
  edad: number
  nivel_fitness: string
  peso_actual: number
  id_membresia: number | null
  tipo_membresia_actual: string | null
  precio_membresia: number | null
  membresia_inicio: string | null
  membresia_vencimiento: string | null
  estado_membresia: string | null
  situacion_membresia: string
  dias_restantes: number | null
  total_pagado: number | null
  ultimo_pago: string | null
  cantidad_pagos: number | null
  rutinas_activas: number | null
  ultimo_entrenador: string | null
  fecha_ultima_rutina: string | null // Date
  ultimo_progreso: string | null// Date
  total_registros_progreso: number | null
  riesgo_abandono: string
  valor_total_cliente: number | null
}
