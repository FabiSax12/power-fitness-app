-- ===============================================================
-- TRIGGER: GESTIÓN DE ELIMINACIÓN EN CASCADA Y ARCHIVADO
-- Evento: INSTEAD OF DELETE en tabla Cliente
-- Propósito: Implementar "soft delete" y archivado inteligente de datos
-- ===============================================================

CREATE TRIGGER trg_ArchivarCliente_InsteadDelete
ON Cliente
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @clientes_procesados INT = 0;

        -- Variables para el procesamiento
        DECLARE @cedula_cliente VARCHAR(11);
        DECLARE @tiene_membresia_activa BIT;
        DECLARE @tiene_rutina_activa BIT;
        DECLARE @total_pagos DECIMAL(10,2);
        DECLARE @fecha_ultimo_pago DATE;

        -- Cursor para procesar cada cliente a eliminar
        DECLARE cliente_cursor CURSOR FOR
        SELECT cedula_cliente FROM deleted;

        OPEN cliente_cursor;
        FETCH NEXT FROM cliente_cursor INTO @cedula_cliente;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- 1. ANÁLISIS DE DEPENDENCIAS Y VALIDACIONES

            -- Verificar membresías activas
            SELECT
                @tiene_membresia_activa = CASE WHEN COUNT(*) > 0
                    THEN 1
                    ELSE 0
                END
            FROM Membresia m
            WHERE m.cedula_cliente = @cedula_cliente
                AND m.id_estado_membresia = 1 -- Activa
                AND m.fecha_vencimiento > GETDATE();

            -- Verificar rutinas activas
            SELECT @tiene_rutina_activa = CASE
                WHEN COUNT(*) > 0 THEN 1 ELSE 0
            END
            FROM Rutina r
            WHERE r.cedula_cliente = @cedula_cliente
                AND r.id_estado_rutina = 1; -- Activa

            -- Calcular valor histórico del cliente
            SELECT
                @total_pagos = ISNULL(SUM(p.monto), 0),
                @fecha_ultimo_pago = MAX(p.fecha_pago)
            FROM Membresia m
            INNER JOIN Pago p ON m.id_membresia = p.id_membresia
            WHERE m.cedula_cliente = @cedula_cliente
                AND p.id_estado = 1;

            -- 2. VALIDACIONES DE NEGOCIO ANTES DE ELIMINAR

            -- Prevenir eliminación de clientes con membresías activas y pagadas
            IF @tiene_membresia_activa = 1 AND @fecha_ultimo_pago >= DATEADD(MONTH, -2, GETDATE())
            BEGIN
                RAISERROR('No se puede eliminar cliente con membresía activa reciente. Cédula: %s', 16, 1, @cedula_cliente);
                GOTO siguiente_cliente;
            END

            -- 3. PROCESO DE ARCHIVADO INTELIGENTE

            -- 3.1. Finalizar rutinas activas antes de archivar
            IF @tiene_rutina_activa = 1
            BEGIN
                UPDATE Rutina
                SET id_estado_rutina = 3, -- Finalizada
                    fecha_fin = GETDATE()
                WHERE cedula_cliente = @cedula_cliente
                    AND id_estado_rutina = 1;

                -- Registrar el motivo de finalización
                INSERT INTO Progreso (cedula_cliente, fecha)
                VALUES (@cedula_cliente, GETDATE());

                DECLARE @id_progreso_archivo INT = SCOPE_IDENTITY();

                INSERT INTO Detalle (id_progreso, titulo, descripcion)
                VALUES (@id_progreso_archivo, 'Cliente Archivado',
                        'Rutinas finalizadas automáticamente por archivado de cliente. Valor histórico: $' +
                        CAST(@total_pagos AS VARCHAR));
            END

            -- 3.2. Suspender membresías en lugar de eliminar
            UPDATE Membresia
            SET id_estado_membresia = 2 -- Inactiva
            WHERE cedula_cliente = @cedula_cliente
                AND id_estado_membresia = 1;

            -- 3.3. Implementar "soft delete" - marcar como inactivo en lugar de eliminar
            UPDATE Cliente
            SET estado = 0 -- Inactivo - equivale a "eliminado" pero preserva datos
            WHERE cedula_cliente = @cedula_cliente;

            -- 3.4. Crear registro de auditoría del archivado
            INSERT INTO Progreso (cedula_cliente, fecha)
            VALUES (@cedula_cliente, GETDATE());

            SET @id_progreso_archivo = SCOPE_IDENTITY();

            INSERT INTO Detalle (id_progreso, titulo, descripcion)
            VALUES (@id_progreso_archivo, 'Cuenta Archivada',
                    'Cliente archivado. Membresías: ' +
                    CASE WHEN @tiene_membresia_activa = 1 THEN 'Suspendidas' ELSE 'Sin membresías activas' END +
                    '. Rutinas: ' +
                    CASE WHEN @tiene_rutina_activa = 1 THEN 'Finalizadas' ELSE 'Sin rutinas activas' END +
                    '. Valor total histórico: $' + CAST(@total_pagos AS VARCHAR));

            -- 4. PRESERVAR INTEGRIDAD REFERENCIAL

            -- Mantener relaciones importantes pero marcar como inactivas
            -- En este caso, NO eliminamos físicamente nada, solo cambiamos estados

            -- 5. ESTADÍSTICAS Y MÉTRICAS
            SET @clientes_procesados = @clientes_procesados + 1;

            PRINT 'Cliente archivado exitosamente: ' + @cedula_cliente +
                  ' (Valor histórico: $' + CAST(@total_pagos AS VARCHAR) + ')';

            siguiente_cliente:
            FETCH NEXT FROM cliente_cursor INTO @cedula_cliente;
        END

        CLOSE cliente_cursor;
        DEALLOCATE cliente_cursor;

    END TRY
    BEGIN CATCH
        -- Manejo de errores críticos
        IF CURSOR_STATUS('local', 'cliente_cursor') >= 0
        BEGIN
            CLOSE cliente_cursor;
            DEALLOCATE cliente_cursor;
        END

        DECLARE @error_msg VARCHAR(500) = 'Error crítico en archivado de clientes: ' + ERROR_MESSAGE();
        PRINT @error_msg;

        -- En un sistema real, registraríamos este error crítico
        RAISERROR(@error_msg, 16, 1);
    END CATCH
END;