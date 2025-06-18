CREATE VIEW vw_AnalisisFinanciero AS
WITH
-- CTE 1: Clasificar pagos como nuevos o renovaciones basado en orden de pago por membresía
PagosClasificados AS (
    SELECT
        p.num_recibo,
        p.monto,
        p.id_metodo_pago,
        p.fecha_pago,
        p.id_membresia,
        m.cedula_cliente,
        m.fecha_inicio AS fecha_inicio_membresia,
        m.fecha_vencimiento,
        tm.id_tipo_membresia,
        tm.nombre AS tipo_membresia,
        tm.precio AS precio_base,
        f.frecuencia AS frecuencia_pago,
        mp.nombre AS metodo_pago,

        -- Extraer componentes temporales
        YEAR(p.fecha_pago) AS año,
        MONTH(p.fecha_pago) AS mes,
        DATENAME(MONTH, p.fecha_pago) AS nombre_mes,
        YEAR(p.fecha_pago) * 100 + MONTH(p.fecha_pago) AS periodo_yyyymm,

        -- Clasificar pagos por orden dentro de cada membresía
        ROW_NUMBER() OVER (
            PARTITION BY p.id_membresia
            ORDER BY p.fecha_pago ASC
        ) AS numero_pago_en_membresia,

        -- DETERMINAR SI ES RENOVACIÓN O CLIENTE NUEVO
        CASE
            WHEN ROW_NUMBER() OVER (
                PARTITION BY p.id_membresia
                ORDER BY p.fecha_pago ASC
            ) = 1 THEN 0  -- Primer pago = Cliente nuevo
            ELSE 1        -- Pagos posteriores = Renovación
        END AS es_renovacion

    FROM Pago p
    INNER JOIN Membresia m ON p.id_membresia = m.id_membresia
    INNER JOIN Tipo_Membresia tm ON m.id_tipo_membresia = tm.id_tipo_membresia
    INNER JOIN Frecuencia f ON tm.id_frecuencia = f.id_frecuencia
    INNER JOIN Metodo_Pago mp ON p.id_metodo_pago = mp.id_metodo_pago
    WHERE p.id_estado = 1 -- Solo pagos completados exitosamente
),

-- CTE 2: Método de pago preferido por período y tipo de membresía
MetodoPagoPorPeriodo AS (
    SELECT
        año,
        mes,
        tipo_membresia,
        metodo_pago,
        COUNT(*) AS cantidad_usos,
        ROW_NUMBER() OVER (
            PARTITION BY año, mes, tipo_membresia
            ORDER BY COUNT(*) DESC
        ) AS ranking
    FROM PagosClasificados
    GROUP BY año, mes, tipo_membresia, metodo_pago
),

-- CTE 3: Clientes que renovaron por período y tipo
ClientesQueRenovaron AS (
    SELECT
        año,
        mes,
        tipo_membresia,
        cedula_cliente
    FROM PagosClasificados
    WHERE es_renovacion = 1
    GROUP BY año, mes, tipo_membresia, cedula_cliente
),

-- CTE 4: Datos agregados principales
DatosAgregados AS (
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

        -- MÉTRICAS FINANCIERAS AGREGADAS
        COUNT(num_recibo) AS cantidad_pagos,
        COUNT(DISTINCT cedula_cliente) AS clientes_unicos,
        SUM(monto) AS ingresos_totales,
        AVG(monto) AS ticket_promedio,
        MIN(monto) AS pago_minimo,
        MAX(monto) AS pago_maximo,

        -- ANÁLISIS DE MÉTODOS DE PAGO
        COUNT(DISTINCT id_metodo_pago) AS metodos_pago_usados,

        -- MÉTRICAS DE RETENCIÓN Y RENOVACIÓN
        SUM(CASE WHEN es_renovacion = 1 THEN 1 ELSE 0 END) AS pagos_renovacion,
        SUM(CASE WHEN es_renovacion = 0 THEN 1 ELSE 0 END) AS pagos_clientes_nuevos,

        COUNT(DISTINCT CASE WHEN es_renovacion = 1 THEN cedula_cliente END) AS clientes_renovacion,
        COUNT(DISTINCT CASE WHEN es_renovacion = 0 THEN cedula_cliente END) AS clientes_nuevos,

        -- PROYECCIÓN DE INGRESOS
        SUM(CASE WHEN fecha_vencimiento > GETDATE() THEN 1 ELSE 0 END) AS membresías_activas_fin_periodo,
        SUM(CASE WHEN fecha_vencimiento > GETDATE() THEN precio_base ELSE 0 END) AS ingresos_proyectados_proximo_periodo

    FROM PagosClasificados
    GROUP BY
        año, mes, nombre_mes, periodo_yyyymm,
        id_tipo_membresia, tipo_membresia, precio_base, frecuencia_pago
)

-- CONSULTA PRINCIPAL: Combinar todos los datos
SELECT
    da.*,

    -- CÁLCULO DE TASAS DE RENOVACIÓN
    CASE
        WHEN da.cantidad_pagos > 0
        THEN CAST(da.pagos_renovacion AS DECIMAL(10,2)) / da.cantidad_pagos * 100
        ELSE 0
    END AS tasa_renovacion_pagos_porcentaje,

    CASE
        WHEN da.clientes_unicos > 0
        THEN CAST(da.clientes_renovacion AS DECIMAL(10,2)) / da.clientes_unicos * 100
        ELSE 0
    END AS tasa_renovacion_clientes_porcentaje,

    -- MÉTRICAS ADICIONALES SIN AGREGACIONES ANIDADAS
    CASE
        WHEN da.clientes_unicos > 0
        THEN CAST(da.cantidad_pagos AS DECIMAL(10,2)) / da.clientes_unicos
        ELSE 0
    END AS promedio_pagos_por_cliente,

    CASE
        WHEN da.clientes_unicos > 0
        THEN da.ingresos_totales / da.clientes_unicos
        ELSE 0
    END AS ingresos_promedio_por_cliente,

    -- MÉTODO DE PAGO PREFERIDO
    ISNULL(mpp.metodo_pago, 'No definido') AS metodo_pago_preferido

FROM DatosAgregados da
LEFT JOIN MetodoPagoPorPeriodo mpp ON da.año = mpp.año
                                  AND da.mes = mpp.mes
                                  AND da.tipo_membresia = mpp.tipo_membresia
                                  AND mpp.ranking = 1;