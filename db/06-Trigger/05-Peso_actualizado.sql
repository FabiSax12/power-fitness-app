CREATE TRIGGER trg_ActualizarPesoCliente_PostProgreso
ON Progreso
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Solo actualizar si el nuevo registro es más reciente
        UPDATE c
        SET peso = p_new.peso_kg
        FROM Cliente c
        INNER JOIN (
            SELECT
                i.cedula_cliente,
                i.peso_kg,
                i.fecha,
                ROW_NUMBER() OVER (
                    PARTITION BY i.cedula_cliente
                    ORDER BY i.fecha DESC, i.id_progreso DESC
                ) as rn
            FROM inserted i
            WHERE i.peso_kg IS NOT NULL
        ) p_new ON c.cedula_cliente = p_new.cedula_cliente
        WHERE p_new.rn = 1
        AND p_new.fecha >= (
            SELECT ISNULL(MAX(fecha), '1900-01-01')
            FROM Progreso p2
            WHERE p2.cedula_cliente = p_new.cedula_cliente
            AND p2.peso_kg IS NOT NULL
            AND p2.id_progreso NOT IN (SELECT id_progreso FROM inserted)
        );

    END TRY
    BEGIN CATCH
        PRINT 'Error actualizando peso cliente: ' + ERROR_MESSAGE();
    END CATCH
END;