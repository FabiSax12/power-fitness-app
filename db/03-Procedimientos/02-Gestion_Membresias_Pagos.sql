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

        -- Crear membresía
        INSERT INTO Membresia (cedula_cliente, id_tipo_membresia, fecha_inicio, fecha_vencimiento, id_estado_membresia)
        VALUES (@cedula_cliente, @id_tipo_membresia, @fecha_inicio, @fecha_inicio, 1); -- 1 = Activa

        SET @id_membresia = SCOPE_IDENTITY();

        -- Obtener o crear método de pago
        SELECT @id_metodo_pago = id_metodo_pago FROM Metodo_Pago WHERE nombre = @metodo_pago;
        IF @id_metodo_pago IS NULL
        BEGIN
            INSERT INTO Metodo_Pago (nombre) VALUES (@metodo_pago);
            SET @id_metodo_pago = SCOPE_IDENTITY();
        END

        -- Crear pago
        INSERT INTO Pago (monto, id_membresia, id_estado, id_metodo_pago, fecha_pago)
        VALUES (@precio, @id_membresia, 1, @id_metodo_pago, @fecha_inicio); -- 1 = Pagado

        COMMIT TRANSACTION;

        SELECT
            @id_membresia AS id_membresia,
            @precio AS monto_pagado,
            @fecha_inicio AS fecha_inicio,
            @fecha_inicio AS fecha_vencimiento,
            'Membresía creada exitosamente' AS mensaje;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
go

