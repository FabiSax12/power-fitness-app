export interface Pago {
  num_recibo: number
  metodo_pago: string
  tipo_membresia: string
  estado_membresia: string
  estado_pago: string
  fecha_inicio: string
  fecha_pago: string
  fecha_vencimiento: string
  frecuencia: string
  monto: number
  precio: number
}
