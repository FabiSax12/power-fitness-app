-- ===============================================================
-- PROCEDIMIENTO: CONSULTAR EJERCICIOS DE UNA RUTINA ESPECÍFICA
-- ===============================================================

CREATE PROCEDURE sp_ConsultarEjerciciosRutina
    @id_rutina INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que la rutina existe
    IF NOT EXISTS (SELECT 1 FROM Rutina WHERE id_rutina = @id_rutina)
    BEGIN
        RAISERROR('Rutina no encontrada con ID: %d', 16, 1, @id_rutina);
        RETURN;
    END

    SELECT
        -- IDs necesarios para operaciones CRUD
        er.id_ejercicio_rutina,
        er.id_ejercicio,
        er.id_rutina,

        -- Información del ejercicio
        e.nombre AS nombre_ejercicio,
        d.dificultad,

        -- Parámetros específicos de la rutina
        er.repeticiones,
        er.tiempo_descanso,

        -- Grupos musculares trabajados (concatenados para frontend)
        STUFF((
            SELECT ', ' + gm.nombre_grupo
            FROM Ejercicio_Grupo_Muscular egm
            INNER JOIN Grupo_Muscular gm ON egm.id_grupo_muscular = gm.id_grupo_muscular
            WHERE egm.id_ejercicio = e.id_ejercicio
            FOR XML PATH('')
        ), 1, 2, '') AS grupos_musculares,

        -- Información adicional útil para UI
        CASE
            WHEN d.dificultad = 'Principiante' THEN 1
            WHEN d.dificultad = 'Intermedio' THEN 2
            WHEN d.dificultad = 'Avanzado' THEN 3
            WHEN d.dificultad = 'Experto' THEN 4
            ELSE 0
        END AS nivel_dificultad_numerico,

        -- Tiempo de descanso formateado para display
        CASE
            WHEN er.tiempo_descanso IS NOT NULL
            THEN FORMAT(er.tiempo_descanso, 'hh\:mm\:ss')
            ELSE NULL
        END AS tiempo_descanso_formateado,

        -- Orden en la rutina (para mostrar secuencia)
        ROW_NUMBER() OVER (ORDER BY er.id_ejercicio_rutina) AS orden_en_rutina

    FROM Ejercicio_Rutina er
    INNER JOIN Ejercicio e ON er.id_ejercicio = e.id_ejercicio
    INNER JOIN Dificultad d ON e.id_dificultad = d.id_dificultad

    WHERE er.id_rutina = @id_rutina

    ORDER BY er.id_ejercicio_rutina ASC; -- Orden de inserción

END;