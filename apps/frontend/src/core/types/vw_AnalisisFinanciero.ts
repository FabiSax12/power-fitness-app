export interface VWAnalisisFinanciero {
  año: number
  mes: number
  nombre_mes: string
  periodo_yyyymm: number
  tipo_membresia: string
  precio_base: number
  frecuencia_pago: string
  cantidad_pagos: number
  clientes_unicos: number
  ingresos_totales: number
  ticket_promedio: number
  pago_minimo: number
  pago_maximo: number
  metodos_pago_usados: number
  pagos_renovacion: number
  pagos_clientes_nuevos: number
  clientes_renovacion: number
  clientes_nuevos: number
  membresías_activas_fin_periodo: number
  ingresos_proyectados_proximo_periodo: number
  tasa_renovacion_pagos_porcentaje: number
  tasa_renovacion_clientes_porcentaje: number
  promedio_pagos_por_cliente: number
  ingresos_promedio_por_cliente: number
  metodo_pago_preferido: string
}