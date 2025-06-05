CREATE VIEW vw_AnalisisFinanciero AS
WITH ClienteMembresia AS (
    -- Identificar si cada membresía es renovación o nueva
    SELECT
        m.id_membresia,
        m.cedula_cliente,
        m.id_tipo_membresia,
        m.fecha_inicio,
        m.fecha_vencimiento,
        CASE WHEN EXISTS (
            SELECT 1 FROM Membresia m2
            WHERE m2.cedula_cliente = m.cedula_cliente
            AND m2.fecha_inicio < m.fecha_inicio
        ) THEN 1 ELSE 0 END AS es_renovacion
    FROM Membresia m
),
PagosDatos AS (
    -- Datos base de pagos con información temporal y de membresía
    SELECT
        p.num_recibo,
        p.monto,
        p.id_metodo_pago,
        p.fecha_pago,
        YEAR(p.fecha_pago) AS año,
        MONTH(p.fecha_pago) AS mes,
        DATENAME(MONTH, p.fecha_pago) AS nombre_mes,
        YEAR(p.fecha_pago) * 100 + MONTH(p.fecha_pago) AS periodo_yyyymm,
        cm.cedula_cliente,
        cm.es_renovacion,
        cm.fecha_vencimiento,
        tm.id_tipo_membresia,
        tm.nombre AS tipo_membresia,
        tm.precio AS precio_base,
        f.frecuencia AS frecuencia_pago
    FROM Pago p
    INNER JOIN Membresia m ON p.id_membresia = m.id_membresia
    INNER JOIN ClienteMembresia cm ON m.id_membresia = cm.id_membresia
    INNER JOIN Tipo_Membresia tm ON m.id_tipo_membresia = tm.id_tipo_membresia
    INNER JOIN Frecuencia f ON tm.id_frecuencia = f.id_frecuencia
    INNER JOIN Metodo_Pago mp ON p.id_metodo_pago = mp.id_metodo_pago
    WHERE p.id_estado = 1 -- Solo pagos completados exitosamente
)
SELECT
    -- Dimensiones temporales
    año,
    mes,
    nombre_mes,
    periodo_yyyymm,

    -- Información del tipo de membresía
    tipo_membresia,
    precio_base,
    frecuencia_pago,

    -- Métricas financieras agregadas
    COUNT(num_recibo) AS cantidad_pagos,
    COUNT(DISTINCT cedula_cliente) AS clientes_unicos,
    SUM(monto) AS ingresos_totales,
    AVG(monto) AS ticket_promedio,
    MIN(monto) AS pago_minimo,
    MAX(monto) AS pago_maximo,

    -- Análisis de métodos de pago
    COUNT(DISTINCT id_metodo_pago) AS metodos_pago_usados,

    -- Métricas de retención y renovación (ahora sin subconsultas anidadas)
    SUM(CASE WHEN es_renovacion = 1 THEN 1 ELSE 0 END) AS clientes_renovacion,
    SUM(CASE WHEN es_renovacion = 0 THEN 1 ELSE 0 END) AS clientes_nuevos,

    -- Cálculo de tasa de renovación (sin anidar agregaciones)
    CASE
        WHEN COUNT(DISTINCT cedula_cliente) > 0
        THEN CAST(SUM(CASE WHEN es_renovacion = 1 THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
             COUNT(DISTINCT cedula_cliente) * 100
        ELSE 0
    END AS tasa_renovacion_porcentaje,

    -- Proyección de ingresos
    SUM(CASE WHEN fecha_vencimiento > GETDATE() THEN 1 ELSE 0 END) AS membresías_activas_fin_periodo,
    SUM(CASE WHEN fecha_vencimiento > GETDATE() THEN precio_base ELSE 0 END) AS ingresos_proyectados_proximo_periodo

FROM PagosDatos
GROUP BY
    año,
    mes,
    nombre_mes,
    periodo_yyyymm,
    id_tipo_membresia,
    tipo_membresia,
    precio_base,
    frecuencia_pago;