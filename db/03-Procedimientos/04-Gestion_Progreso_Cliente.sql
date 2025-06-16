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