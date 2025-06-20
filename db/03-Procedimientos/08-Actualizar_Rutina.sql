-- ===============================================================
-- PROCEDIMIENTO: ACTUALIZACIÓN COMPLETA DE RUTINAS
-- ===============================================================

CREATE PROCEDURE sp_ActualizarRutina
    @id_rutina INT,
    @cedula_entrenador VARCHAR(11) = NULL,      -- Nuevo entrenador (opcional)
    @tipo_rutina VARCHAR(15) = NULL,            -- Nuevo tipo (opcional)
    @estado_rutina VARCHAR(15) = NULL,          -- Nuevo estado (opcional)
    @descripcion VARCHAR(200) = NULL,           -- Nueva descripción (opcional)
    @dias VARCHAR(100) = NULL,                  -- Nuevos días: 'Lunes,Miércoles,Viernes' (opcional)
    @reemplazar_dias BIT = 0,                   -- 0 = mantener días existentes, 1 = reemplazar completamente
    @forzar_reactivacion BIT = 0,               -- Solo para casos especiales de reactivación
    @motivo_cambio VARCHAR(255) = NULL          -- Motivo del cambio para auditoría
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- Variables de control
    DECLARE @cedula_cliente VARCHAR(11);
    DECLARE @estado_actual VARCHAR(15);
    DECLARE @entrenador_actual VARCHAR(11);
    DECLARE @fecha_fin_actual DATE;
    DECLARE @id_tipo_rutina INT;
    DECLARE @id_estado_rutina INT;
    DECLARE @cambios_realizados VARCHAR(1000) = '';
    DECLARE @cambios_criticos BIT = 0;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. VALIDACIONES INICIALES

        -- Verificar que la rutina existe y obtener datos actuales
        SELECT
            @cedula_cliente = r.cedula_cliente,
            @estado_actual = er.nombre,
            @entrenador_actual = r.cedula_entrenador,
            @fecha_fin_actual = r.fecha_fin
        FROM Rutina r
        INNER JOIN Estado_Rutina er ON r.id_estado_rutina = er.id_estado_rutina
        WHERE r.id_rutina = @id_rutina;

        IF @cedula_cliente IS NULL
        BEGIN
            RAISERROR('Rutina no encontrada con ID: %d', 16, 1, @id_rutina);
            RETURN;
        END

        -- Verificar que el cliente aún existe y está activo
        IF NOT EXISTS (SELECT 1 FROM Cliente WHERE cedula_cliente = @cedula_cliente AND estado = 1)
        BEGIN
            RAISERROR('Cliente asociado no encontrado o inactivo: %s', 16, 1, @cedula_cliente);
            RETURN;
        END

        -- 2. VALIDACIONES DE NEGOCIO

        -- Validar nuevo entrenador si se proporciona
        IF @cedula_entrenador IS NOT NULL
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM Entrenador WHERE cedula_entrenador = @cedula_entrenador)
            BEGIN
                RAISERROR('Entrenador no encontrado: %s', 16, 1, @cedula_entrenador);
                RETURN;
            END

            IF @cedula_entrenador != @entrenador_actual
            BEGIN
                SET @cambios_criticos = 1;
                SET @cambios_realizados += 'Entrenador cambiado de ' + @entrenador_actual + ' a ' + @cedula_entrenador + '. ';
            END
        END

        -- Validar cambios de estado críticos
        IF @estado_rutina IS NOT NULL AND @estado_rutina != @estado_actual
        BEGIN
            -- Prevenir reactivación de rutinas finalizadas sin autorización
            IF @estado_actual = 'Finalizada' AND @estado_rutina = 'Activa' AND @forzar_reactivacion = 0
            BEGIN
                RAISERROR('No se puede reactivar una rutina finalizada. Use @forzar_reactivacion = 1 si es necesario.', 16, 1);
                RETURN;
            END

            -- Validar que el nuevo estado existe
            SELECT @id_estado_rutina = id_estado_rutina
            FROM Estado_Rutina
            WHERE nombre = @estado_rutina;

            IF @id_estado_rutina IS NULL
            BEGIN
                RAISERROR('Estado de rutina no válido: %s', 16, 1, @estado_rutina);
                RETURN;
            END

            SET @cambios_criticos = 1;
            SET @cambios_realizados += 'Estado cambiado de ' + @estado_actual + ' a ' + @estado_rutina + '. ';
        END

        -- Validar tipo de rutina si se proporciona
        IF @tipo_rutina IS NOT NULL
        BEGIN
            SELECT @id_tipo_rutina = id_tipo_rutina
            FROM Tipo_Rutina
            WHERE nombre = @tipo_rutina;

            IF @id_tipo_rutina IS NULL
            BEGIN
                -- Crear tipo de rutina si no existe
                INSERT INTO Tipo_Rutina (nombre) VALUES (@tipo_rutina);
                SET @id_tipo_rutina = SCOPE_IDENTITY();
                SET @cambios_realizados += 'Tipo de rutina creado: ' + @tipo_rutina + '. ';
            END

            SET @cambios_realizados += 'Tipo de rutina actualizado. ';
        END

        -- 3. ACTUALIZAR TABLA PRINCIPAL

        UPDATE Rutina
        SET
            cedula_entrenador = ISNULL(@cedula_entrenador, cedula_entrenador),
            id_tipo_rutina = ISNULL(@id_tipo_rutina, id_tipo_rutina),
            id_estado_rutina = ISNULL(@id_estado_rutina, id_estado_rutina),
            descripcion = ISNULL(@descripcion, descripcion),
            -- Limpiar fecha_fin si se reactiva
            fecha_fin = CASE
                WHEN @estado_rutina = 'Completada' THEN GETDATE()
                WHEN @estado_rutina = 'Cancelada' THEN GETDATE()
                WHEN @estado_rutina = 'Activa' THEN NULL
                WHEN @estado_rutina = 'Pausada' THEN NULL
                ELSE fecha_fin
            END
        WHERE id_rutina = @id_rutina;

        -- 4. GESTIÓN DE DÍAS DE ENTRENAMIENTO

        IF @dias IS NOT NULL
        BEGIN
            -- Estrategia de reemplazo o adición
            IF @reemplazar_dias = 1
            BEGIN
                -- ELIMINAR días existentes
                DELETE FROM Dia_Rutina WHERE id_rutina = @id_rutina;
                SET @cambios_realizados += 'Días de entrenamiento reemplazados. ';
            END

            -- INSERTAR nuevos días
            DECLARE @dia_nombre VARCHAR(10);
            DECLARE @id_dia INT;
            DECLARE @pos INT = 1;
            DECLARE @dias_agregados VARCHAR(100) = '';

            WHILE @pos <= LEN(@dias)
            BEGIN
                DECLARE @next_comma INT = CHARINDEX(',', @dias, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@dias) + 1;

                SET @dia_nombre = LTRIM(RTRIM(SUBSTRING(@dias, @pos, @next_comma - @pos)));

                -- Buscar o crear día
                SELECT @id_dia = id_dia FROM Dia WHERE dia = @dia_nombre;
                IF @id_dia IS NULL
                BEGIN
                    INSERT INTO Dia (dia) VALUES (@dia_nombre);
                    SET @id_dia = SCOPE_IDENTITY();
                END

                -- Verificar si ya existe la relación (para modo adición)
                IF NOT EXISTS (SELECT 1 FROM Dia_Rutina WHERE id_rutina = @id_rutina AND id_dia = @id_dia)
                BEGIN
                    INSERT INTO Dia_Rutina (id_rutina, id_dia) VALUES (@id_rutina, @id_dia);
                    SET @dias_agregados += @dia_nombre + ',';
                END

                SET @pos = @next_comma + 1;
            END

            IF LEN(@dias_agregados) > 0
            BEGIN
                SET @cambios_realizados += 'Días agregados: ' + LEFT(@dias_agregados, LEN(@dias_agregados) - 1) + '. ';
            END
        END

        -- 6. LÓGICA ESPECIAL POR TIPO DE CAMBIO

        -- Si se cambió a estado "Finalizada", establecer fecha_fin
        IF @estado_rutina = 'Finalizada' AND @estado_actual != 'Finalizada'
        BEGIN
            UPDATE Rutina
            SET fecha_fin = GETDATE()
            WHERE id_rutina = @id_rutina;
        END

        -- Si se reactivó, limpiar fecha_fin y crear nota especial
        IF @estado_rutina = 'Activa' AND @estado_actual = 'Finalizada' AND @forzar_reactivacion = 1
        BEGIN
            UPDATE Rutina SET fecha_fin = NULL
            WHERE id_rutina = @id_rutina;
        END

        COMMIT TRANSACTION;

        -- 7. RESULTADO DE LA OPERACIÓN

        SELECT
            @id_rutina AS id_rutina,
            @cedula_cliente AS cedula_cliente,
            @cambios_realizados AS cambios_realizados,
            CASE WHEN @cambios_criticos = 1 THEN 'SÍ' ELSE 'NO' END AS cambios_criticos,
            'Rutina actualizada exitosamente' AS mensaje;

        PRINT 'Rutina ID ' + CAST(@id_rutina AS VARCHAR) + ' actualizada exitosamente para cliente ' + @cedula_cliente;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;