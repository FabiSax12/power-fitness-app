CREATE PROCEDURE sp_Login
    @email VARCHAR(255),
    @password VARCHAR(255)
AS
BEGIN
    SELECT
        p.*,
        CASE
            WHEN c.cedula_cliente IS NOT NULL THEN 'cliente'
            WHEN e.cedula_entrenador IS NOT NULL THEN 'entrenador'
            WHEN a.cedula_administrativo IS NOT NULL THEN 'administrativo'
            ELSE NULL
        END as tipo_usuario,
        c.cedula_cliente,
        e.cedula_entrenador,
        a.cedula_administrativo
    FROM Persona p
    LEFT JOIN Cliente c ON p.cedula = c.cedula_cliente
    LEFT JOIN Entrenador e ON p.cedula = e.cedula_entrenador
    LEFT JOIN Administrativo a ON p.cedula = a.cedula_administrativo
    WHERE p.correo = @email
    AND p.contraseña = @password
END