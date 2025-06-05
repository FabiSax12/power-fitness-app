--- Reglas y Tipos de datos ---

-- 1. Tipo para cédulas
CREATE RULE RCedula AS @cedula LIKE '[0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]' GO
CREATE TYPE TCedula FROM CHAR(11) GO
EXEC sp_bindrule 'RCedula', 'TCedula' GO

-- 2. Tipo para correos electrónicos
CREATE RULE RCorreo AS @correo LIKE '%_@_%._%' GO
CREATE TYPE TCorreo FROM VARCHAR(50) GO
EXEC sp_bindrule 'RCorreo', 'TCorreo' GO

-- 3. Tipo para teléfonos costarricenses (8 dígitos)
CREATE RULE RTelefono AS @telefono LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]' GO
CREATE TYPE TTelefono FROM CHAR(8) GO
EXEC sp_bindrule 'RTelefono', 'TTelefono' GO

-- 4. Tipo para peso corporal (rango válido)
CREATE RULE RPeso AS @peso >= 30.0 AND @peso <= 300.0 GO
CREATE TYPE TPeso FROM DECIMAL(5,2) GO
EXEC sp_bindrule 'RPeso', 'TPeso' GO

-- 5. Tipo para contraseñas (mínimo 8 caracteres)
CREATE RULE RContrasena AS LEN(@contrasena) >= 8 GO
CREATE TYPE TContrasena FROM VARCHAR(20) GO
EXEC sp_bindrule 'RContrasena', 'TContrasena' GO

-- 6. Tipo para montos
CREATE RULE RMonto AS @monto >= 0 GO
CREATE TYPE TMonto FROM DECIMAL(10,2) GO
EXEC sp_bindrule 'RMonto', 'TMonto' GO

-- 7. Tipo para frecuencia de entrenamiento
CREATE RULE RFrecuencia AS @frecuencia IN ('Diaria', 'Semanal', 'Mensual', 'Anual') GO
CREATE TYPE TFrecuencia FROM VARCHAR(20) GO
EXEC sp_bindrule 'RFrecuencia', 'TFrecuencia' GO

-- 8. Tipo para edad
CREATE RULE REdad AS @edad >= 15 AND @edad <= 100 GO
CREATE TYPE TEdad FROM TINYINT GO
EXEC sp_bindrule 'REdad', 'TEdad' GO

-- 9. Tipo para porcentajes
CREATE RULE RPorcentaje AS @porcentaje >= 0 AND @porcentaje <= 100 GO
CREATE TYPE TPorcentaje FROM DECIMAL(5,2) GO
EXEC sp_bindrule 'RPorcentaje', 'TPorcentaje' GO