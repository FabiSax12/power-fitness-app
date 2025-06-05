-- ===============================================================
-- TRIGGER: GESTIÓN AUTOMÁTICA DE ESTADOS DE MEMBRESÍA
-- Evento: AFTER INSERT en tabla Pago
-- Propósito: Automatizar la activación y gestión de estados de membresía
-- ===============================================================

CREATE TRIGGER trg_ActivarMembresia_PostPago
ON Pago
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Variables para manejo de datos
        DECLARE @id_membresia INT;
        DECLARE @cedula_cliente VARCHAR(11);
        DECLARE @monto_pago DECIMAL(10,2);
        DECLARE @precio_membresia DECIMAL(10,2);
        DECLARE @estado_actual INT;
        DECLARE @fecha_vencimiento DATE;
        DECLARE @tipo_membresia VARCHAR(25);

        -- Cursor para procesar múltiples pagos insertados
        DECLARE pago_cursor CURSOR FOR
        SELECT
            i.id_membresia,
            i.monto,
            m.cedula_cliente,
            tm.precio,
            m.id_estado_membresia,
            m.fecha_vencimiento,
            tm.nombre
        FROM inserted i
        INNER JOIN Membresia m ON i.id_membresia = m.id_membresia
        INNER JOIN Tipo_Membresia tm ON m.id_tipo_membresia = tm.id_tipo_membresia
        WHERE i.id_estado = 1; -- Solo pagos exitosos

        OPEN pago_cursor;
        FETCH NEXT FROM pago_cursor INTO @id_membresia, @monto_pago, @cedula_cliente,
                                         @precio_membresia, @estado_actual, @fecha_vencimiento, @tipo_membresia;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- 1. Verificar si el pago cubre el costo completo
            IF @monto_pago >= @precio_membresia
            BEGIN
                -- Activar membresía si estaba inactiva o suspendida
                IF @estado_actual IN (2, 3)
                BEGIN
                    UPDATE Membresia
                    SET id_estado_membresia = 1
                    WHERE id_membresia = @id_membresia;
                END

                -- 2. Extender membresía si está cerca del vencimiento
                IF DATEDIFF(DAY, GETDATE(), @fecha_vencimiento) <= 7
                BEGIN
                    DECLARE @nueva_fecha_vencimiento DATE;

                    -- Calcular extensión basada en el tipo de membresía
                    SELECT @nueva_fecha_vencimiento = CASE
                        WHEN f.frecuencia = 'Mensual' THEN DATEADD(MONTH, 1, @fecha_vencimiento)
                        WHEN f.frecuencia = 'Anual' THEN DATEADD(YEAR, 1, @fecha_vencimiento)
                        WHEN f.frecuencia = 'Semanal' THEN DATEADD(WEEK, 1, @fecha_vencimiento)
                        ELSE DATEADD(MONTH, 1, @fecha_vencimiento)
                    END
                    FROM Tipo_Membresia tm
                    INNER JOIN Frecuencia f ON tm.id_frecuencia = f.id_frecuencia
                    WHERE tm.nombre = @tipo_membresia;

                    UPDATE Membresia
                    SET fecha_vencimiento = @nueva_fecha_vencimiento
                    WHERE id_membresia = @id_membresia;
                END

                -- 3. Activar cliente si estaba inactivo
                UPDATE Cliente
                SET estado = 1
                WHERE cedula_cliente = @cedula_cliente AND estado = 0;

                -- 4. Crear registro de progreso automático para nuevas membresías
                IF @estado_actual = 2 -- Era inactiva, ahora se activa
                BEGIN
                    INSERT INTO Progreso (cedula_cliente, fecha)
                    VALUES (@cedula_cliente, GETDATE());

                    DECLARE @id_progreso INT = SCOPE_IDENTITY();

                    INSERT INTO Detalle (id_progreso, titulo, descripcion)
                    VALUES (@id_progreso, 'Membresía Activada', 'Membresía reactivada tras pago de ' + CAST(@monto_pago AS VARCHAR) + '. Tipo: ' + @tipo_membresia);
                END
            END
            ELSE
            BEGIN
                -- Pago parcial - mantener en estado pendiente
                UPDATE Membresia
                SET id_estado_membresia = 4 -- Pendiente de pago
                WHERE id_membresia = @id_membresia;
            END

            FETCH NEXT FROM pago_cursor INTO @id_membresia, @monto_pago, @cedula_cliente,
                                             @precio_membresia, @estado_actual, @fecha_vencimiento, @tipo_membresia;
        END

        CLOSE pago_cursor;
        DEALLOCATE pago_cursor;

    END TRY
    BEGIN CATCH
        IF CURSOR_STATUS('local', 'pago_cursor') >= 0
        BEGIN
            CLOSE pago_cursor;
            DEALLOCATE pago_cursor;
        END

        DECLARE @error_msg VARCHAR(500) = 'Error en trigger activación membresía: ' + ERROR_MESSAGE();
        PRINT @error_msg;
    END CATCH
END;