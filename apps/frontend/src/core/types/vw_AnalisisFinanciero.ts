export interface VWAnalisisFinanciero {
  año: number;
  mes: number;
  nombre_mes: string;
  periodo_yyyymm: number;
  tipo_membresia: string;
  precio_base: number;
  frecuencia_pago: string;
  cantidad_pagos: number;
  clientes_unicos: number;
  ingresos_totales: number;
  ticket_promedio: number;
  pago_minimo: number;
  pago_maximo: number;
  metodos_pago_usados: number;
  clientes_renovacion: number;
  clientes_nuevos: number;
  tasa_renovacion_porcentaje: number;
  membresías_activas_fin_periodo: number;
  ingresos_proyectados_proximo_periodo: number;
}