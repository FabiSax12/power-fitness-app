-- drop procedure sp_validarDatosPersona
create procedure sp_validarDatosPersona
    @cedula TCedula,
    @nombre VARCHAR(30),
    @apellido1 VARCHAR(30),
    @apellido2 VARCHAR(30),
    @genero_nombre VARCHAR(9), -- 'Masculino' o 'Femenino'
    @contrasena TContrasena,
    @correo TCorreo,
    @fecha_nacimiento DATE
as
begin
    set nocount on;
    set xact_abort on;

    IF LEN(LTRIM(RTRIM(CONCAT(@cedula, '')))) = 0
           THROW 51020, N'La cédula es obligatoria.', 1;
    IF LEN(LTRIM(RTRIM(CONCAT(@nombre, '')))) = 0
           THROW 51021, N'El nombre es obligatorio.', 1;
    IF LEN(LTRIM(RTRIM(CONCAT(@apellido1, '')))) = 0
           THROW 51022, N'El primer apellido es obligatorio.', 1;
    IF LEN(LTRIM(RTRIM(CONCAT(@apellido2, '')))) = 0
           THROW 51023, N'El segundo apellido es obligatorio.', 1;
    IF LEN(LTRIM(RTRIM(CONCAT(@genero_nombre, '')))) = 0
           THROW 51024, N'El género es obligatorio.', 1;
    IF LEN(LTRIM(RTRIM(CONCAT(@contrasena, '')))) = 0
           THROW 51025, N'La contraseña es obligatoria.', 1;
    IF LEN(LTRIM(RTRIM(CONCAT(@correo, '')))) = 0
           THROW 51026, N'El correo es obligatorio.', 1;
    IF LEN(LTRIM(RTRIM(CONCAT(@fecha_nacimiento, '')))) = 0
           THROW 51027, N'La fecha de nacimiento es obligatoria.', 1;
    IF DATEDIFF(year, @fecha_nacimiento, GETDATE()) < 12
        THROW 51028, N'La persona debe tener al menos 12 años.', 1;
    IF DATEDIFF(year, @fecha_nacimiento, GETDATE()) > 120
        THROW 51028, N'La persona debe tener como máximo 100 años.', 1;
end
go

--drop procedure sp_InsertarCliente
-- Procedimiento para crear una persona completa (Cliente)
CREATE PROCEDURE sp_InsertarCliente
    @cedula Tcedula,
    @nombre VARCHAR(30),
    @apellido1 VARCHAR(30),
    @apellido2 VARCHAR(30),
    @genero_nombre VARCHAR(9), -- 'Masculino' o 'Femenino'
    @contrasena TCONTRASENA,
    @correo TCORREO,
    @fecha_nacimiento DATE,
    @telefonos VARCHAR(500) = NULL, -- Lista separada por comas: '88887777,22223333'
    @nivel_fitness VARCHAR(20) = 'Principiante',
    @peso TPeso = 70.0,
    @testing bit = 0
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        exec sp_validarDatosPersona
        @cedula,@nombre,@apellido1,@apellido2,
        @genero_nombre,@contrasena,@correo,@fecha_nacimiento;

        DECLARE @id_genero TINYINT;
        DECLARE @id_nivel_fitness INT;

        -- Obtener ID del género
        SELECT @id_genero = id FROM Genero WHERE nombre = LTRIM(RTRIM(@genero_nombre));
        IF @id_genero IS NULL
            THROW 51029, N'Género no válido. Use: Masculino o Femenino', 1;

        -- Obtener ID del nivel fitness
        SELECT @id_nivel_fitness = id_nivel_fitness FROM Nivel_Fitness WHERE nivel = @nivel_fitness;
        IF @id_nivel_fitness IS NULL
            THROW 51030, N'Nivel de fitness no válido', 1;

        -- Insertar persona
        INSERT INTO Persona (cedula, nombre, apellido1, apellido2, genero, contraseña, correo, fecha_nacimiento)
        VALUES (@cedula, @nombre, @apellido1, @apellido2, @id_genero, @contrasena, @correo, @fecha_nacimiento);

        -- Insertar cliente
        INSERT INTO Cliente (cedula_cliente, id_nivel_fitness, peso)
        VALUES (@cedula, @id_nivel_fitness, @peso);

        -- Insertar y relacionar teléfonos si se proporcionaron
        IF @telefonos IS NOT NULL
        BEGIN
            DECLARE @SplitTelefonos TABLE (numero_telefono VARCHAR(8));
            DECLARE @Conflictos TABLE (numero_telefono VARCHAR(8));

            -- Poblar SplitTelefonos
            INSERT INTO @SplitTelefonos (numero_telefono)
            SELECT TRIM(value)
            FROM STRING_SPLIT(@telefonos, ',')
            WHERE value <> '';  -- Evita cadenas vacías

            -- Poblar Conflictos
            INSERT INTO @Conflictos (numero_telefono)
            SELECT s.numero_telefono
            FROM @SplitTelefonos s
            WHERE EXISTS (
                SELECT 1 FROM Telefono t
                WHERE t.numero_telefono = s.numero_telefono
                    AND t.cedula_persona = @cedula  -- Duplicado para la misma persona
            )
            OR EXISTS (
                SELECT 1 FROM Telefono t
                WHERE t.numero_telefono = s.numero_telefono
                    AND t.cedula_persona <> @cedula  -- Asignado a otra persona
            );

            IF EXISTS (SELECT 1 FROM @Conflictos)
            BEGIN
                DECLARE @mensaje_error NVARCHAR(1000) = N'Error en teléfonos: Los siguientes números ya están asignados: ' +
                    (SELECT STRING_AGG(numero_telefono, ', ') FROM @Conflictos);
                THROW 51032, @mensaje_error, 1;  -- Lanza error con detalles
            END
            ELSE
            BEGIN
                INSERT INTO Telefono (numero_telefono, cedula_persona)
                SELECT s.numero_telefono, @cedula
                FROM @SplitTelefonos s;
            END;
        END

        -- Bloque para testing
        IF @testing = 1
        BEGIN
            PRINT 'Datos del Cliente: ' + @nombre + ' ' + @apellido1 + ' correctos';
            PRINT 'Pero los datos no fueron almacenados (testing = 1)';
            THROW 51033, N'Modo testing activado: cambios no guardados para evitar alteraciones en la base de datos.', 1;  -- Lanza error para cancelar transacción
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
    @telefonos VARCHAR(500) = NULL -- Lista separada por comas: '88887777,22223333'
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

-- Procedimiento para crear administrativo
CREATE PROCEDURE sp_InsertarAdministrativo
    --Datos de tabla Personas
    @cedula VARCHAR(11),
    @nombre VARCHAR(30),
    @apellido1 VARCHAR(30),
    @apellido2 VARCHAR(30),
    @genero_nombre VARCHAR(9),
    @contrasena VARCHAR(20),
    @correo VARCHAR(50),
    @fecha_nacimiento DATE,

    -- JSON array de IDs de permiso: '[1,2,3]'
    @permisos         NVARCHAR(100) = NULL,

    -- JSON array de teléfonos: '["88887777","22223333"]'
    @telefonos VARCHAR(500) = NULL, -- Lista separada por comas: '88887777,22223333'

    --Datos de tabla Administrativo
    @cargo VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- 0) VALIDACIÓN DE PARÁMETROS OBLIGATORIOS
    -- CONCAT(@p,'') convierte NULL en '', TRIM(…) quita espacios, LEN=0
    IF LEN(TRIM(CONCAT(@cedula,''))) = 0
        THROW 51020, N'La cédula es obligatoria.',1;
    IF LEN(TRIM(CONCAT(@nombre,''))) = 0
        THROW 51021, N'El nombre es obligatorio.',1;
    IF LEN(TRIM(CONCAT(@apellido1,''))) = 0
        THROW 51022, N'El primer apellido es obligatorio.',1;
    IF LEN(TRIM(CONCAT(@apellido2,''))) = 0
        THROW 51023, N'El segundo apellido es obligatorio.',1;
    IF LEN(TRIM(CONCAT(@genero_nombre,''))) = 0
        THROW 51024, N'El género es obligatorio.',1;
    IF LEN(TRIM(CONCAT(@contrasena,''))) = 0
        THROW 51025, N'La contraseña es obligatoria.',1;
    IF LEN(TRIM(CONCAT(@correo,''))) = 0
        THROW 51026, N'El correo es obligatorio.',1;
    IF LEN(TRIM(CONCAT(@fecha_nacimiento,''))) = 0
        THROW 51027, N'La fecha de nacimiento es obligatoria.',1;
    IF LEN(TRIM(CONCAT(@cargo,''))) = 0
    THROW 51028, N'El cargo es obligatorio.',1;

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
        IF LEN(TRIM(@nombre)) = 0
        BEGIN
            RAISERROR('El campo del nombre debne ser especificado', 16, 1);
            RETURN;
        END
        -- Insertar persona
        INSERT INTO Persona (cedula, nombre, apellido1, apellido2, genero, contraseña, correo, fecha_nacimiento)
        VALUES (@cedula, @nombre, @apellido1, @apellido2, @id_genero, @contrasena, @correo, @fecha_nacimiento);

        -- Obtener ID del Cargo
        DECLARE @id_cargo INT;
        select @id_cargo = id_cargo from Cargo where nombre = @cargo
        if @id_cargo is NULL
        begin
            raiserror('El cargo específicado no existe',16,1);
            return;
        end
        -- Insertar Administrativo
        INSERT INTO Administrativo (cedula_administrativo, id_cargo)
        VALUES (@cedula, @id_cargo);

        -- Insertar permisos si se proporcionaron
        IF @permisos IS NOT NULL
            BEGIN
              -- Validar JSON
              IF ISJSON(@permisos) = 0
                THROW 51010,'@Permisos debe ser un JSON válido: ej. ''[1,2,3]''.', 1;

              -- Inserción masiva desde JSON
              INSERT INTO Administrativo_Permiso
                (id_administrativo, id_permiso)
              SELECT
                @cedula,                   -- tu PK de Administrativo
                j.id_permiso               -- valor entero de cada elemento
              FROM
                OPENJSON(@permisos)
                WITH (id_permiso INT '$') AS j
              -- opcional: validar que exista en tabla Permiso
              WHERE EXISTS (
                SELECT 1
                FROM Permiso p
                WHERE p.id_permiso = j.id_permiso
              );
            END
        -- Manejar teléfonos (código similar al de cliente)
        IF @telefonos IS NOT NULL
        BEGIN
            IF ISJSON(@telefonos) = 0
                THROW 51003,
                  N'@telefonos debe ser un JSON válido: ''["88887777","22223333"]''.', 1;

            -- 5.1) Extraer la lista de números a un table variable
            DECLARE @Phones TABLE (numero VARCHAR(8) PRIMARY KEY);
            INSERT INTO @Phones(numero)
            SELECT TRIM([value])
            FROM OPENJSON(@telefonos);

            -- 5.2) Insertar los que faltan en Telefono
            INSERT INTO Telefono (numero_telefono)
            SELECT p.numero
            FROM @Phones AS p
            LEFT JOIN Telefono AS t
            ON t.numero_telefono = p.numero
            WHERE t.id_telefono IS NULL;

            -- 5.3) Relacionar todos los teléfonos con la persona
            INSERT INTO Telefono_Persona
            (id_telefono, cedula_persona)
            SELECT t.id_telefono, @cedula
            FROM @Phones AS p
            JOIN Telefono AS t
            ON t.numero_telefono = p.numero;
        END

        COMMIT TRANSACTION;
        PRINT 'Administrativo creado exitosamente: ' + @nombre + ' ' + @apellido1;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO