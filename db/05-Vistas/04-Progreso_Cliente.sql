
-- ===============================================================
-- VISTA: PROGRESO INTEGRAL DEL CLIENTE (ACTUALIZADA)
-- Propósito: Consolidar toda la información de progreso del cliente
-- Adaptada al nuevo esquema de tablas
-- ===============================================================

CREATE VIEW vw_ProgresoCliente AS
WITH
-- Datos básicos de progreso con información temporal
DatosProgreso AS (
    SELECT
        p.id_progreso,
        p.cedula_cliente,
        p.fecha,
        p.peso_kg,
        p.porcentaje_grasa,
        p.edad_metabolica,
        YEAR(p.fecha) AS año,
        MONTH(p.fecha) AS mes,
        DATENAME(MONTH, p.fecha) AS nombre_mes,
        FORMAT(p.fecha, 'MMM yyyy', 'es-ES') AS periodo_legible,
        ROW_NUMBER() OVER (PARTITION BY p.cedula_cliente ORDER BY p.fecha) AS numero_registro,
        -- Identificar primer y último registro por cliente
        CASE WHEN ROW_NUMBER() OVER (PARTITION BY p.cedula_cliente ORDER BY p.fecha) = 1
             THEN 1 ELSE 0 END AS es_primer_registro,
        CASE WHEN ROW_NUMBER() OVER (PARTITION BY p.cedula_cliente ORDER BY p.fecha DESC) = 1
             THEN 1 ELSE 0 END AS es_ultimo_registro
    FROM Progreso p
),

-- Mediciones agregadas por progreso (solo medidas corporales ahora)
MedicionesAgregadas AS (
    SELECT
        m.id_progreso,
        -- Estadísticas de medidas corporales
        COUNT(DISTINCT m.musculo_nombre) AS grupos_musculares_medidos,
        AVG(m.medida_cm) AS medida_promedio_cm,
        MIN(m.medida_cm) AS medida_minima_cm,
        MAX(m.medida_cm) AS medida_maxima_cm,

        -- Mediciones específicas por grupo muscular
        AVG(CASE WHEN m.musculo_nombre = 'Bíceps' THEN m.medida_cm END) AS biceps_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Pectorales' THEN m.medida_cm END) AS pectorales_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Cuádriceps' THEN m.medida_cm END) AS cuadriceps_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Glúteos' THEN m.medida_cm END) AS gluteos_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Espalda' THEN m.medida_cm END) AS espalda_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Abdominales' THEN m.medida_cm END) AS abdominales_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Hombros' THEN m.medida_cm END) AS hombros_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Tríceps' THEN m.medida_cm END) AS triceps_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Pantorrillas' THEN m.medida_cm END) AS pantorrillas_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Isquiotibiales' THEN m.medida_cm END) AS isquiotibiales_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Core' THEN m.medida_cm END) AS core_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Antebrazos' THEN m.medida_cm END) AS antebrazos_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Cintura' THEN m.medida_cm END) AS cintura_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Cadera' THEN m.medida_cm END) AS cadera_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Cuello' THEN m.medida_cm END) AS cuello_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Muslo' THEN m.medida_cm END) AS muslo_cm,
        AVG(CASE WHEN m.musculo_nombre = 'Brazo' THEN m.medida_cm END) AS brazo_cm
    FROM Medicion m
    GROUP BY m.id_progreso
),

-- Detalles consolidados por progreso
DetallesConsolidados AS (
    SELECT
        d.id_progreso,
        -- Concatenar todos los detalles en un solo campo para facilitar búsquedas
        STUFF((
            SELECT CHAR(13) + CHAR(10) + '• ' + d2.titulo + ': ' + d2.descripcion
            FROM Detalle d2
            WHERE d2.id_progreso = d.id_progreso
            FOR XML PATH('')
        ), 1, 3, '') AS detalles_completos,
        -- Contar tipos de detalles
        COUNT(CASE WHEN d.titulo LIKE '%Logro%' OR d.titulo LIKE '%Meta%' OR d.titulo LIKE '%Récord%'
                   THEN 1 END) AS logros_count,
        COUNT(CASE WHEN d.titulo LIKE '%Objetivo%' OR d.titulo LIKE '%Plan%'
                   THEN 1 END) AS objetivos_count,
        COUNT(*) AS total_detalles
    FROM Detalle d
    GROUP BY d.id_progreso
),

-- Estadísticas por cliente (para cálculos comparativos)
EstadisticasCliente AS (
    SELECT
        dp.cedula_cliente,
        COUNT(dp.id_progreso) AS total_registros,
        MIN(dp.fecha) AS fecha_inicio,
        MAX(dp.fecha) AS fecha_ultimo_registro,
        DATEDIFF(DAY, MIN(dp.fecha), MAX(dp.fecha)) AS dias_total_seguimiento,

        -- Estadísticas del primer registro
        MIN(CASE WHEN dp.es_primer_registro = 1 THEN dp.peso_kg END) AS peso_inicial,
        MIN(CASE WHEN dp.es_primer_registro = 1 THEN dp.porcentaje_grasa END) AS grasa_inicial,
        MIN(CASE WHEN dp.es_primer_registro = 1 THEN dp.edad_metabolica END) AS edad_metabolica_inicial,
        MIN(CASE WHEN dp.es_primer_registro = 1 THEN ma.medida_promedio_cm END) AS medida_promedio_inicial,

        -- Estadísticas del último registro
        MAX(CASE WHEN dp.es_ultimo_registro = 1 THEN dp.peso_kg END) AS peso_actual,
        MAX(CASE WHEN dp.es_ultimo_registro = 1 THEN dp.porcentaje_grasa END) AS grasa_actual,
        MAX(CASE WHEN dp.es_ultimo_registro = 1 THEN dp.edad_metabolica END) AS edad_metabolica_actual,
        MAX(CASE WHEN dp.es_ultimo_registro = 1 THEN ma.medida_promedio_cm END) AS medida_promedio_actual
    FROM DatosProgreso dp
    LEFT JOIN MedicionesAgregadas ma ON dp.id_progreso = ma.id_progreso
    GROUP BY dp.cedula_cliente
)

-- Consulta principal que une todo
SELECT
    -- Información del cliente
    pe.cedula,
    pe.nombre + ' ' + pe.apellido1 + ' ' + pe.apellido2 AS nombre_completo,
    pe.correo,
    c.peso AS peso_registrado_cliente, -- Peso inicial del cliente en su perfil
    nf.nivel AS nivel_fitness,
    DATEDIFF(YEAR, pe.fecha_nacimiento, GETDATE()) AS edad_actual,

    -- Información del progreso específico
    dp.id_progreso,
    dp.fecha,
    dp.peso_kg AS peso_progreso, -- Peso registrado en este progreso específico
    dp.porcentaje_grasa,
    dp.edad_metabolica,
    dp.año,
    dp.mes,
    dp.nombre_mes,
    dp.periodo_legible,
    dp.numero_registro,
    dp.es_primer_registro,
    dp.es_ultimo_registro,

    -- Mediciones del registro (medidas corporales)
    ma.grupos_musculares_medidos,
    ma.medida_promedio_cm,
    ma.medida_minima_cm,
    ma.medida_maxima_cm,

    -- Mediciones por grupo muscular específico (en centímetros)
    ma.biceps_cm,
    ma.pectorales_cm,
    ma.cuadriceps_cm,
    ma.gluteos_cm,
    ma.espalda_cm,
    ma.abdominales_cm,
    ma.hombros_cm,
    ma.triceps_cm,
    ma.pantorrillas_cm,
    ma.isquiotibiales_cm,
    ma.core_cm,
    ma.antebrazos_cm,
    ma.cintura_cm,
    ma.cadera_cm,
    ma.cuello_cm,
    ma.muslo_cm,
    ma.brazo_cm,

    -- Detalles del progreso
    dc.detalles_completos,
    dc.logros_count,
    dc.objetivos_count,
    dc.total_detalles,

    -- Estadísticas comparativas del cliente
    ec.total_registros,
    ec.fecha_inicio,
    ec.fecha_ultimo_registro,
    ec.dias_total_seguimiento,

    -- Cambios totales (desde el inicio hasta ahora)
    ec.peso_actual - ec.peso_inicial AS cambio_peso,
    ec.grasa_inicial - ec.grasa_actual AS reduccion_grasa_porcentaje,
    ec.edad_metabolica_inicial - ec.edad_metabolica_actual AS mejora_edad_metabolica,
    ec.medida_promedio_actual - ec.medida_promedio_inicial AS cambio_medidas_promedio,

    -- Cálculos de progreso porcentual
    CASE WHEN ec.peso_inicial > 0
         THEN ((ec.peso_actual - ec.peso_inicial) / ec.peso_inicial) * 100
         ELSE 0 END AS cambio_peso_pct,
    CASE WHEN ec.grasa_inicial > 0
         THEN ((ec.grasa_inicial - ec.grasa_actual) / ec.grasa_inicial) * 100
         ELSE 0 END AS reduccion_grasa_pct,
    CASE WHEN ec.edad_metabolica_inicial > 0
         THEN ((ec.edad_metabolica_inicial - ec.edad_metabolica_actual) / ec.edad_metabolica_inicial) * 100
         ELSE 0 END AS mejora_edad_metabolica_pct,
    CASE WHEN ec.medida_promedio_inicial > 0
         THEN ((ec.medida_promedio_actual - ec.medida_promedio_inicial) / ec.medida_promedio_inicial) * 100
         ELSE 0 END AS cambio_medidas_pct,

    -- Indicadores de evaluación
    CASE
        WHEN ec.total_registros >= 10 THEN 'Muy Constante'
        WHEN ec.total_registros >= 6 THEN 'Constante'
        WHEN ec.total_registros >= 3 THEN 'Regular'
        ELSE 'Irregular'
    END AS evaluacion_constancia,

    CASE
        WHEN (ec.peso_actual - ec.peso_inicial) < -5 AND (ec.grasa_inicial - ec.grasa_actual) > 5 THEN 'Excelente'
        WHEN (ec.peso_actual - ec.peso_inicial) < -2 AND (ec.grasa_inicial - ec.grasa_actual) > 2 THEN 'Bueno'
        WHEN (ec.grasa_inicial - ec.grasa_actual) > 0 THEN 'Regular'
        ELSE 'Necesita Mejora'
    END AS evaluacion_progreso_general,

    -- Evaluación específica de composición corporal
    CASE
        WHEN ec.grasa_inicial - ec.grasa_actual >= 10 THEN 'Reducción Excelente'
        WHEN ec.grasa_inicial - ec.grasa_actual >= 5 THEN 'Buena Reducción'
        WHEN ec.grasa_inicial - ec.grasa_actual > 0 THEN 'Reducción Moderada'
        WHEN ec.grasa_inicial - ec.grasa_actual = 0 THEN 'Sin Cambios'
        ELSE 'Aumento de Grasa'
    END AS evaluacion_grasa_corporal,

    -- Información del entrenador actual (si tiene rutina activa)
    (SELECT TOP 1 per.nombre + ' ' + per.apellido1
     FROM Rutina r
     INNER JOIN Entrenador e ON r.cedula_entrenador = e.cedula_entrenador
     INNER JOIN Persona per ON e.cedula_entrenador = per.cedula
     WHERE r.cedula_cliente = pe.cedula AND r.id_estado_rutina = 1
     ORDER BY r.fecha_creacion DESC) AS entrenador_actual,

    -- Métricas adicionales
    CASE WHEN ec.dias_total_seguimiento > 0
         THEN CAST(ec.total_registros AS FLOAT) / (ec.dias_total_seguimiento / 30.0)
         ELSE 0 END AS frecuencia_registro_mensual,

    -- IMC calculado (si hay peso y altura estimada)
    CASE WHEN dp.peso_kg > 0 AND ec.medida_promedio_actual > 0
         THEN dp.peso_kg / POWER((ec.medida_promedio_actual / 100.0), 2)
         ELSE NULL END AS imc_estimado

FROM DatosProgreso dp
INNER JOIN Persona pe ON dp.cedula_cliente = pe.cedula
INNER JOIN Cliente c ON pe.cedula = c.cedula_cliente
LEFT JOIN Nivel_Fitness nf ON c.id_nivel_fitness = nf.id_nivel_fitness
LEFT JOIN MedicionesAgregadas ma ON dp.id_progreso = ma.id_progreso
LEFT JOIN DetallesConsolidados dc ON dp.id_progreso = dc.id_progreso
LEFT JOIN EstadisticasCliente ec ON dp.cedula_cliente = ec.cedula_cliente
WHERE c.estado = 1; -- Solo clientes activos