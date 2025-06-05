CREATE VIEW vw_PerformanceEntrenadores AS
WITH
-- Conteo de ejercicios por rutina
EjerciciosPorRutina AS (
    SELECT
        r.id_rutina,
        r.cedula_entrenador,
        COUNT(er.id_ejercicio_rutina) AS num_ejercicios
    FROM Rutina r
    LEFT JOIN Ejercicio_Rutina er ON r.id_rutina = er.id_rutina
    GROUP BY r.id_rutina, r.cedula_entrenador
),
-- Conteo de inscripciones por clase
InscripcionesPorClase AS (
    SELECT
        cl.id_clase,
        cl.cedula_entrenador,
        COUNT(ic.id_cliente) AS num_inscripciones
    FROM Clase cl
    LEFT JOIN Inscripcion_Clase ic ON cl.id_clase = ic.id_clase
    GROUP BY cl.id_clase, cl.cedula_entrenador
),
-- Estadísticas de rutinas (ahora sin agregación anidada)
EstadisticasRutinas AS (
    SELECT
        r.cedula_entrenador,
        COUNT(CASE WHEN r.id_estado_rutina = 1 THEN 1 END) AS rutinas_activas,
        COUNT(r.id_rutina) AS total_rutinas_creadas,
        COUNT(CASE
            WHEN r.fecha_creacion >= DATEADD(MONTH, -1, GETDATE()) THEN 1
        END) AS rutinas_ultimo_mes
    FROM Rutina r
    GROUP BY r.cedula_entrenador
),
-- Promedio de ejercicios por rutina (calculado correctamente)
PromedioEjerciciosRutina AS (
    SELECT
        cedula_entrenador,
        AVG(CAST(num_ejercicios AS DECIMAL(10,2))) AS ejercicios_promedio_por_rutina
    FROM EjerciciosPorRutina
    GROUP BY cedula_entrenador
),
-- Estadísticas de clases (ahora sin agregación anidada)
EstadisticasClases AS (
    SELECT
        cl.cedula_entrenador,
        COUNT(CASE WHEN cl.fecha >= GETDATE() THEN 1 END) AS clases_programadas,
        COUNT(CASE
            WHEN cl.fecha >= DATEADD(MONTH, -1, GETDATE()) AND cl.fecha <= GETDATE() THEN 1
        END) AS clases_ultimo_mes,
        SUM(CASE WHEN ic.id_cliente IS NOT NULL THEN 1 ELSE 0 END) AS total_inscripciones_clases
    FROM Clase cl
    LEFT JOIN Inscripcion_Clase ic ON cl.id_clase = ic.id_clase
    GROUP BY cl.cedula_entrenador
),
-- Promedio de asistencia por clase (calculado correctamente)
PromedioAsistenciaClase AS (
    SELECT
        cedula_entrenador,
        AVG(CAST(num_inscripciones AS DECIMAL(10,2))) AS promedio_asistencia_clase
    FROM InscripcionesPorClase
    GROUP BY cedula_entrenador
)
-- Consulta principal (ahora usando las CTEs)
SELECT
    -- Información básica del entrenador
    p.cedula AS cedula_entrenador,
    p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS nombre_completo,
    p.correo,
    p.fecha_registro AS fecha_ingreso,
    DATEDIFF(MONTH, p.fecha_registro, GETDATE()) AS meses_en_gimnasio,

    -- Especialidades del entrenador
    especialidades.cantidad_especialidades,
    especialidades.lista_especialidades,

    -- Certificaciones
    certificaciones.cantidad_certificaciones,
    certificaciones.certificaciones_activas,

    -- Métricas de clientes
    clientes_stats.clientes_actuales,
    clientes_stats.total_clientes_historicos,
    clientes_stats.clientes_nuevos_ultimo_mes,

    -- Métricas de rutinas (usando múltiples CTEs ahora)
    er.rutinas_activas,
    er.total_rutinas_creadas,
    er.rutinas_ultimo_mes,
    per.ejercicios_promedio_por_rutina,

    -- Métricas de clases (usando múltiples CTEs ahora)
    ec.clases_programadas,
    ec.clases_ultimo_mes,
    ec.total_inscripciones_clases,
    pac.promedio_asistencia_clase,

    -- Análisis de retención de clientes
    retencion_stats.clientes_con_membresia_activa,
    CASE
        WHEN clientes_stats.clientes_actuales > 0
        THEN CAST(retencion_stats.clientes_con_membresia_activa AS DECIMAL(10,2)) / clientes_stats.clientes_actuales * 100
        ELSE 0
    END AS tasa_retencion_porcentaje,

    -- Progreso de clientes bajo su supervisión
    progreso_stats.clientes_con_progreso_reciente,
    progreso_stats.total_registros_progreso,

    -- Indicadores de performance
    CASE
        WHEN clientes_stats.clientes_actuales >= 15 THEN 'ALTA'
        WHEN clientes_stats.clientes_actuales >= 8 THEN 'MEDIA'
        ELSE 'BAJA'
    END AS carga_trabajo,

    CASE
        WHEN retencion_stats.clientes_con_membresia_activa / NULLIF(clientes_stats.clientes_actuales, 0) >= 0.8 THEN 'EXCELENTE'
        WHEN retencion_stats.clientes_con_membresia_activa / NULLIF(clientes_stats.clientes_actuales, 0) >= 0.6 THEN 'BUENO'
        WHEN retencion_stats.clientes_con_membresia_activa / NULLIF(clientes_stats.clientes_actuales, 0) >= 0.4 THEN 'REGULAR'
        ELSE 'NECESITA MEJORA'
    END AS evaluacion_retencion,

    -- Valor generado (aproximado por los ingresos de sus clientes)
    ingresos_stats.ingresos_generados_ultimo_mes,
    ingresos_stats.ingresos_totales_historicos

FROM Persona p
INNER JOIN Entrenador e ON p.cedula = e.cedula_entrenador

-- Especialidades (sin cambios)
LEFT JOIN (
    SELECT
        ee.id_entrenador,
        COUNT(esp.id_especialidad) AS cantidad_especialidades,
        STUFF((
            SELECT ', ' + esp2.nombre
            FROM Entrenador_Especialidad ee2
            INNER JOIN Especialidad esp2 ON ee2.id_especialidad = esp2.id_especialidad
            WHERE ee2.id_entrenador = ee.id_entrenador
            FOR XML PATH('')
        ), 1, 2, '') AS lista_especialidades
    FROM Entrenador_Especialidad ee
    INNER JOIN Especialidad esp ON ee.id_especialidad = esp.id_especialidad
    GROUP BY ee.id_entrenador
) especialidades ON e.cedula_entrenador = especialidades.id_entrenador

-- Certificaciones (sin cambios)
LEFT JOIN (
    SELECT
        ec.id_entrenador,
        COUNT(c.id_certificacion) AS cantidad_certificaciones,
        SUM(CASE
            WHEN c.fecha_obtencion >= DATEADD(YEAR, -2, GETDATE()) THEN 1
            ELSE 0
        END) AS certificaciones_activas
    FROM Entrenador_Certificacion ec
    INNER JOIN Certificacion c ON ec.id_certificacion = c.id_certificacion
    GROUP BY ec.id_entrenador
) certificaciones ON e.cedula_entrenador = certificaciones.id_entrenador

-- Estadísticas de clientes (sin cambios)
LEFT JOIN (
    SELECT
        r.cedula_entrenador,
        COUNT(DISTINCT r.cedula_cliente) AS clientes_actuales,
        COUNT(DISTINCT r_hist.cedula_cliente) AS total_clientes_historicos,
        COUNT(DISTINCT CASE
            WHEN r.fecha_creacion >= DATEADD(MONTH, -1, GETDATE()) THEN r.cedula_cliente
        END) AS clientes_nuevos_ultimo_mes
    FROM Rutina r
    LEFT JOIN Rutina r_hist ON r.cedula_entrenador = r_hist.cedula_entrenador
    WHERE r.id_estado_rutina = 1 -- Solo rutinas activas para clientes actuales
    GROUP BY r.cedula_entrenador
) clientes_stats ON e.cedula_entrenador = clientes_stats.cedula_entrenador

-- Estadísticas de rutinas (ahora usando las CTEs)
LEFT JOIN EstadisticasRutinas er ON e.cedula_entrenador = er.cedula_entrenador
LEFT JOIN PromedioEjerciciosRutina per ON e.cedula_entrenador = per.cedula_entrenador

-- Estadísticas de clases (ahora usando las CTEs)
LEFT JOIN EstadisticasClases ec ON e.cedula_entrenador = ec.cedula_entrenador
LEFT JOIN PromedioAsistenciaClase pac ON e.cedula_entrenador = pac.cedula_entrenador

-- Estadísticas de retención (sin cambios)
LEFT JOIN (
    SELECT
        r.cedula_entrenador,
        COUNT(DISTINCT CASE
            WHEN m.fecha_vencimiento > GETDATE() AND m.id_estado_membresia = 1 THEN r.cedula_cliente
        END) AS clientes_con_membresia_activa
    FROM Rutina r
    LEFT JOIN Membresia m ON r.cedula_cliente = m.cedula_cliente
    WHERE r.id_estado_rutina = 1
    GROUP BY r.cedula_entrenador
) retencion_stats ON e.cedula_entrenador = retencion_stats.cedula_entrenador

-- Estadísticas de progreso (sin cambios)
LEFT JOIN (
    SELECT
        r.cedula_entrenador,
        COUNT(DISTINCT CASE
            WHEN pr.fecha >= DATEADD(MONTH, -1, GETDATE()) THEN r.cedula_cliente
        END) AS clientes_con_progreso_reciente,
        COUNT(pr.id_progreso) AS total_registros_progreso
    FROM Rutina r
    LEFT JOIN Progreso pr ON r.cedula_cliente = pr.cedula_cliente
    WHERE r.id_estado_rutina = 1
    GROUP BY r.cedula_entrenador
) progreso_stats ON e.cedula_entrenador = progreso_stats.cedula_entrenador

-- Estadísticas de ingresos generados (sin cambios)
LEFT JOIN (
    SELECT
        r.cedula_entrenador,
        SUM(CASE
            WHEN p.fecha_pago >= DATEADD(MONTH, -1, GETDATE()) THEN p.monto
            ELSE 0
        END) AS ingresos_generados_ultimo_mes,
        SUM(p.monto) AS ingresos_totales_historicos
    FROM Rutina r
    INNER JOIN Membresia m ON r.cedula_cliente = m.cedula_cliente
    INNER JOIN Pago p ON m.id_membresia = p.id_membresia
    WHERE p.id_estado = 1 AND r.id_estado_rutina = 1
    GROUP BY r.cedula_entrenador
) ingresos_stats ON e.cedula_entrenador = ingresos_stats.cedula_entrenador;