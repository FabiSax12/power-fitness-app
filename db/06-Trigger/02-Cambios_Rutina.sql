-- ===============================================================
-- TRIGGER: AUDITORIA Y CONTROL DE CAMBIOS DE RUTINAS
-- Evento: AFTER UPDATE en tabla Rutina
-- Propósito: Auditar cambios críticos y mantener historial de modificaciones
-- ===============================================================

CREATE TRIGGER trg_AuditoriaRutinas_PostUpdate
ON Rutina
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @cambios_criticos BIT = 0;
        DECLARE @notificar_entrenador BIT = 0;
        DECLARE @notificar_cliente BIT = 0;

        -- 1. AUDITORÍA DE CAMBIOS CRÍTICOS

        -- Detectar cambios en estado de rutina
        IF UPDATE(id_estado_rutina)
        BEGIN
            INSERT INTO Progreso (cedula_cliente, fecha)
            SELECT
                i.cedula_cliente,
                GETDATE()
            FROM inserted i
            INNER JOIN deleted d ON i.id_rutina = d.id_rutina
            WHERE i.id_estado_rutina != d.id_estado_rutina;

            -- Insertar detalles del cambio de estado
            INSERT INTO Detalle (id_progreso, titulo, descripcion)
            SELECT
                p.id_progreso,
                'Cambio Estado Rutina',
                'Rutina ' + CAST(i.id_rutina AS VARCHAR) + ' cambió de estado ' +
                er_old.nombre + ' a ' + er_new.nombre +
                '. Entrenador: ' + pe.nombre + ' ' + pe.apellido1
            FROM inserted i
            INNER JOIN deleted d ON i.id_rutina = d.id_rutina
            INNER JOIN Progreso p ON i.cedula_cliente = p.cedula_cliente
                AND p.fecha = CONVERT(DATE, GETDATE())
            INNER JOIN Estado_Rutina er_old ON d.id_estado_rutina = er_old.id_estado_rutina
            INNER JOIN Estado_Rutina er_new ON i.id_estado_rutina = er_new.id_estado_rutina
            INNER JOIN Entrenador e ON i.cedula_entrenador = e.cedula_entrenador
            INNER JOIN Persona pe ON e.cedula_entrenador = pe.cedula
            WHERE i.id_estado_rutina != d.id_estado_rutina
                AND NOT EXISTS (
                    SELECT 1 FROM Detalle d2
                    WHERE d2.id_progreso = p.id_progreso
                    AND d2.titulo = 'Cambio Estado Rutina'
                );

            SET @cambios_criticos = 1;
            SET @notificar_cliente = 1;
        END

        -- Detectar cambio de entrenador
        IF UPDATE(cedula_entrenador)
        BEGIN
            INSERT INTO Progreso (cedula_cliente, fecha)
            SELECT
                i.cedula_cliente,
                GETDATE()
            FROM inserted i
            INNER JOIN deleted d ON i.id_rutina = d.id_rutina
            WHERE i.cedula_entrenador != d.cedula_entrenador;

            -- Registrar cambio de entrenador
            INSERT INTO Detalle (id_progreso, titulo, descripcion)
            SELECT
                p.id_progreso,
                'Cambio de Entrenador',
                'Rutina ' + CAST(i.id_rutina AS VARCHAR) + ' asignada a nuevo entrenador: ' +
                pe_new.nombre + ' ' + pe_new.apellido1 +
                ' (anterior: ' + pe_old.nombre + ' ' + pe_old.apellido1 + ')'
            FROM inserted i
            INNER JOIN deleted d ON i.id_rutina = d.id_rutina
            INNER JOIN Progreso p ON i.cedula_cliente = p.cedula_cliente
                AND p.fecha = CONVERT(DATE, GETDATE())
            INNER JOIN Entrenador e_new ON i.cedula_entrenador = e_new.cedula_entrenador
            INNER JOIN Persona pe_new ON e_new.cedula_entrenador = pe_new.cedula
            INNER JOIN Entrenador e_old ON d.cedula_entrenador = e_old.cedula_entrenador
            INNER JOIN Persona pe_old ON e_old.cedula_entrenador = pe_old.cedula
            WHERE i.cedula_entrenador != d.cedula_entrenador
                AND NOT EXISTS (
                    SELECT 1 FROM Detalle d2
                    WHERE d2.id_progreso = p.id_progreso
                    AND d2.titulo = 'Cambio de Entrenador'
                );

            SET @cambios_criticos = 1;
            SET @notificar_cliente = 1;
            SET @notificar_entrenador = 1;
        END

        -- 2. VALIDACIONES

        -- Validar que rutinas finalizadas no se reactiven sin autorización
        IF EXISTS (
            SELECT 1
            FROM inserted i
            INNER JOIN deleted d ON i.id_rutina = d.id_rutina
            WHERE d.fecha_fin IS NOT NULL
                AND i.id_estado_rutina = 1 -- Intentando reactivar
                AND d.id_estado_rutina = 3 -- Era finalizada
        )
        BEGIN
            RAISERROR('No se puede reactivar una rutina finalizada sin crear una nueva rutina.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 3. GESTIÓN AUTOMÁTICA DE FECHAS

        -- Establecer fecha_fin automáticamente cuando se cambia a estado "Completada"
        DECLARE @estado_rutina VARCHAR(15)

        SELECT @estado_rutina = er.nombre FROM Estado_Rutina er WHERE er.id_estado_rutina = inserted.id_estado_rutina;

        UPDATE Rutina
        SET fecha_fin = CASE
            WHEN @estado_rutina = 'Completada' THEN GETDATE()
            WHEN @estado_rutina = 'Cancelada' THEN GETDATE()
            WHEN @estado_rutina = 'Activa' THEN NULL
            WHEN @estado_rutina = 'Pausada' THEN NULL
            ELSE fecha_fin
        END
        FROM Rutina r
        INNER JOIN inserted i ON r.id_rutina = i.id_rutina
        INNER JOIN deleted d ON i.id_rutina = d.id_rutina
        WHERE i.id_estado_rutina = 3 -- Finalizada
            AND d.id_estado_rutina != 3 -- No era finalizada antes
            AND r.fecha_fin IS NULL;

        -- 4. MÉTRICAS Y ESTADÍSTICAS EN TIEMPO REAL

        -- Actualizar contadores de rutinas por entrenador (en un sistema real usaríamos tablas de métricas)
        IF @cambios_criticos = 1
        BEGIN
            DECLARE @total_cambios INT;
            SELECT @total_cambios = COUNT(*)
            FROM inserted i
            INNER JOIN deleted d ON i.id_rutina = d.id_rutina
            WHERE i.id_estado_rutina != d.id_estado_rutina
                OR i.cedula_entrenador != d.cedula_entrenador;

            PRINT 'Trigger completado. Cambios procesados: ' + CAST(@total_cambios AS VARCHAR);
        END

    END TRY
    BEGIN CATCH
        DECLARE @error_message VARCHAR(500) = 'Error en auditoría de rutinas: ' + ERROR_MESSAGE();
        PRINT @error_message;
    END CATCH
END;