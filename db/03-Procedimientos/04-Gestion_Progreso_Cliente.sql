-- ===================================================
-- DOMINIO 4: GESTIÓN DE PROGRESO DEL CLIENTE
-- ===================================================

-- Procedimiento para registrar progreso
CREATE PROCEDURE sp_RegistrarProgreso
    @cedula_cliente VARCHAR(11),
    @fecha DATE = NULL,
    @detalles VARCHAR(2000) = NULL, -- formato: 'titulo1:descripcion1,titulo2:descripcion2'
    @mediciones VARCHAR(1000) = NULL -- formato: 'musculo:kg_musculo:kg_grasa:cm:edad_metabolica'
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

        -- Crear progreso
        INSERT INTO Progreso (cedula_cliente, fecha)
        VALUES (@cedula_cliente, @fecha);

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

        -- Insertar mediciones si se proporcionaron
        IF @mediciones IS NOT NULL
        BEGIN
            DECLARE @medicion_item VARCHAR(200);
            DECLARE @musculo VARCHAR(25);
            DECLARE @kg_musculo DECIMAL(5,2);
            DECLARE @kg_grasa DECIMAL(5,2);
            DECLARE @cm DECIMAL(5,1);
            DECLARE @edad_metabolica INT;
            DECLARE @valores VARCHAR(200);
            SET @pos = 1;

            WHILE @pos <= LEN(@mediciones)
            BEGIN
                SET @next_comma = CHARINDEX(',', @mediciones, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@mediciones) + 1;

                SET @medicion_item = LTRIM(RTRIM(SUBSTRING(@mediciones, @pos, @next_comma - @pos)));

                -- Parsear valores separados por ':'
                DECLARE @colon1 INT = CHARINDEX(':', @medicion_item);
                DECLARE @colon2 INT = CHARINDEX(':', @medicion_item, @colon1 + 1);
                DECLARE @colon3 INT = CHARINDEX(':', @medicion_item, @colon2 + 1);
                DECLARE @colon4 INT = CHARINDEX(':', @medicion_item, @colon3 + 1);

                IF @colon4 > 0
                BEGIN
                    SET @musculo = SUBSTRING(@medicion_item, 1, @colon1 - 1);
                    SET @kg_musculo = CAST(SUBSTRING(@medicion_item, @colon1 + 1, @colon2 - @colon1 - 1) AS DECIMAL(5,2));
                    SET @kg_grasa = CAST(SUBSTRING(@medicion_item, @colon2 + 1, @colon3 - @colon2 - 1) AS DECIMAL(5,2));
                    SET @cm = CAST(SUBSTRING(@medicion_item, @colon3 + 1, @colon4 - @colon3 - 1) AS DECIMAL(5,1));
                    SET @edad_metabolica = CAST(SUBSTRING(@medicion_item, @colon4 + 1, LEN(@medicion_item)) AS INT);

                    INSERT INTO Medicion (id_progreso, musculo_nombre, musculo_kg, grasa_kg, medida_cm, edad_metabolica)
                    VALUES (@id_progreso, @musculo, @kg_musculo, @kg_grasa, @cm, @edad_metabolica);
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
GO

-- Consultar progreso del cliente
CREATE PROCEDURE sp_ConsultarProgreso
    @cedula_cliente VARCHAR(11),
    @fecha_desde DATE = NULL,
    @fecha_hasta DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @fecha_desde IS NULL SET @fecha_desde = DATEADD(MONTH, -6, GETDATE());
    IF @fecha_hasta IS NULL SET @fecha_hasta = GETDATE();

    SELECT
        p.id_progreso,
        p.fecha,
        pc.nombre + ' ' + pc.apellido1 AS cliente,
        -- Detalles del progreso
        STUFF((
            SELECT CHAR(13) + '• ' + d.titulo + ': ' + d.descripcion
            FROM Detalle d
            WHERE d.id_progreso = p.id_progreso
            FOR XML PATH('')
        ), 1, 1, '') AS detalles,
        -- Mediciones
        STUFF((
            SELECT CHAR(13) + '• ' + m.musculo_nombre +
                   ' - Músculo: ' + CAST(m.musculo_kg AS VARCHAR) + 'kg' +
                   ', Grasa: ' + CAST(m.grasa_kg AS VARCHAR) + 'kg' +
                   ', Medida: ' + CAST(m.medida_cm AS VARCHAR) + 'cm'
            FROM Medicion m
            WHERE m.id_progreso = p.id_progreso
            FOR XML PATH('')
        ), 1, 1, '') AS mediciones
    FROM Progreso p
    INNER JOIN Cliente c ON p.cedula_cliente = c.cedula_cliente
    INNER JOIN Persona pc ON c.cedula_cliente = pc.cedula
    WHERE p.cedula_cliente = @cedula_cliente
        AND p.fecha BETWEEN @fecha_desde AND @fecha_hasta
    ORDER BY p.fecha DESC;
END;
GO