-- ===================================================
-- DOMINIO 3: GESTIÓN DE RUTINAS DE EJERCICIO
-- ===================================================

-- Procedimiento para crear rutina
CREATE PROCEDURE sp_CrearRutina
    @cedula_cliente VARCHAR(11),
    @cedula_entrenador VARCHAR(11),
    @tipo_rutina VARCHAR(15), -- Nombre del tipo
    @descripcion VARCHAR(200) = NULL,
    @dias VARCHAR(100) = NULL -- Lista separada por comas: 'Lunes,Miércoles,Viernes'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_tipo_rutina INT;
    DECLARE @id_rutina INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar que cliente y entrenador existen
        IF NOT EXISTS (SELECT 1 FROM Cliente WHERE cedula_cliente = @cedula_cliente)
        BEGIN
            RAISERROR('Cliente no encontrado', 16, 1);
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Entrenador WHERE cedula_entrenador = @cedula_entrenador)
        BEGIN
            RAISERROR('Entrenador no encontrado', 16, 1);
            RETURN;
        END

        -- Obtener tipo de rutina
        SELECT @id_tipo_rutina = id_tipo_rutina FROM Tipo_Rutina WHERE nombre = @tipo_rutina;
        IF @id_tipo_rutina IS NULL
        BEGIN
            -- Crear tipo de rutina si no existe
            INSERT INTO Tipo_Rutina (nombre) VALUES (@tipo_rutina);
            SET @id_tipo_rutina = SCOPE_IDENTITY();
        END

        -- Crear rutina
        INSERT INTO Rutina (cedula_cliente, cedula_entrenador, id_tipo_rutina, descripcion)
        VALUES (@cedula_cliente, @cedula_entrenador, @id_tipo_rutina, @descripcion);

        SET @id_rutina = SCOPE_IDENTITY();

        -- Asignar días si se proporcionaron
        IF @dias IS NOT NULL
        BEGIN
            DECLARE @dia_nombre VARCHAR(10);
            DECLARE @id_dia INT;
            DECLARE @pos INT = 1;

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

                INSERT INTO Dia_Rutina (id_rutina, id_dia) VALUES (@id_rutina, @id_dia);

                SET @pos = @next_comma + 1;
            END
        END

        COMMIT TRANSACTION;

        SELECT
            @id_rutina AS id_rutina,
            'Rutina creada exitosamente' AS mensaje;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- Procedimiento para agregar ejercicio a rutina
CREATE PROCEDURE sp_AgregarEjercicioRutina
    @id_rutina INT,
    @nombre_ejercicio VARCHAR(25),
    @repeticiones INT = 1,
    @tiempo_descanso TIME = NULL,
    @dificultad VARCHAR(20) = 'Intermedio'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_ejercicio INT;
    DECLARE @id_dificultad INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar que la rutina existe
        IF NOT EXISTS (SELECT 1 FROM Rutina WHERE id_rutina = @id_rutina)
        BEGIN
            RAISERROR('Rutina no encontrada', 16, 1);
            RETURN;
        END

        -- Buscar o crear dificultad
        SELECT @id_dificultad = id_dificultad FROM Dificultad WHERE dificultad = @dificultad;
        IF @id_dificultad IS NULL
        BEGIN
            INSERT INTO Dificultad (dificultad) VALUES (@dificultad);
            SET @id_dificultad = SCOPE_IDENTITY();
        END

        -- Buscar o crear ejercicio
        SELECT @id_ejercicio = id_ejercicio FROM Ejercicio WHERE nombre = @nombre_ejercicio;
        IF @id_ejercicio IS NULL
        BEGIN
            INSERT INTO Ejercicio (nombre, id_dificultad) VALUES (@nombre_ejercicio, @id_dificultad);
            SET @id_ejercicio = SCOPE_IDENTITY();
        END

        -- Agregar ejercicio a rutina
        INSERT INTO Ejercicio_Rutina (id_ejercicio, id_rutina, repeticiones, tiempo_descanso)
        VALUES (@id_ejercicio, @id_rutina, @repeticiones, @tiempo_descanso);

        COMMIT TRANSACTION;
        PRINT 'Ejercicio agregado exitosamente a la rutina';

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- Consultar rutinas completas
CREATE PROCEDURE sp_ConsultarRutinas
    @cedula_cliente VARCHAR(11) = NULL,
    @cedula_entrenador VARCHAR(11) = NULL,
    @estado VARCHAR(15) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        r.id_rutina,
        pc.nombre + ' ' + pc.apellido1 AS cliente,
        pe.nombre + ' ' + pe.apellido1 AS entrenador,
        tr.nombre AS tipo_rutina,
        r.descripcion,
        r.fecha_creacion,
        r.fecha_fin,
        er.nombre AS estado,
        -- Días de la rutina
        STUFF((
            SELECT ', ' + d.dia
            FROM Dia_Rutina dr
            INNER JOIN Dia d ON dr.id_dia = d.id_dia
            WHERE dr.id_rutina = r.id_rutina
            FOR XML PATH('')
        ), 1, 2, '') AS dias,
        -- Ejercicios de la rutina
        STUFF((
            SELECT CHAR(13) + '• ' + e.nombre + ' (' + CAST(er_sub.repeticiones AS VARCHAR) + ' reps)'
            FROM Ejercicio_Rutina er_sub
            INNER JOIN Ejercicio e ON er_sub.id_ejercicio = e.id_ejercicio
            WHERE er_sub.id_rutina = r.id_rutina
            FOR XML PATH('')
        ), 1, 1, '') AS ejercicios
    FROM Rutina r
    INNER JOIN Cliente c ON r.cedula_cliente = c.cedula_cliente
    INNER JOIN Persona pc ON c.cedula_cliente = pc.cedula
    INNER JOIN Entrenador ent ON r.cedula_entrenador = ent.cedula_entrenador
    INNER JOIN Persona pe ON ent.cedula_entrenador = pe.cedula
    INNER JOIN Tipo_Rutina tr ON r.id_tipo_rutina = tr.id_tipo_rutina
    INNER JOIN Estado_Rutina er ON r.id_estado_rutina = er.id_estado_rutina
    WHERE (@cedula_cliente IS NULL OR r.cedula_cliente = @cedula_cliente)
        AND (@cedula_entrenador IS NULL OR r.cedula_entrenador = @cedula_entrenador)
        AND (@estado IS NULL OR er.nombre = @estado)
    ORDER BY r.fecha_creacion DESC;
END;
GO
