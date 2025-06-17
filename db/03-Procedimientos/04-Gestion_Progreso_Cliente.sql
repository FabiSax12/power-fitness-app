-- ===================================================
-- DOMINIO 4: GESTIÓN DE PROGRESO DEL CLIENTE
-- ===================================================

CREATE PROCEDURE sp_RegistrarProgreso
    @cedula_cliente VARCHAR(11),
    @fecha DATE = NULL,
    @peso_kg DECIMAL(5,2) = NULL,
    @porcentaje_grasa TINYINT = NULL,
    @edad_metabolica TINYINT = NULL,
    @detalles VARCHAR(2000) = NULL, -- formato: 'titulo1:descripcion1,titulo2:descripcion2'
    @mediciones VARCHAR(1000) = NULL -- formato: 'musculo_nombre:medida_cm,musculo_nombre2:medida_cm2'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_progreso INT;

    IF @fecha IS NULL SET @fecha = GETDATE();

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar que el cliente existe
        IF NOT EXISTS (SELECT 1 FROM Cliente WHERE cedula_cliente = @cedula_cliente)
        BEGIN
            RAISERROR('Cliente no encontrado', 16, 1);
            RETURN;
        END

        -- Crear progreso con los nuevos campos
        INSERT INTO Progreso (cedula_cliente, fecha, peso_kg, porcentaje_grasa, edad_metabolica)
        VALUES (@cedula_cliente, @fecha, @peso_kg, @porcentaje_grasa, @edad_metabolica);

        SET @id_progreso = SCOPE_IDENTITY();

        -- Insertar detalles si se proporcionaron
        IF @detalles IS NOT NULL
        BEGIN
            DECLARE @detalle_item VARCHAR(500);
            DECLARE @titulo VARCHAR(30);
            DECLARE @descripcion VARCHAR(255);
            DECLARE @pos INT = 1;
            DECLARE @colon_pos INT;

            WHILE @pos <= LEN(@detalles)
            BEGIN
                DECLARE @next_comma INT = CHARINDEX(',', @detalles, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@detalles) + 1;

                SET @detalle_item = LTRIM(RTRIM(SUBSTRING(@detalles, @pos, @next_comma - @pos)));
                SET @colon_pos = CHARINDEX(':', @detalle_item);

                IF @colon_pos > 0
                BEGIN
                    SET @titulo = LTRIM(RTRIM(SUBSTRING(@detalle_item, 1, @colon_pos - 1)));
                    SET @descripcion = LTRIM(RTRIM(SUBSTRING(@detalle_item, @colon_pos + 1, LEN(@detalle_item))));

                    INSERT INTO Detalle (id_progreso, titulo, descripcion)
                    VALUES (@id_progreso, @titulo, @descripcion);
                END

                SET @pos = @next_comma + 1;
            END
        END

        -- Insertar mediciones si se proporcionaron (formato simplificado)
        IF @mediciones IS NOT NULL
        BEGIN
            DECLARE @medicion_item VARCHAR(200);
            DECLARE @musculo_nombre VARCHAR(25);
            DECLARE @medida_cm DECIMAL(5,1);
            SET @pos = 1;

            WHILE @pos <= LEN(@mediciones)
            BEGIN
                SET @next_comma = CHARINDEX(',', @mediciones, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@mediciones) + 1;

                SET @medicion_item = LTRIM(RTRIM(SUBSTRING(@mediciones, @pos, @next_comma - @pos)));

                -- Parsear valores separados por ':' (solo nombre y medida)
                DECLARE @colon_medicion INT = CHARINDEX(':', @medicion_item);

                IF @colon_medicion > 0
                BEGIN
                    SET @musculo_nombre = LTRIM(RTRIM(SUBSTRING(@medicion_item, 1, @colon_medicion - 1)));
                    SET @medida_cm = CAST(LTRIM(RTRIM(SUBSTRING(@medicion_item, @colon_medicion + 1, LEN(@medicion_item)))) AS DECIMAL(5,1));

                    INSERT INTO Medicion (id_progreso, musculo_nombre, medida_cm)
                    VALUES (@id_progreso, @musculo_nombre, @medida_cm);
                END

                SET @pos = @next_comma + 1;
            END
        END

        COMMIT TRANSACTION;

        SELECT
            @id_progreso AS id_progreso,
            'Progreso registrado exitosamente' AS mensaje;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;


-- ===============================================================
-- PROCEDIMIENTO: ACTUALIZACIÓN COMPLETA DE PROGRESO
-- Autor: Sistema Gimnasio
-- Propósito: Actualizar progreso existente con toda su información relacionada
-- Estrategia: Reemplazo controlado con validaciones de negocio
-- ===============================================================

CREATE PROCEDURE sp_ActualizarProgreso
    @id_progreso INT,
    @peso_kg DECIMAL(5,2) = NULL,
    @porcentaje_grasa TINYINT = NULL,
    @edad_metabolica TINYINT = NULL,
    @detalles VARCHAR(2000) = NULL, -- formato: 'titulo1:descripcion1,titulo2:descripcion2'
    @mediciones VARCHAR(1000) = NULL, -- formato: 'musculo_nombre:medida_cm,musculo_nombre2:medida_cm2'
    @preservar_detalles_existentes BIT = 0, -- 0 = reemplazar, 1 = mantener existentes
    @preservar_mediciones_existentes BIT = 0 -- 0 = reemplazar, 1 = mantener existentes
AS
BEGIN
    SET NOCOUNT ON;

    -- Variables de control
    DECLARE @cedula_cliente VARCHAR(11);
    DECLARE @fecha_original DATE;
    DECLARE @registros_detalles_eliminados INT = 0;
    DECLARE @registros_mediciones_eliminadas INT = 0;
    DECLARE @registros_detalles_agregados INT = 0;
    DECLARE @registros_mediciones_agregadas INT = 0;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- ===================================
        -- 1. VALIDACIONES CRÍTICAS
        -- ===================================

        -- Verificar que el progreso existe
        SELECT
            @cedula_cliente = cedula_cliente,
            @fecha_original = fecha
        FROM Progreso
        WHERE id_progreso = @id_progreso;

        IF @cedula_cliente IS NULL
        BEGIN
            RAISERROR('Progreso no encontrado con ID: %d', 16, 1, @id_progreso);
            RETURN;
        END

        -- Verificar que el cliente aún existe y está activo
        IF NOT EXISTS (SELECT 1 FROM Cliente WHERE cedula_cliente = @cedula_cliente AND estado = 1)
        BEGIN
            RAISERROR('Cliente no encontrado o inactivo: %s', 16, 1, @cedula_cliente);
            RETURN;
        END

        -- Validar rangos de datos
        IF @peso_kg IS NOT NULL AND (@peso_kg < 30 OR @peso_kg > 300)
        BEGIN
            DECLARE @error_peso VARCHAR(100) = 'Peso fuera del rango válido (30-300 kg): ' + CAST(@peso_kg AS VARCHAR);
            RAISERROR(@error_peso, 16, 1);
            RETURN;
        END

        IF @porcentaje_grasa IS NOT NULL AND (@porcentaje_grasa < 0 OR @porcentaje_grasa > 100)
        BEGIN
            DECLARE @error_grasa VARCHAR(100) = 'Porcentaje de grasa fuera del rango válido (0-100%): ' + CAST(@porcentaje_grasa AS VARCHAR);
            RAISERROR(@error_grasa, 16, 1);
            RETURN;
        END

        IF @edad_metabolica IS NOT NULL AND (@edad_metabolica < 10 OR @edad_metabolica > 100)
        BEGIN
            DECLARE @error_edad VARCHAR(100) = 'Edad metabólica fuera del rango válido (10-100): ' + CAST(@edad_metabolica AS VARCHAR);
            RAISERROR(@error_edad, 16, 1);
            RETURN;
        END

        -- ===================================
        -- 2. ACTUALIZAR TABLA PRINCIPAL
        -- ===================================

        UPDATE Progreso
        SET
            peso_kg = ISNULL(@peso_kg, peso_kg),
            porcentaje_grasa = ISNULL(@porcentaje_grasa, porcentaje_grasa),
            edad_metabolica = ISNULL(@edad_metabolica, edad_metabolica)
        WHERE id_progreso = @id_progreso;

        -- ===================================
        -- 3. GESTIÓN DE DETALLES
        -- ===================================

        IF @detalles IS NOT NULL
        BEGIN
            -- Estrategia de reemplazo o preservación
            IF @preservar_detalles_existentes = 0
            BEGIN
                -- ELIMINAR detalles existentes
                SELECT @registros_detalles_eliminados = COUNT(*)
                FROM Detalle
                WHERE id_progreso = @id_progreso;

                DELETE FROM Detalle
                WHERE id_progreso = @id_progreso;
            END

            -- INSERTAR nuevos detalles
            DECLARE @detalle_item VARCHAR(500);
            DECLARE @titulo VARCHAR(30);
            DECLARE @descripcion VARCHAR(255);
            DECLARE @pos INT = 1;
            DECLARE @colon_pos INT;

            WHILE @pos <= LEN(@detalles)
            BEGIN
                DECLARE @next_comma INT = CHARINDEX(',', @detalles, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@detalles) + 1;

                SET @detalle_item = LTRIM(RTRIM(SUBSTRING(@detalles, @pos, @next_comma - @pos)));
                SET @colon_pos = CHARINDEX(':', @detalle_item);

                IF @colon_pos > 0
                BEGIN
                    SET @titulo = LTRIM(RTRIM(SUBSTRING(@detalle_item, 1, @colon_pos - 1)));
                    SET @descripcion = LTRIM(RTRIM(SUBSTRING(@detalle_item, @colon_pos + 1, LEN(@detalle_item))));

                    -- Validar duplicados si estamos preservando
                    IF @preservar_detalles_existentes = 1
                    BEGIN
                        IF NOT EXISTS (SELECT 1 FROM Detalle WHERE id_progreso = @id_progreso AND titulo = @titulo)
                        BEGIN
                            INSERT INTO Detalle (id_progreso, titulo, descripcion)
                            VALUES (@id_progreso, @titulo, @descripcion);
                            SET @registros_detalles_agregados = @registros_detalles_agregados + 1;
                        END
                    END
                    ELSE
                    BEGIN
                        INSERT INTO Detalle (id_progreso, titulo, descripcion)
                        VALUES (@id_progreso, @titulo, @descripcion);
                        SET @registros_detalles_agregados = @registros_detalles_agregados + 1;
                    END
                END

                SET @pos = @next_comma + 1;
            END
        END

        -- ===================================
        -- 4. GESTIÓN DE MEDICIONES
        -- ===================================

        IF @mediciones IS NOT NULL
        BEGIN
            -- Estrategia de reemplazo o preservación
            IF @preservar_mediciones_existentes = 0
            BEGIN
                -- ELIMINAR mediciones existentes
                SELECT @registros_mediciones_eliminadas = COUNT(*)
                FROM Medicion
                WHERE id_progreso = @id_progreso;

                DELETE FROM Medicion
                WHERE id_progreso = @id_progreso;
            END

            -- INSERTAR nuevas mediciones
            DECLARE @medicion_item VARCHAR(200);
            DECLARE @musculo_nombre VARCHAR(25);
            DECLARE @medida_cm DECIMAL(5,1);
            SET @pos = 1;

            WHILE @pos <= LEN(@mediciones)
            BEGIN
                SET @next_comma = CHARINDEX(',', @mediciones, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@mediciones) + 1;

                SET @medicion_item = LTRIM(RTRIM(SUBSTRING(@mediciones, @pos, @next_comma - @pos)));
                DECLARE @colon_medicion INT = CHARINDEX(':', @medicion_item);

                IF @colon_medicion > 0
                BEGIN
                    SET @musculo_nombre = LTRIM(RTRIM(SUBSTRING(@medicion_item, 1, @colon_medicion - 1)));

                    -- Validación de conversión numérica
                    DECLARE @valor_medida VARCHAR(10) = LTRIM(RTRIM(SUBSTRING(@medicion_item, @colon_medicion + 1, LEN(@medicion_item))));

                    BEGIN TRY
                        SET @medida_cm = CAST(@valor_medida AS DECIMAL(5,1));
                    END TRY
                    BEGIN CATCH
                        DECLARE @error_medida VARCHAR(100) = 'Medida inválida para ' + @musculo_nombre + ': ' + @valor_medida;
                        RAISERROR(@error_medida, 16, 1);
                        ROLLBACK TRANSACTION;
                        RETURN;
                    END CATCH

                    -- Validar rango de medida
                    IF @medida_cm <= 0 OR @medida_cm > 200
                    BEGIN
                        DECLARE @error_rango VARCHAR(100) = 'Medida fuera del rango válido para ' + @musculo_nombre + ': ' + CAST(@medida_cm AS VARCHAR) + ' cm';
                        RAISERROR(@error_rango, 16, 1);
                        ROLLBACK TRANSACTION;
                        RETURN;
                    END

                    -- Validar duplicados si estamos preservando
                    IF @preservar_mediciones_existentes = 1
                    BEGIN
                        IF EXISTS (SELECT 1 FROM Medicion WHERE id_progreso = @id_progreso AND musculo_nombre = @musculo_nombre)
                        BEGIN
                            -- Actualizar medición existente
                            UPDATE Medicion
                            SET medida_cm = @medida_cm
                            WHERE id_progreso = @id_progreso AND musculo_nombre = @musculo_nombre;
                        END
                        ELSE
                        BEGIN
                            INSERT INTO Medicion (id_progreso, musculo_nombre, medida_cm)
                            VALUES (@id_progreso, @musculo_nombre, @medida_cm);
                            SET @registros_mediciones_agregadas = @registros_mediciones_agregadas + 1;
                        END
                    END
                    ELSE
                    BEGIN
                        INSERT INTO Medicion (id_progreso, musculo_nombre, medida_cm)
                        VALUES (@id_progreso, @musculo_nombre, @medida_cm);
                        SET @registros_mediciones_agregadas = @registros_mediciones_agregadas + 1;
                    END
                END

                SET @pos = @next_comma + 1;
            END
        END

        -- ===================================
        -- 5. AUDITORÍA DE CAMBIOS
        -- ===================================

        -- Crear registro de auditoría del cambio
        DECLARE @fecha_actualizacion VARCHAR(20) = CONVERT(VARCHAR, GETDATE(), 120);
        DECLARE @mensaje_auditoria VARCHAR(255) = 'Actualización realizada el ' + @fecha_actualizacion +
                '. Detalles: ' + CAST(@registros_detalles_eliminados AS VARCHAR) + ' eliminados, ' +
                CAST(@registros_detalles_agregados AS VARCHAR) + ' agregados' +
                '. Mediciones: ' + CAST(@registros_mediciones_eliminadas AS VARCHAR) + ' eliminadas, ' +
                CAST(@registros_mediciones_agregadas AS VARCHAR) + ' agregadas';

        INSERT INTO Detalle (id_progreso, titulo, descripcion)
        VALUES (@id_progreso, 'Progreso Actualizado', @mensaje_auditoria);

        COMMIT TRANSACTION;

        -- ===================================
        -- 6. RESULTADO DE LA OPERACIÓN
        -- ===================================

        SELECT
            @id_progreso AS id_progreso,
            @cedula_cliente AS cedula_cliente,
            @fecha_original AS fecha_progreso,
            @registros_detalles_eliminados AS detalles_eliminados,
            @registros_detalles_agregados AS detalles_agregados,
            @registros_mediciones_eliminadas AS mediciones_eliminadas,
            @registros_mediciones_agregadas AS mediciones_agregadas,
            'Progreso actualizado exitosamente' AS mensaje;

        PRINT 'Progreso ID ' + CAST(@id_progreso AS VARCHAR) + ' actualizado exitosamente para cliente ' + @cedula_cliente;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;