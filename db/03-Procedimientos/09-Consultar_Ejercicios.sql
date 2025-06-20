-- ===============================================================
-- PROCEDIMIENTO: CONSULTAR EJERCICIOS COMPLETO
-- ===============================================================

CREATE PROCEDURE sp_ConsultarEjercicios
AS 
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.id_ejercicio,
        e.nombre,
        d.dificultad,
        
        -- Grupos musculares concatenados (para frontend)
        STUFF((
            SELECT ', ' + gm.nombre_grupo
            FROM Ejercicio_Grupo_Muscular egm2
            INNER JOIN Grupo_Muscular gm ON egm2.id_grupo_muscular = gm.id_grupo_muscular
            WHERE egm2.id_ejercicio = e.id_ejercicio
            FOR XML PATH('')
        ), 1, 2, '') AS grupos_musculares,
        
        -- Conteo de grupos musculares trabajados
        COUNT(DISTINCT egm.id_grupo_muscular) AS total_grupos_musculares,
        
        -- Tipos de máquinas compatibles (si las hay)
        STUFF((
            SELECT DISTINCT ', ' + tm.tipo
            FROM Ejercicio_Grupo_Muscular egm3
            INNER JOIN Grupo_Muscular_Maquina gmm ON egm3.id_grupo_muscular = gmm.id_grupo_muscular
            INNER JOIN Maquina m ON gmm.id_maquina = m.id_maquina
            INNER JOIN Tipo_Maquina tm ON m.id_tipo_maquina = tm.id_tipo_maquina
            WHERE egm3.id_ejercicio = e.id_ejercicio
            FOR XML PATH('')
        ), 1, 2, '') AS tipos_maquinas,
        
        -- Información adicional útil
        CASE 
            WHEN d.dificultad = 'Principiante' THEN 1
            WHEN d.dificultad = 'Intermedio' THEN 2
            WHEN d.dificultad = 'Avanzado' THEN 3
            WHEN d.dificultad = 'Experto' THEN 4
            ELSE 0
        END AS nivel_dificultad_numerico,
        
        -- Indicador si requiere máquinas
        CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM Ejercicio_Grupo_Muscular egm4
                INNER JOIN Grupo_Muscular_Maquina gmm2 ON egm4.id_grupo_muscular = gmm2.id_grupo_muscular
                WHERE egm4.id_ejercicio = e.id_ejercicio
            ) THEN 1 
            ELSE 0 
        END AS requiere_maquinas

    FROM Ejercicio e
    INNER JOIN Dificultad d ON e.id_dificultad = d.id_dificultad
    LEFT JOIN Ejercicio_Grupo_Muscular egm ON e.id_ejercicio = egm.id_ejercicio
    LEFT JOIN Grupo_Muscular gm ON egm.id_grupo_muscular = gm.id_grupo_muscular
    
    GROUP BY 
        e.id_ejercicio, 
        e.nombre, 
        d.dificultad,
        d.id_dificultad
        
    ORDER BY 
        d.id_dificultad ASC,  -- Principiante primero
        e.nombre ASC;         -- Alfabético por nombre

END;