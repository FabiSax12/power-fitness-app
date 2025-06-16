CREATE TRIGGER tr_softDelete_Tipo_Membresia
ON Tipo_Membresia 
INSTEAD OF DELETE 
AS 
BEGIN 
    SET NOCOUNT ON;

    BEGIN TRY
        -- Actualizar todos los registros que se intentaron eliminar
        UPDATE Tipo_Membresia
        SET activo = 0
        WHERE id_tipo_membresia IN (
            SELECT id_tipo_membresia FROM deleted
        );
    END TRY
    BEGIN CATCH
        DECLARE @error_message VARCHAR(500) = ERROR_MESSAGE();
        RAISERROR(@error_message, 16, 1);
    END CATCH
END;
