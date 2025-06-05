-- Propósito: Optimizar la consulta más crítica del sistema
-- Permite verificar rápidamente el estado de membresía de un cliente
-- Útil para: Control de acceso, dashboard del cliente, reportes
CREATE NONCLUSTERED INDEX IX_Membresia_Cliente_Estado
ON Membresia (cedula_cliente, id_estado_membresia)
INCLUDE (fecha_inicio, fecha_vencimiento, id_tipo_membresia);


-- Propósito: Optimizar consultas de rutinas de entrenamiento
-- Permite encontrar rápidamente las rutinas activas de un cliente
-- Útil para: App móvil, seguimiento de entrenamientos, asignación de rutinas
CREATE NONCLUSTERED INDEX IX_Rutina_Cliente_Activa
ON Rutina (cedula_cliente, id_estado_rutina, fecha_creacion DESC)
INCLUDE (cedula_entrenador, id_tipo_rutina, descripcion);


-- Propósito: Optimizar reportes financieros y análisis de ingresos
-- Permite generar rápidamente reportes de ingresos por período
-- Útil para: Reportes mensuales, análisis de tendencias, facturación
CREATE NONCLUSTERED INDEX IX_Pago_Fecha_Estado
ON Pago (fecha_pago DESC, id_estado)
INCLUDE (monto, id_metodo_pago, id_membresia);