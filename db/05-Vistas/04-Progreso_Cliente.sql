-- ===============================================================
-- VISTA: PROGRESO INTEGRAL DEL CLIENTE
-- Propósito: Consolidar toda la información de progreso del cliente
-- ===============================================================

CREATE VIEW vw_ProgresoCliente AS
WITH
-- Datos básicos de progreso con información temporal
DatosProgreso AS (
    SELECT
        p.id_progreso,
        p.cedula_cliente,
        p.fecha,
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

-- Mediciones agregadas por progreso
MedicionesAgregadas AS (
    SELECT
        m.id_progreso,
        -- Peso total calculado (suma de masa muscular de todas las mediciones)
        SUM(m.musculo_kg) AS masa_muscular_total,
        -- Promedio de grasa corporal
        AVG(m.grasa_kg) AS grasa_corporal_promedio,
        -- Edad metabólica (tomamos la primera medición del día)
        MIN(m.edad_metabolica) AS edad_metabolica,
        -- Mediciones específicas por grupo muscular (usando PIVOT conceptual)
        SUM(CASE WHEN m.musculo_nombre = 'Bíceps' THEN m.musculo_kg ELSE 0 END) AS biceps_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Pectorales' THEN m.musculo_kg ELSE 0 END) AS pectorales_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Cuádriceps' THEN m.musculo_kg ELSE 0 END) AS cuadriceps_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Glúteos' THEN m.musculo_kg ELSE 0 END) AS gluteos_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Espalda' THEN m.musculo_kg ELSE 0 END) AS espalda_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Abdominales' THEN m.musculo_kg ELSE 0 END) AS abdominales_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Hombros' THEN m.musculo_kg ELSE 0 END) AS hombros_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Tríceps' THEN m.musculo_kg ELSE 0 END) AS triceps_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Pantorrillas' THEN m.musculo_kg ELSE 0 END) AS pantorrillas_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Isquiotibiales' THEN m.musculo_kg ELSE 0 END) AS isquiotibiales_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Core' THEN m.musculo_kg ELSE 0 END) AS core_kg,
        SUM(CASE WHEN m.musculo_nombre = 'Antebrazos' THEN m.musculo_kg ELSE 0 END) AS antebrazos_kg,
        -- Medidas corporales (promedio)
        AVG(m.medida_cm) AS medida_promedio_cm,
        COUNT(DISTINCT m.musculo_nombre) AS grupos_musculares_medidos
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
        MIN(CASE WHEN dp.es_primer_registro = 1 THEN ma.masa_muscular_total END) AS masa_muscular_inicial,
        MIN(CASE WHEN dp.es_primer_registro = 1 THEN ma.grasa_corporal_promedio END) AS grasa_inicial,
        MIN(CASE WHEN dp.es_primer_registro = 1 THEN ma.edad_metabolica END) AS edad_metabolica_inicial,
        -- Estadísticas del último registro
        MAX(CASE WHEN dp.es_ultimo_registro = 1 THEN ma.masa_muscular_total END) AS masa_muscular_actual,
        MAX(CASE WHEN dp.es_ultimo_registro = 1 THEN ma.grasa_corporal_promedio END) AS grasa_actual,
        MAX(CASE WHEN dp.es_ultimo_registro = 1 THEN ma.edad_metabolica END) AS edad_metabolica_actual
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
    c.peso AS peso_registrado,
    nf.nivel AS nivel_fitness,
    DATEDIFF(YEAR, pe.fecha_nacimiento, GETDATE()) AS edad_actual,

    -- Información del progreso específico
    dp.id_progreso,
    dp.fecha,
    dp.año,
    dp.mes,
    dp.nombre_mes,
    dp.periodo_legible,
    dp.numero_registro,
    dp.es_primer_registro,
    dp.es_ultimo_registro,

    -- Mediciones del registro
    ma.masa_muscular_total,
    ma.grasa_corporal_promedio,
    ma.edad_metabolica,
    ma.medida_promedio_cm,
    ma.grupos_musculares_medidos,

    -- Mediciones por grupo muscular específico
    ma.biceps_kg,
    ma.pectorales_kg,
    ma.cuadriceps_kg,
    ma.gluteos_kg,
    ma.espalda_kg,
    ma.abdominales_kg,
    ma.hombros_kg,
    ma.triceps_kg,
    ma.pantorrillas_kg,
    ma.isquiotibiales_kg,
    ma.core_kg,
    ma.antebrazos_kg,

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
    ec.masa_muscular_actual - ec.masa_muscular_inicial AS cambio_masa_muscular,
    ec.grasa_inicial - ec.grasa_actual AS reduccion_grasa,
    ec.edad_metabolica_inicial - ec.edad_metabolica_actual AS mejora_edad_metabolica,

    -- Cálculos de progreso porcentual
    CASE WHEN ec.masa_muscular_inicial > 0
         THEN ((ec.masa_muscular_actual - ec.masa_muscular_inicial) / ec.masa_muscular_inicial) * 100
         ELSE 0 END AS progreso_masa_muscular_pct,
    CASE WHEN ec.grasa_inicial > 0
         THEN ((ec.grasa_inicial - ec.grasa_actual) / ec.grasa_inicial) * 100
         ELSE 0 END AS reduccion_grasa_pct,
    CASE WHEN ec.edad_metabolica_inicial > 0
         THEN ((ec.edad_metabolica_inicial - ec.edad_metabolica_actual) / ec.edad_metabolica_inicial) * 100
         ELSE 0 END AS mejora_edad_metabolica_pct,

    -- Indicadores de evaluación
    CASE
        WHEN ec.total_registros >= 10 THEN 'Muy Constante'
        WHEN ec.total_registros >= 6 THEN 'Constante'
        WHEN ec.total_registros >= 3 THEN 'Regular'
        ELSE 'Irregular'
    END AS evaluacion_constancia,

    CASE
        WHEN (ec.masa_muscular_actual - ec.masa_muscular_inicial) > 5 THEN 'Excelente'
        WHEN (ec.masa_muscular_actual - ec.masa_muscular_inicial) > 2 THEN 'Bueno'
        WHEN (ec.masa_muscular_actual - ec.masa_muscular_inicial) > 0 THEN 'Regular'
        ELSE 'Necesita Mejora'
    END AS evaluacion_progreso_muscular,

    -- Información del entrenador actual (si tiene rutina activa)
    (SELECT TOP 1 per.nombre + ' ' + per.apellido1
     FROM Rutina r
     INNER JOIN Entrenador e ON r.cedula_entrenador = e.cedula_entrenador
     INNER JOIN Persona per ON e.cedula_entrenador = per.cedula
     WHERE r.cedula_cliente = pe.cedula AND r.id_estado_rutina = 1
     ORDER BY r.fecha_creacion DESC) AS entrenador_actual

FROM DatosProgreso dp
INNER JOIN Persona pe ON dp.cedula_cliente = pe.cedula
INNER JOIN Cliente c ON pe.cedula = c.cedula_cliente
LEFT JOIN Nivel_Fitness nf ON c.id_nivel_fitness = nf.id_nivel_fitness
LEFT JOIN MedicionesAgregadas ma ON dp.id_progreso = ma.id_progreso
LEFT JOIN DetallesConsolidados dc ON dp.id_progreso = dc.id_progreso
LEFT JOIN EstadisticasCliente ec ON dp.cedula_cliente = ec.cedula_cliente
WHERE c.estado = 1; -- Solo clientes activos