-- =====================================================
-- PERSONAS (Clientes)
-- =====================================================

EXEC sp_InsertarCliente
    @cedula = '1-0234-0567',
    @nombre = 'María José',
    @apellido1 = 'González',
    @apellido2 = 'Rodríguez',
    @genero_nombre = 'Femenino',
    @contrasena = 'MariGonz2024!',
    @correo = 'maria.gonzalez@gmail.com',
    @fecha_nacimiento = '1995-03-15',
    @telefonos = '88234567,22451234',
    @nivel_fitness = 'Principiante',
    @peso = 62.5;

EXEC sp_InsertarCliente
    @cedula = '2-0456-0789',
    @nombre = 'Ana Sofía',
    @apellido1 = 'Morales',
    @apellido2 = 'Jiménez',
    @genero_nombre = 'Femenino',
    @contrasena = 'AnaSofia123',
    @correo = 'ana.morales@hotmail.com',
    @fecha_nacimiento = '1988-07-22',
    @telefonos = '87654321,25678901',
    @nivel_fitness = 'Intermedio',
    @peso = 58.0;

EXEC sp_InsertarCliente
    @cedula = '1-0567-0890',
    @nombre = 'Carmen Elena',
    @apellido1 = 'Vargas',
    @apellido2 = 'Solano',
    @genero_nombre = 'Femenino',
    @contrasena = 'Carmen2023#',
    @correo = 'carmen.vargas@yahoo.com',
    @fecha_nacimiento = '1992-11-08',
    @telefonos = '89123456',
    @nivel_fitness = 'Avanzado',
    @peso = 65.2;

EXEC sp_InsertarCliente
    @cedula = '3-0234-0567',
    @nombre = 'Gabriela',
    @apellido1 = 'Hernández',
    @apellido2 = 'Castro',
    @genero_nombre = 'Femenino',
    @contrasena = 'GabiHern456',
    @correo = 'gaby.hernandez@outlook.com',
    @fecha_nacimiento = '1985-02-14',
    @telefonos = '86789012,22334455',
    @nivel_fitness = 'Intermedio',
    @peso = 70.8;

EXEC sp_InsertarCliente
    @cedula = '1-0678-0901',
    @nombre = 'Daniela',
    @apellido1 = 'Quesada',
    @apellido2 = 'Mendoza',
    @genero_nombre = 'Femenino',
    @contrasena = 'Dani2024*',
    @correo = 'daniela.quesada@gmail.com',
    @fecha_nacimiento = '1996-09-30',
    @telefonos = '85456789',
    @nivel_fitness = 'Principiante',
    @peso = 55.5;

EXEC sp_InsertarCliente
    @cedula = '1-0789-0123',
    @nombre = 'Carlos Alberto',
    @apellido1 = 'Ramírez',
    @apellido2 = 'Vega',
    @genero_nombre = 'Masculino',
    @contrasena = 'CarlosR789',
    @correo = 'carlos.ramirez@gmail.com',
    @fecha_nacimiento = '1990-06-12',
    @telefonos = '88901234,22567890',
    @nivel_fitness = 'Avanzado',
    @peso = 82.3;

EXEC sp_InsertarCliente
    @cedula = '2-0890-0234',
    @nombre = 'José Manuel',
    @apellido1 = 'Pérez',
    @apellido2 = 'Sánchez',
    @genero_nombre = 'Masculino',
    @contrasena = 'JoseManuel01',
    @correo = 'jm.perez@hotmail.com',
    @fecha_nacimiento = '1987-12-05',
    @telefonos = '87012345',
    @nivel_fitness = 'Intermedio',
    @peso = 78.9;

EXEC sp_InsertarCliente
    @cedula = '1-0901-0345',
    @nombre = 'Diego',
    @apellido1 = 'Fernández',
    @apellido2 = 'López',
    @genero_nombre = 'Masculino',
    @contrasena = 'Diego2023!',
    @correo = 'diego.fernandez@yahoo.com',
    @fecha_nacimiento = '1993-04-18',
    @telefonos = '84567890,25123456',
    @nivel_fitness = 'Principiante',
    @peso = 75.4;

EXEC sp_InsertarCliente
    @cedula = '3-0456-0678',
    @nombre = 'Alejandro',
    @apellido1 = 'Chaves',
    @apellido2 = 'Arguedas',
    @genero_nombre = 'Masculino',
    @contrasena = 'AleChaves456',
    @correo = 'alex.chaves@outlook.com',
    @fecha_nacimiento = '1989-08-27',
    @telefonos = '83678901',
    @nivel_fitness = 'Avanzado',
    @peso = 85.7;

EXEC sp_InsertarCliente
    @cedula = '1-0567-0789',
    @nombre = 'Roberto',
    @apellido1 = 'Solís',
    @apellido2 = 'Madrigal',
    @genero_nombre = 'Masculino',
    @contrasena = 'RobertoS789',
    @correo = 'roberto.solis@gmail.com',
    @fecha_nacimiento = '1984-01-11',
    @telefonos = '82789012,22678901',
    @nivel_fitness = 'Intermedio',
    @peso = 90.2;

EXEC sp_InsertarCliente
    @cedula = '2-0123-0456',
    @nombre = 'Lucía',
    @apellido1 = 'Montero',
    @apellido2 = 'Aguilar',
    @genero_nombre = 'Femenino',
    @contrasena = 'Lucia2024#',
    @correo = 'lucia.montero@gmail.com',
    @fecha_nacimiento = '2000-05-20',
    @telefonos = '89456123',
    @nivel_fitness = 'Principiante',
    @peso = 52.8;

EXEC sp_InsertarCliente
    @cedula = '1-0345-0678',
    @nombre = 'Fernando',
    @apellido1 = 'Arias',
    @apellido2 = 'Benavides',
    @genero_nombre = 'Masculino',
    @contrasena = 'Fernando123',
    @correo = 'fernando.arias@hotmail.com',
    @fecha_nacimiento = '1975-10-15',
    @telefonos = '81234567,22890123',
    @nivel_fitness = 'Intermedio',
    @peso = 88.5;

EXEC sp_InsertarCliente
    @cedula = '3-0789-0123',
    @nombre = 'Paola',
    @apellido1 = 'Vindas',
    @apellido2 = 'Carrillo',
    @genero_nombre = 'Femenino',
    @contrasena = 'PaolaV2024*',
    @correo = 'paola.vindas@yahoo.com',
    @fecha_nacimiento = '1991-07-03',
    @telefonos = '86123789',
    @nivel_fitness = 'Avanzado',
    @peso = 68.3;

EXEC sp_InsertarCliente
    @cedula = '2-0345-0789',
    @nombre = 'Andrés',
    @apellido1 = 'Rojas',
    @apellido2 = 'Valverde',
    @genero_nombre = 'Masculino',
    @contrasena = 'AndresR456',
    @correo = 'andres.rojas@outlook.com',
    @fecha_nacimiento = '1986-12-28',
    @telefonos = '87456321,22345678,61123456',
    @nivel_fitness = 'Intermedio',
    @peso = 76.9;

EXEC sp_InsertarCliente
    @cedula = '1-0678-0234',
    @nombre = 'Melissa',
    @apellido1 = 'Cordero',
    @apellido2 = 'Elizondo',
    @genero_nombre = 'Femenino',
    @contrasena = 'MelissaC789',
    @correo = 'melissa.cordero@gmail.com',
    @fecha_nacimiento = '1994-03-12',
    @nivel_fitness = 'Principiante',
    @peso = 60.7;

EXEC sp_InsertarCliente
    @cedula = '3-0123-0567',
    @nombre = 'Esteban',
    @apellido1 = 'Mora',
    @apellido2 = 'Cascante',
    @genero_nombre = 'Masculino',
    @contrasena = 'EstebanM123',
    @correo = 'esteban.mora@hotmail.com',
    @fecha_nacimiento = '1982-09-07',
    @telefonos = '85678234',
    @nivel_fitness = 'Principiante',
    @peso = 95.4;

EXEC sp_InsertarCliente
    @cedula = '2-0567-0123',
    @nombre = 'Valeria',
    @apellido1 = 'Núñez',
    @apellido2 = 'Barboza',
    @genero_nombre = 'Femenino',
    @contrasena = 'ValeriaN456',
    @correo = 'valeria.nunez@yahoo.com',
    @fecha_nacimiento = '1998-11-25',
    @telefonos = '84321098,22567123',
    @nivel_fitness = 'Avanzado',
    @peso = 57.2;

EXEC sp_InsertarCliente
    @cedula = '1-0234-0890',
    @nombre = 'Mauricio',
    @apellido1 = 'Espinoza',
    @apellido2 = 'Trejos',
    @genero_nombre = 'Masculino',
    @contrasena = 'MauricioE789',
    @correo = 'mauricio.espinoza@outlook.com',
    @fecha_nacimiento = '1978-06-14',
    @telefonos = '83456789',
    @nivel_fitness = 'Avanzado',
    @peso = 87.1;

EXEC sp_InsertarCliente
    @cedula = '3-0678-0234',
    @nombre = 'Karina',
    @apellido1 = 'Villalobos',
    @apellido2 = 'Alfaro',
    @genero_nombre = 'Femenino',
    @contrasena = 'KarinaV123',
    @correo = 'karina.villalobos@gmail.com',
    @fecha_nacimiento = '1997-02-09',
    @telefonos = '82567890,25890123',
    @nivel_fitness = 'Intermedio',
    @peso = 48.5;

EXEC sp_InsertarCliente
    @cedula = '2-0890-0567',
    @nombre = 'Rodrigo',
    @apellido1 = 'Calderón',
    @apellido2 = 'Salas',
    @genero_nombre = 'Masculino',
    @contrasena = 'RodrigoC456',
    @correo = 'rodrigo.calderon@hotmail.com',
    @fecha_nacimiento = '1990-08-16',
    @telefonos = '81890567',
    @nivel_fitness = 'Intermedio',
    @peso = 80.6;

-- Condiciones Médicas
INSERT INTO Cliente_Condicion_Medica (cedula_cliente, id_condicion_medica) VALUES
('1-0234-0567', 4),
('2-0456-0789', 5),
('3-0456-0678', 1),
('1-0678-0234', 6),
('2-0890-0567', 7);