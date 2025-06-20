-- ===============================================================
-- PROCEDIMIENTO: ELIMINAR EJERCICIO DE RUTINA
-- Propósito: Eliminar un ejercicio específico de una rutina
-- ===============================================================

CREATE PROCEDURE sp_EliminarEjercicioRutina
    @id_rutina INT,
    @id_ejercicio INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- Variables de control
    DECLARE @id_ejercicio_rutina INT;
    DECLARE @cedula_cliente VARCHAR(11);
    DECLARE @nombre_ejercicio VARCHAR(25);
    DECLARE @estado_rutina VARCHAR(15);
    DECLARE @repeticiones INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. VALIDACIONES

        -- Verificar que la rutina existe y obtener información
        SELECT
            @cedula_cliente = r.cedula_cliente,
            @estado_rutina = er.nombre
        FROM Rutina r
        INNER JOIN Estado_Rutina er ON r.id_estado_rutina = er.id_estado_rutina
        WHERE r.id_rutina = @id_rutina;

        IF @cedula_cliente IS NULL
        BEGIN
            RAISERROR('Rutina no encontrada con ID: %d', 16, 1, @id_rutina);
            RETURN;
        END

        -- Verificar que la rutina permite modificaciones
        IF @estado_rutina IN ('Completada', 'Cancelada')
        BEGIN
            RAISERROR('No se pueden eliminar ejercicios de una rutina %s', 16, 1, @estado_rutina);
            RETURN;
        END

        -- Verificar que el ejercicio existe en la rutina
        SELECT
            @id_ejercicio_rutina = er.id_ejercicio_rutina,
            @nombre_ejercicio = e.nombre,
            @repeticiones = er.repeticiones
        FROM Ejercicio_Rutina er
        INNER JOIN Ejercicio e ON er.id_ejercicio = e.id_ejercicio
        WHERE er.id_rutina = @id_rutina
            AND er.id_ejercicio = @id_ejercicio;

        IF @id_ejercicio_rutina IS NULL
        BEGIN
            RAISERROR('El ejercicio especificado no existe en esta rutina. Rutina: %d, Ejercicio: %d',
                     16, 1, @id_rutina, @id_ejercicio);
            RETURN;
        END

        -- 2. ELIMINAR EJERCICIO DE LA RUTINA

        DELETE FROM Ejercicio_Rutina
        WHERE id_ejercicio_rutina = @id_ejercicio_rutina;

        -- Verificar que se eliminó correctamente
        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('No se pudo eliminar el ejercicio de la rutina', 16, 1);
            RETURN;
        END

        COMMIT TRANSACTION;

        -- 3. RESPUESTA EXITOSA

        SELECT
            @id_ejercicio_rutina AS id_ejercicio_rutina_eliminado,
            @id_rutina AS id_rutina,
            @id_ejercicio AS id_ejercicio,
            @nombre_ejercicio AS nombre_ejercicio,
            'Ejercicio eliminado exitosamente de la rutina' AS mensaje;

        PRINT 'Ejercicio "' + @nombre_ejercicio + '" eliminado de rutina #' + CAST(@id_rutina AS VARCHAR);

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;