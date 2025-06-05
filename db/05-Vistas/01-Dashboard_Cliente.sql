-- ===============================================================
-- VISTAS ESTRATÉGICAS DEL SISTEMA DE GIMNASIO
-- Propósito: Proveer información crítica para la toma de decisiones
-- ===============================================================

-- ===============================================================
-- VISTA 1: DASHBOARD INTEGRAL DEL CLIENTE
-- Propósito: Vista ejecutiva que consolida toda la información
-- relevante de cada cliente para análisis rápido y toma de decisiones
-- ===============================================================

CREATE VIEW vw_DashboardCliente AS
SELECT
    -- Información personal básica
    p.cedula,
    p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS nombre_completo,
    p.correo,
    p.fecha_registro,
    DATEDIFF(YEAR, p.fecha_nacimiento, GETDATE()) AS edad,
    nf.nivel AS nivel_fitness,
    c.peso AS peso_actual,

    -- Estado de membresía actual
    m.id_membresia,
    tm.nombre AS tipo_membresia_actual,
    tm.precio AS precio_membresia,
    m.fecha_inicio AS membresia_inicio,
    m.fecha_vencimiento AS membresia_vencimiento,
    em.estado AS estado_membresia,

    -- Análisis de situación de membresía
    CASE
        WHEN m.fecha_vencimiento < GETDATE() THEN 'VENCIDA'
        WHEN DATEDIFF(DAY, GETDATE(), m.fecha_vencimiento) <= 7 THEN 'POR VENCER'
        WHEN DATEDIFF(DAY, GETDATE(), m.fecha_vencimiento) <= 30 THEN 'PRÓXIMA A VENCER'
        ELSE 'VIGENTE'
    END AS situacion_membresia,

    DATEDIFF(DAY, GETDATE(), m.fecha_vencimiento) AS dias_restantes,

    -- Información financiera
    pagos_totales.total_pagado,
    pagos_totales.ultimo_pago,
    pagos_totales.cantidad_pagos,

    -- Información de entrenamiento
    rutinas_info.rutinas_activas,
    rutinas_info.ultimo_entrenador,
    rutinas_info.fecha_ultima_rutina,

    -- Progreso reciente
    progreso_info.ultimo_progreso,
    progreso_info.total_registros_progreso,

    -- Análisis de riesgo de abandono
    CASE
        WHEN m.fecha_vencimiento < GETDATE() THEN 'ALTO'
        WHEN DATEDIFF(DAY, GETDATE(), m.fecha_vencimiento) <= 7 THEN 'ALTO'
        WHEN progreso_info.ultimo_progreso < DATEADD(MONTH, -2, GETDATE()) THEN 'MEDIO'
        WHEN rutinas_info.rutinas_activas = 0 THEN 'MEDIO'
        ELSE 'BAJO'
    END AS riesgo_abandono,

    -- Valor del cliente (LTV aproximado)
    pagos_totales.total_pagado AS valor_total_cliente

FROM Persona p
INNER JOIN Cliente c ON p.cedula = c.cedula_cliente
LEFT JOIN Nivel_Fitness nf ON c.id_nivel_fitness = nf.id_nivel_fitness

-- Membresía más reciente
LEFT JOIN (
    SELECT
        m1.cedula_cliente,
        m1.id_membresia,
        m1.fecha_inicio,
        m1.fecha_vencimiento,
        m1.id_estado_membresia,
        m1.id_tipo_membresia,
        ROW_NUMBER() OVER (PARTITION BY m1.cedula_cliente ORDER BY m1.fecha_vencimiento DESC) as rn
    FROM Membresia m1
) m_ranked ON p.cedula = m_ranked.cedula_cliente AND m_ranked.rn = 1
LEFT JOIN Membresia m ON m_ranked.id_membresia = m.id_membresia
LEFT JOIN Tipo_Membresia tm ON m.id_tipo_membresia = tm.id_tipo_membresia
LEFT JOIN Estado_Membresia em ON m.id_estado_membresia = em.id_estado_membresia

-- Agregaciones de pagos
LEFT JOIN (
    SELECT
        mem.cedula_cliente,
        SUM(pag.monto) AS total_pagado,
        MAX(pag.fecha_pago) AS ultimo_pago,
        COUNT(pag.num_recibo) AS cantidad_pagos
    FROM Membresia mem
    INNER JOIN Pago pag ON mem.id_membresia = pag.id_membresia
    WHERE pag.id_estado = 1 -- Solo pagos completados
    GROUP BY mem.cedula_cliente
) pagos_totales ON p.cedula = pagos_totales.cedula_cliente

-- Información de rutinas
LEFT JOIN (
    SELECT
        r.cedula_cliente,
        COUNT(CASE WHEN r.id_estado_rutina = 1 THEN 1 END) AS rutinas_activas,
        MAX(r.fecha_creacion) AS fecha_ultima_rutina,
        MAX(pe.nombre + ' ' + pe.apellido1) AS ultimo_entrenador
    FROM Rutina r
    LEFT JOIN Entrenador e ON r.cedula_entrenador = e.cedula_entrenador
    LEFT JOIN Persona pe ON e.cedula_entrenador = pe.cedula
    GROUP BY r.cedula_cliente
) rutinas_info ON p.cedula = rutinas_info.cedula_cliente

-- Información de progreso
LEFT JOIN (
    SELECT
        prog.cedula_cliente,
        MAX(prog.fecha) AS ultimo_progreso,
        COUNT(prog.id_progreso) AS total_registros_progreso
    FROM Progreso prog
    GROUP BY prog.cedula_cliente
) progreso_info ON p.cedula = progreso_info.cedula_cliente

WHERE c.estado = 1; -- Solo clientes activos
