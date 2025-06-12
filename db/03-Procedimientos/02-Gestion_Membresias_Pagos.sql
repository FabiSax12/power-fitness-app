-- ===================================================
-- DOMINIO 2: GESTIÓN DE MEMBRESÍAS Y PAGOS
-- ===================================================

-- Procedimiento para crear membresía

CREATE PROCEDURE sp_CrearMembresia
    @cedula_cliente VARCHAR(11),
    @tipo_membresia VARCHAR(25), -- Nombre del tipo de membresía
    @fecha_inicio DATE = NULL,
    @metodo_pago VARCHAR(50) = 'Efectivo'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_tipo_membresia INT;
    DECLARE @precio DECIMAL(10,2);
    DECLARE @id_frecuencia INT;
    DECLARE @frecuencia_nombre VARCHAR(20);
    DECLARE @fecha_vencimiento DATE;
    DECLARE @id_membresia INT;
    DECLARE @id_metodo_pago INT;

    IF @fecha_inicio IS NULL SET @fecha_inicio = GETDATE();

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar que el cliente existe
        IF NOT EXISTS (SELECT 1 FROM Cliente WHERE cedula_cliente = @cedula_cliente)
        BEGIN
            RAISERROR('Cliente no encontrado', 16, 1);
            RETURN;
        END

        -- Obtener información del tipo de membresía
        SELECT
            @id_tipo_membresia = tm.id_tipo_membresia,
            @precio = tm.precio,
            @id_frecuencia = tm.id_frecuencia
        FROM Tipo_Membresia tm
        WHERE tm.nombre = @tipo_membresia;

        IF @id_tipo_membresia IS NULL
        BEGIN
            RAISERROR('Tipo de membresía no encontrado', 16, 1);
            RETURN;
        END

        -- Obtener frecuencia para calcular vencimiento
        SELECT @frecuencia_nombre = frecuencia FROM Frecuencia WHERE id_frecuencia = @id_frecuencia;

        -- Calcular fecha de vencimiento
        SET @fecha_vencimiento = CASE
            WHEN @frecuencia_nombre = 'Mensual' THEN DATEADD(MONTH, 1, @fecha_inicio)
            WHEN @frecuencia_nombre = 'Anual' THEN DATEADD(YEAR, 1, @fecha_inicio)
            WHEN @frecuencia_nombre = 'Semanal' THEN DATEADD(WEEK, 1, @fecha_inicio)
            WHEN @frecuencia_nombre = 'Diaria' THEN DATEADD(DAY, 1, @fecha_inicio)
            ELSE DATEADD(MONTH, 1, @fecha_inicio)
        END;

        -- Crear membresía
        INSERT INTO Membresia (cedula_cliente, id_tipo_membresia, fecha_inicio, fecha_vencimiento, id_estado_membresia)
        VALUES (@cedula_cliente, @id_tipo_membresia, @fecha_inicio, @fecha_vencimiento, 1); -- 1 = Activa

        SET @id_membresia = SCOPE_IDENTITY();

        -- Obtener o crear método de pago
        SELECT @id_metodo_pago = id_metodo_pago FROM Metodo_Pago WHERE nombre = @metodo_pago;
        IF @id_metodo_pago IS NULL
        BEGIN
            INSERT INTO Metodo_Pago (nombre) VALUES (@metodo_pago);
            SET @id_metodo_pago = SCOPE_IDENTITY();
        END

        -- Crear pago
        INSERT INTO Pago (monto, id_membresia, id_estado, id_metodo_pago)
        VALUES (@precio, @id_membresia, 1, @id_metodo_pago); -- 1 = Pagado

        COMMIT TRANSACTION;

        SELECT
            @id_membresia AS id_membresia,
            @precio AS monto_pagado,
            @fecha_inicio AS fecha_inicio,
            @fecha_vencimiento AS fecha_vencimiento,
            'Membresía creada exitosamente' AS mensaje;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- Procedimiento para renovar membresía
CREATE PROCEDURE sp_RenovarMembresia
    @cedula_cliente VARCHAR(11),
    @fecha_renovacion Date,
    @metodo_pago VARCHAR(50) = 'Efectivo'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_membresia_actual INT;
    DECLARE @id_tipo_membresia INT;
    DECLARE @precio DECIMAL(10,2);
    DECLARE @fecha_vencimiento_actual DATE;
    DECLARE @nueva_fecha_vencimiento DATE;
    DECLARE @id_frecuencia INT;
    DECLARE @frecuencia_nombre VARCHAR(20);
    DECLARE @id_metodo_pago INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Obtener membresía activa actual
        SELECT TOP 1
            @id_membresia_actual = m.id_membresia,
            @id_tipo_membresia = m.id_tipo_membresia,
            @fecha_vencimiento_actual = m.fecha_vencimiento
        FROM Membresia m
        WHERE m.cedula_cliente = @cedula_cliente
            AND m.id_estado_membresia = 1 -- Activa
        ORDER BY m.fecha_vencimiento DESC;

        IF @id_membresia_actual IS NULL
        BEGIN
            RAISERROR('No se encontró membresía activa para renovar', 16, 1);
            RETURN;
        END

        -- Obtener información del tipo de membresía
        SELECT
            @precio = tm.precio,
            @id_frecuencia = tm.id_frecuencia
        FROM Tipo_Membresia tm
        WHERE tm.id_tipo_membresia = @id_tipo_membresia;

        -- Obtener frecuencia
        SELECT @frecuencia_nombre = frecuencia FROM Frecuencia WHERE id_frecuencia = @id_frecuencia;

        -- Calcular nueva fecha de vencimiento (desde la fecha actual de vencimiento)
        SET @nueva_fecha_vencimiento = CASE
            WHEN @frecuencia_nombre = 'Mensual' THEN DATEADD(MONTH, 1, @fecha_vencimiento_actual)
            WHEN @frecuencia_nombre = 'Anual' THEN DATEADD(YEAR, 1, @fecha_vencimiento_actual)
            WHEN @frecuencia_nombre = 'Semanal' THEN DATEADD(WEEK, 1, @fecha_vencimiento_actual)
            WHEN @frecuencia_nombre = 'Diaria' THEN DATEADD(DAY, 1, @fecha_vencimiento_actual)
            ELSE DATEADD(MONTH, 1, @fecha_vencimiento_actual)
        END;

        -- Actualizar fecha de vencimiento
        UPDATE Membresia
        SET fecha_vencimiento = @nueva_fecha_vencimiento
        WHERE id_membresia = @id_membresia_actual;

        -- Obtener método de pago
        SELECT @id_metodo_pago = id_metodo_pago FROM Metodo_Pago WHERE nombre = @metodo_pago;
        IF @id_metodo_pago IS NULL
        BEGIN
            INSERT INTO Metodo_Pago (nombre) VALUES (@metodo_pago);
            SET @id_metodo_pago = SCOPE_IDENTITY();
        END

        -- Crear nuevo pago
        INSERT INTO Pago (monto, id_membresia, id_estado, id_metodo_pago, fecha_pago)
        VALUES (@precio, @id_membresia_actual, 1, @id_metodo_pago, @fecha_renovacion);

        COMMIT TRANSACTION;

        SELECT
            @id_membresia_actual AS id_membresia,
            @precio AS monto_pagado,
            @nueva_fecha_vencimiento AS nueva_fecha_vencimiento,
            'Membresía renovada exitosamente' AS mensaje;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- Consultar estado de membresías
CREATE PROCEDURE sp_ConsultarMembresias
    @cedula_cliente VARCHAR(11) = NULL,
    @estado VARCHAR(15) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.cedula,
        p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS cliente,
        tm.nombre AS tipo_membresia,
        f.frecuencia,
        m.fecha_inicio,
        m.fecha_vencimiento,
        em.estado AS estado_membresia,
        tm.precio,
        CASE
            WHEN m.fecha_vencimiento < GETDATE() THEN 'Vencida'
            WHEN DATEDIFF(DAY, GETDATE(), m.fecha_vencimiento) <= 7 THEN 'Por vencer'
            ELSE 'Vigente'
        END AS situacion,
        DATEDIFF(DAY, GETDATE(), m.fecha_vencimiento) AS dias_restantes
    FROM Membresia m
    INNER JOIN Cliente c ON m.cedula_cliente = c.cedula_cliente
    INNER JOIN Persona p ON c.cedula_cliente = p.cedula
    INNER JOIN Tipo_Membresia tm ON m.id_tipo_membresia = tm.id_tipo_membresia
    INNER JOIN Frecuencia f ON tm.id_frecuencia = f.id_frecuencia
    INNER JOIN Estado_Membresia em ON m.id_estado_membresia = em.id_estado_membresia
    WHERE (@cedula_cliente IS NULL OR m.cedula_cliente = @cedula_cliente)
        AND (@estado IS NULL OR em.estado = @estado)
    ORDER BY m.fecha_vencimiento DESC;
END;
GO