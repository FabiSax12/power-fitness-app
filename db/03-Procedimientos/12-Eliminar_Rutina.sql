-- ===============================================================
-- PROCEDIMIENTO: ELIMINAR RUTINA CON CASCADA COMPLETA
-- ===============================================================

CREATE PROCEDURE sp_EliminarRutina
    @id_rutina INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- Variables de control
    DECLARE @cedula_cliente VARCHAR(11);
    DECLARE @cedula_entrenador VARCHAR(11);
    DECLARE @estado_rutina VARCHAR(15);
    DECLARE @tipo_rutina VARCHAR(15);
    DECLARE @descripcion VARCHAR(200);
    DECLARE @fecha_creacion DATE;
    DECLARE @fecha_fin DATE;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. VALIDACIONES CRÍTICAS

        -- Verificar que la rutina existe y obtener información completa
        SELECT
            @cedula_cliente = r.cedula_cliente,
            @cedula_entrenador = r.cedula_entrenador,
            @estado_rutina = er.nombre,
            @tipo_rutina = tr.nombre,
            @descripcion = r.descripcion,
            @fecha_creacion = r.fecha_creacion,
            @fecha_fin = r.fecha_fin
        FROM Rutina r
        INNER JOIN Estado_Rutina er ON r.id_estado_rutina = er.id_estado_rutina
        INNER JOIN Tipo_Rutina tr ON r.id_tipo_rutina = tr.id_tipo_rutina
        WHERE r.id_rutina = @id_rutina;

        IF @cedula_cliente IS NULL
        BEGIN
            RAISERROR('Rutina no encontrada con ID: %d', 16, 1, @id_rutina);
            RETURN;
        END

        -- Verificar que el cliente existe (seguridad adicional)
        IF NOT EXISTS (SELECT 1 FROM Cliente WHERE cedula_cliente = @cedula_cliente)
        BEGIN
            RAISERROR('Cliente asociado no encontrado: %s', 16, 1, @cedula_cliente);
            RETURN;
        END

        -- 2. ELIMINACIÓN EN CASCADA

        -- Eliminar ejercicios de la rutina
        DELETE FROM Ejercicio_Rutina
        WHERE id_rutina = @id_rutina;

        -- Eliminar días de la rutina
        DELETE FROM Dia_Rutina
        WHERE id_rutina = @id_rutina;

        -- Eliminar la rutina principal
        DELETE FROM Rutina
        WHERE id_rutina = @id_rutina;

        -- Verificar que se eliminó correctamente
        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('No se pudo eliminar la rutina principal', 16, 1);
            RETURN;
        END

        -- 3. VALIDACIÓN POST-ELIMINACIÓN

        -- Verificar que no queden referencias huérfanas
        IF EXISTS (SELECT 1 FROM Ejercicio_Rutina WHERE id_rutina = @id_rutina)
        BEGIN
            RAISERROR('Error: Quedaron ejercicios huérfanos después de la eliminación', 16, 1);
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM Dia_Rutina WHERE id_rutina = @id_rutina)
        BEGIN
            RAISERROR('Error: Quedaron días huérfanos después de la eliminación', 16, 1);
            RETURN;
        END

        COMMIT TRANSACTION;

        -- RESPUESTA

        SELECT
            @id_rutina AS id_rutina_eliminada,
            @cedula_cliente AS cedula_cliente,
            @estado_rutina AS estado_anterior,
            @tipo_rutina AS tipo_rutina,
            @fecha_creacion AS fecha_creacion_original,
            GETDATE() AS fecha_eliminacion,
            'Rutina eliminada exitosamente con todas sus referencias' AS mensaje;

        PRINT 'Rutina #' + CAST(@id_rutina AS VARCHAR) + ' eliminada exitosamente. ';

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- Log del error para debugging
        PRINT 'Error eliminando rutina #' + CAST(@id_rutina AS VARCHAR) + ': ' + @ErrorMessage;

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;