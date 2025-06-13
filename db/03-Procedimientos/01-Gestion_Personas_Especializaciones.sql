-- Procedimiento para crear una persona completa (Cliente)

CREATE PROCEDURE sp_InsertarCliente
    @cedula VARCHAR(11),
    @nombre VARCHAR(30),
    @apellido1 VARCHAR(30),
    @apellido2 VARCHAR(30),
    @genero_nombre VARCHAR(9), -- 'Masculino' o 'Femenino'
    @contrasena VARCHAR(20),
    @correo VARCHAR(50),
    @fecha_nacimiento DATE,
    @telefonos VARCHAR(500) = NULL, -- Lista separada por comas: '88887777,22223333'
    @nivel_fitness VARCHAR(20) = 'Principiante',
    @peso DECIMAL(5,2) = 70.0
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_genero TINYINT;
    DECLARE @id_nivel_fitness INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Obtener ID del género
        SELECT @id_genero = id FROM Genero WHERE nombre = @genero_nombre;
        IF @id_genero IS NULL
        BEGIN
            RAISERROR('Género no válido. Use: Masculino o Femenino', 16, 1);
            RETURN;
        END

        -- Obtener ID del nivel fitness
        SELECT @id_nivel_fitness = id_nivel_fitness FROM Nivel_Fitness WHERE nivel = @nivel_fitness;
        IF @id_nivel_fitness IS NULL
        BEGIN
            RAISERROR('Nivel de fitness no válido', 16, 1);
            RETURN;
        END

        -- Insertar persona
        INSERT INTO Persona (cedula, nombre, apellido1, apellido2, genero, contraseña, correo, fecha_nacimiento)
        VALUES (@cedula, @nombre, @apellido1, @apellido2, @id_genero, @contrasena, @correo, @fecha_nacimiento);

        -- Insertar cliente
        INSERT INTO Cliente (cedula_cliente, id_nivel_fitness, peso)
        VALUES (@cedula, @id_nivel_fitness, @peso);

        -- Insertar teléfonos si se proporcionaron
        IF @telefonos IS NOT NULL
        BEGIN
            DECLARE @telefono VARCHAR(8);
            DECLARE @pos INT = 1;
            DECLARE @id_telefono INT;

            WHILE @pos <= LEN(@telefonos)
            BEGIN
                DECLARE @next_comma INT = CHARINDEX(',', @telefonos, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@telefonos) + 1;

                SET @telefono = LTRIM(RTRIM(SUBSTRING(@telefonos, @pos, @next_comma - @pos)));

                -- Verificar si el teléfono ya existe
                SELECT @id_telefono = id_telefono FROM Telefono WHERE numero_telefono = @telefono;

                IF @id_telefono IS NULL
                BEGIN
                    INSERT INTO Telefono (numero_telefono) VALUES (@telefono);
                    SET @id_telefono = SCOPE_IDENTITY();
                END

                -- Relacionar teléfono con persona
                INSERT INTO Telefono_Persona (id_telefono, cedula_persona) VALUES (@id_telefono, @cedula);

                SET @pos = @next_comma + 1;
            END
        END

        COMMIT TRANSACTION;
        PRINT 'Cliente creado exitosamente: ' + @nombre + ' ' + @apellido1;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- Procedimiento para crear entrenador

CREATE PROCEDURE sp_InsertarEntrenador
    @cedula VARCHAR(11),
    @nombre VARCHAR(30),
    @apellido1 VARCHAR(30),
    @apellido2 VARCHAR(30),
    @genero_nombre VARCHAR(9),
    @contrasena VARCHAR(20),
    @correo VARCHAR(50),
    @fecha_nacimiento DATE,
    @experiencia VARCHAR(255) = NULL,
    @especialidades VARCHAR(500) = NULL, -- Lista separada por comas
    @telefonos VARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_genero TINYINT;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Obtener ID del género
        SELECT @id_genero = id FROM Genero WHERE nombre = @genero_nombre;
        IF @id_genero IS NULL
        BEGIN
            RAISERROR('Género no válido. Use: Masculino o Femenino', 16, 1);
            RETURN;
        END

        -- Insertar persona
        INSERT INTO Persona (cedula, nombre, apellido1, apellido2, genero, contraseña, correo, fecha_nacimiento)
        VALUES (@cedula, @nombre, @apellido1, @apellido2, @id_genero, @contrasena, @correo, @fecha_nacimiento);

        -- Insertar entrenador
        INSERT INTO Entrenador (cedula_entrenador, experiencia)
        VALUES (@cedula, @experiencia);

        -- Insertar especialidades si se proporcionaron
        IF @especialidades IS NOT NULL
        BEGIN
            DECLARE @especialidad VARCHAR(50);
            DECLARE @id_especialidad INT;
            DECLARE @pos INT = 1;

            WHILE @pos <= LEN(@especialidades)
            BEGIN
                DECLARE @next_comma INT = CHARINDEX(',', @especialidades, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@especialidades) + 1;

                SET @especialidad = LTRIM(RTRIM(SUBSTRING(@especialidades, @pos, @next_comma - @pos)));

                -- Buscar o crear especialidad
                SELECT @id_especialidad = id_especialidad FROM Especialidad WHERE nombre = @especialidad;
                IF @id_especialidad IS NULL
                BEGIN
                    INSERT INTO Especialidad (nombre) VALUES (@especialidad);
                    SET @id_especialidad = SCOPE_IDENTITY();
                END

                INSERT INTO Entrenador_Especialidad (id_entrenador, id_especialidad) VALUES (@cedula, @id_especialidad);

                SET @pos = @next_comma + 1;
            END
        END

        -- Manejar teléfonos (código similar al de cliente)
        IF @telefonos IS NOT NULL
        BEGIN
            DECLARE @telefono VARCHAR(8);
            DECLARE @id_telefono INT;
            SET @pos = 1;

            WHILE @pos <= LEN(@telefonos)
            BEGIN
                SET @next_comma = CHARINDEX(',', @telefonos, @pos);
                IF @next_comma = 0 SET @next_comma = LEN(@telefonos) + 1;

                SET @telefono = LTRIM(RTRIM(SUBSTRING(@telefonos, @pos, @next_comma - @pos)));

                SELECT @id_telefono = id_telefono FROM Telefono WHERE numero_telefono = @telefono;

                IF @id_telefono IS NULL
                BEGIN
                    INSERT INTO Telefono (numero_telefono) VALUES (@telefono);
                    SET @id_telefono = SCOPE_IDENTITY();
                END

                INSERT INTO Telefono_Persona (id_telefono, cedula_persona) VALUES (@id_telefono, @cedula);

                SET @pos = @next_comma + 1;
            END
        END

        COMMIT TRANSACTION;
        PRINT 'Entrenador creado exitosamente: ' + @nombre + ' ' + @apellido1;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- Consultar información completa de cliente

CREATE PROCEDURE sp_ConsultarCliente
    @cedula VARCHAR(11) = NULL,
    @correo VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.cedula,
        p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS nombre_completo,
        p.correo,
        g.nombre AS genero,
        p.fecha_nacimiento,
        DATEDIFF(YEAR, p.fecha_nacimiento, GETDATE()) AS edad,
        p.fecha_registro,
        c.peso,
        nf.nivel AS nivel_fitness,
        CASE WHEN c.estado = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado_cliente,
        -- Teléfonos concatenados
        STUFF((
            SELECT ', ' + t.numero_telefono
            FROM Telefono_Persona tp
            INNER JOIN Telefono t ON tp.id_telefono = t.id_telefono
            WHERE tp.cedula_persona = p.cedula
            FOR XML PATH('')
        ), 1, 2, '') AS telefonos,
        -- Objetivos concatenados
        STUFF((
            SELECT ', ' + o.descripcion
            FROM Cliente_Objetivo co
            INNER JOIN Objetivo o ON co.id_objetivo = o.id_objetivo
            WHERE co.cedula_cliente = p.cedula
            FOR XML PATH('')
        ), 1, 2, '') AS objetivos
    FROM Persona p
    INNER JOIN Cliente c ON p.cedula = c.cedula_cliente
    INNER JOIN Genero g ON p.genero = g.id
    LEFT JOIN Nivel_Fitness nf ON c.id_nivel_fitness = nf.id_nivel_fitness
    WHERE (@cedula IS NULL OR p.cedula = @cedula)
        AND (@correo IS NULL OR p.correo = @correo);
END;
GO
