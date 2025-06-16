-- =====================================================
-- PERSONAS (Clientes)
-- =====================================================
select * from Cliente
truncate table Persona
DELETE FROM Persona
WHERE EXISTS (
    SELECT 1 FROM Cliente c WHERE c.cedula_cliente = Persona.cedula
    UNION ALL
    SELECT 1 FROM Entrenador e WHERE e.cedula_entrenador = Persona.cedula
);

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
    @nombre = 'Fabián',
    @apellido1 = 'Vargas',
    @apellido2 = 'Araya',
    @genero_nombre = 'Masculino',
    @contrasena = 'GymPW12*',
    @correo = 'f.vargas.1@estudiantec.cr',
    @fecha_nacimiento = '2005-02-12',
    @telefonos = '85160370,24742757',
    @nivel_fitness = 'Intermedio',
    @peso = 69.0;

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

--Nuevos Registros
EXEC sp_InsertarCliente
    @cedula = '1-1122-3344',
    @nombre = 'Sofía',
    @apellido1 = 'Hernández',
    @apellido2 = 'Porras',
    @genero_nombre = 'Femenino',
    @contrasena = 'SofiaH2025!',
    @correo = 'sofia.hernandez@gmail.com',
    @fecha_nacimiento = '1999-04-10',
    @telefonos = '81901234',
    @nivel_fitness = 'Intermedio',
    @peso = 58.3;

EXEC sp_InsertarCliente
    @cedula = '2-2233-4455',
    @nombre = 'Valentina',
    @apellido1 = 'Ramírez',
    @apellido2 = 'Salazar',
    @genero_nombre = 'Femenino',
    @contrasena = 'ValenR2025#',
    @correo = 'valentina.ramirez@hotmail.com',
    @fecha_nacimiento = '2001-07-24',
    @telefonos = '72345678,81911234',
    @nivel_fitness = 'Principiante',
    @peso = 54.6;

EXEC sp_InsertarCliente
    @cedula = '3-3344-5566',
    @nombre = 'Diego Alejandro',
    @apellido1 = 'Castillo',
    @apellido2 = 'Montoya',
    @genero_nombre = 'Masculino',
    @contrasena = 'DiegoA789!',
    @correo = 'diego.castillo@yahoo.com',
    @fecha_nacimiento = '1994-09-15',
    @telefonos = '82345678',
    @nivel_fitness = 'Avanzado',
    @peso = 77.8;

EXEC sp_InsertarCliente
    @cedula = '4-4455-6677',
    @nombre = 'Andrea',
    @apellido1 = 'Castro',
    @apellido2 = 'López',
    @genero_nombre = 'Femenino',
    @contrasena = 'AndCast123#',
    @correo = 'andrea.castro@gmail.com',
    @fecha_nacimiento = '1998-11-30',
    @telefonos = '83345678,72355679',
    @nivel_fitness = 'Intermedio',
    @peso = 62.1;

EXEC sp_InsertarCliente
    @cedula = '5-5566-7788',
    @nombre = 'Luis Miguel',
    @apellido1 = 'Fernández',
    @apellido2 = 'Mora',
    @genero_nombre = 'Masculino',
    @contrasena = 'LuisF2025*',
    @correo = 'l.miguel.fernandez@yahoo.com',
    @fecha_nacimiento = '1990-02-20',
    @telefonos = '84345678',
    @nivel_fitness = 'Avanzado',
    @peso = 83.4;

EXEC sp_InsertarCliente
    @cedula = '6-6677-8899',
    @nombre = 'Victoria',
    @apellido1 = 'Salas',
    @apellido2 = 'Gutiérrez',
    @genero_nombre = 'Femenino',
    @contrasena = 'VictoriaS890!',
    @correo = 'victoria.salas@outlook.com',
    @fecha_nacimiento = '1995-05-05',
    @telefonos = '75345678,81921234',
    @nivel_fitness = 'Intermedio',
    @peso = 59.0;

EXEC sp_InsertarCliente
    @cedula = '7-7788-9900',
    @nombre = 'Pablo',
    @apellido1 = 'Rodríguez',
    @apellido2 = 'Castro',
    @genero_nombre = 'Masculino',
    @contrasena = 'PabloR777#',
    @correo = 'pablo.rodriguez@gmail.com',
    @fecha_nacimiento = '1985-08-12',
    @telefonos = '76345678',
    @nivel_fitness = 'Intermedio',
    @peso = 79.5;

EXEC sp_InsertarCliente
    @cedula = '1-8899-0011',
    @nombre = 'Gabriela',
    @apellido1 = 'Valverde',
    @apellido2 = 'Ortiz',
    @genero_nombre = 'Femenino',
    @contrasena = 'GabyV001!',
    @correo = 'gabriela.valverde@hotmail.com',
    @fecha_nacimiento = '2003-01-01',
    @telefonos = '77345678,81931234',
    @nivel_fitness = 'Principiante',
    @peso = 50.2;

EXEC sp_InsertarCliente
    @cedula = '2-9900-1122',
    @nombre = 'Jorge',
    @apellido1 = 'Jiménez',
    @apellido2 = 'Herrera',
    @genero_nombre = 'Masculino',
    @contrasena = 'JorgeJ998#',
    @correo = 'jorge.jimenez@yahoo.com',
    @fecha_nacimiento = '1978-12-22',
    @telefonos = '78345678',
    @nivel_fitness = 'Avanzado',
    @peso = 88.9;

EXEC sp_InsertarCliente
    @cedula = '3-1010-1212',
    @nombre = 'Camila',
    @apellido1 = 'Chavarría',
    @apellido2 = 'Villalobos',
    @genero_nombre = 'Femenino',
    @contrasena = 'CamiC2025!',
    @correo = 'camila.chavarria@gmail.com',
    @fecha_nacimiento = '2002-06-14',
    @telefonos = '79345678,72365678',
    @nivel_fitness = 'Principiante',
    @peso = 55.3;

EXEC sp_InsertarCliente
    @cedula = '4-2121-2323',
    @nombre = 'Martín',
    @apellido1 = 'Castro',
    @apellido2 = 'Porras',
    @genero_nombre = 'Masculino',
    @contrasena = 'MartinC212!',
    @correo = 'martin.castro@outlook.com',
    @fecha_nacimiento = '1988-10-10',
    @telefonos = '80345678',
    @nivel_fitness = 'Intermedio',
    @peso = 75.2;

EXEC sp_InsertarCliente
    @cedula = '5-3232-3434',
    @nombre = 'Paula',
    @apellido1 = 'Campos',
    @apellido2 = 'Navarro',
    @genero_nombre = 'Femenino',
    @contrasena = 'PaulaC323#',
    @correo = 'paula.campos@hotmail.com',
    @fecha_nacimiento = '1996-03-03',
    @telefonos = '81345678,72375678',
    @nivel_fitness = 'Intermedio',
    @peso = 64.0;

EXEC sp_InsertarCliente
    @cedula = '6-4343-4545',
    @nombre = 'Fernando',
    @apellido1 = 'Alfaro',
    @apellido2 = 'Solano',
    @genero_nombre = 'Masculino',
    @contrasena = 'FernandoA434!',
    @correo = 'fernando.alfaro@yahoo.com',
    @fecha_nacimiento = '1992-11-11',
    @telefonos = '82355678',
    @nivel_fitness = 'Avanzado',
    @peso = 85.6;

EXEC sp_InsertarCliente
    @cedula = '7-5454-5656',
    @nombre = 'Lorena',
    @apellido1 = 'Pacheco',
    @apellido2 = 'Arroyo',
    @genero_nombre = 'Femenino',
    @contrasena = 'LorenaP545#',
    @correo = 'lorena.pacheco@gmail.com',
    @fecha_nacimiento = '1984-09-09',
    @telefonos = '83355678,81941234',
    @nivel_fitness = 'Principiante',
    @peso = 58.7;

EXEC sp_InsertarCliente
    @cedula = '1-6565-6767',
    @nombre = 'Oscar',
    @apellido1 = 'Naranjo',
    @apellido2 = 'Peralta',
    @genero_nombre = 'Masculino',
    @contrasena = 'OscarN656*',
    @correo = 'oscar.naranjo@outlook.com',
    @fecha_nacimiento = '1979-04-04',
    @telefonos = '84355678',
    @nivel_fitness = 'Intermedio',
    @peso = 81.2;

EXEC sp_InsertarCliente
    @cedula = '2-7676-7878',
    @nombre = 'Isabella',
    @apellido1 = 'Vega',
    @apellido2 = 'Serrano',
    @genero_nombre = 'Femenino',
    @contrasena = 'IsaV2025*',
    @correo = 'isabella.vega@gmail.com',
    @fecha_nacimiento = '2004-02-28',
    @telefonos = '75355678',
    @nivel_fitness = 'Principiante',
    @peso = 53.1;

EXEC sp_InsertarCliente
    @cedula = '3-8787-8989',
    @nombre = 'Ricardo',
    @apellido1 = 'Arias',
    @apellido2 = 'Delgado',
    @genero_nombre = 'Masculino',
    @contrasena = 'RicardA878!',
    @correo = 'ricardo.arias@hotmail.com',
    @fecha_nacimiento = '1986-06-16',
    @telefonos = '76355678,72385678',
    @nivel_fitness = 'Intermedio',
    @peso = 77.0;

EXEC sp_InsertarCliente
    @cedula = '4-9898-9090',
    @nombre = 'Laura Isabel',
    @apellido1 = 'Morales',
    @apellido2 = 'Sánchez',
    @genero_nombre = 'Femenino',
    @contrasena = 'LauraI2025#',
    @correo = 'laura.isabel.morales@yahoo.com',
    @fecha_nacimiento = '1997-08-18',
    @telefonos = '77355678',
    @nivel_fitness = 'Intermedio',
    @peso = 63.4;

EXEC sp_InsertarCliente
    @cedula = '5-1020-3040',
    @nombre = 'Sebastián',
    @apellido1 = 'Rojas',
    @apellido2 = 'Gómez',
    @genero_nombre = 'Masculino',
    @contrasena = 'SebR1020*',
    @correo = 'sebastian.rojas@gmail.com',
    @fecha_nacimiento = '1991-01-05',
    @telefonos = '78355678',
    @nivel_fitness = 'Avanzado',
    @peso = 82.3;

EXEC sp_InsertarCliente
    @cedula = '6-2130-4050',
    @nombre = 'Camilo',
    @apellido1 = 'Espinoza',
    @apellido2 = 'Carranza',
    @genero_nombre = 'Masculino',
    @contrasena = 'CamiloE213!',
    @correo = 'camilo.espinoza@outlook.com',
    @fecha_nacimiento = '1993-12-30',
    @telefonos = '79355678,72395678',
    @nivel_fitness = 'Avanzado',
    @peso = 79.9;

EXEC sp_InsertarCliente
    @cedula = '7-3240-5060',
    @nombre = 'Valeria',
    @apellido1 = 'Blanco',
    @apellido2 = 'Salazar',
    @genero_nombre = 'Femenino',
    @contrasena = 'ValB324#',
    @correo = 'valeria.blanco@hotmail.com',
    @fecha_nacimiento = '1999-05-25',
    @telefonos = '80355678',
    @nivel_fitness = 'Principiante',
    @peso = 56.8;

EXEC sp_InsertarCliente
    @cedula = '1-4350-6070',
    @nombre = 'Javier',
    @apellido1 = 'Alfaro',
    @apellido2 = 'Chacón',
    @genero_nombre = 'Masculino',
    @contrasena = 'JaviA435!',
    @correo = 'javier.alfaro@yahoo.com',
    @fecha_nacimiento = '1982-02-14',
    @telefonos = '81355678',
    @nivel_fitness = 'Intermedio',
    @peso = 87.5;

EXEC sp_InsertarCliente
    @cedula = '2-5460-7080',
    @nombre = 'Patricia',
    @apellido1 = 'Castro',
    @apellido2 = 'Rojas',
    @genero_nombre = 'Femenino',
    @contrasena = 'PatC546*',
    @correo = 'patricia.castro@gmail.com',
    @fecha_nacimiento = '1995-07-07',
    @telefonos = '82365678,72405678',
    @nivel_fitness = 'Avanzado',
    @peso = 62.9;

EXEC sp_InsertarCliente
    @cedula = '3-6570-8090',
    @nombre = 'Marco Fernando',
    @apellido1 = 'Fuentes',
    @apellido2 = 'Montero',
    @genero_nombre = 'Masculino',
    @contrasena = 'MarcoF657#',
    @correo = 'marco.fernando.fuentes@outlook.com',
    @fecha_nacimiento = '1990-11-11',
    @telefonos = '83365678',
    @nivel_fitness = 'Avanzado',
    @peso = 80.1;

EXEC sp_InsertarCliente
    @cedula = '4-7680-9010',
    @nombre = 'Juliana',
    @apellido1 = 'Hidalgo',
    @apellido2 = 'Barquero',
    @genero_nombre = 'Femenino',
    @contrasena = 'JuliH768!',
    @correo = 'juliana.hidalgo@hotmail.com',
    @fecha_nacimiento = '2000-09-09',
    @telefonos = '84365678',
    @nivel_fitness = 'Intermedio',
    @peso = 60.3;

EXEC sp_InsertarCliente
    @cedula = '5-8790-0123',
    @nombre = 'Manuel',
    @apellido1 = 'Torres',
    @apellido2 = 'Salinas',
    @genero_nombre = 'Masculino',
    @contrasena = 'ManuelT879*',
    @correo = 'manuel.torres@gmail.com',
    @fecha_nacimiento = '1996-03-17',
    @telefonos = '85365678,72415678',
    @nivel_fitness = 'Intermedio',
    @peso = 78.4;

EXEC sp_InsertarCliente
    @cedula = '6-9801-1234',
    @nombre = 'Natalia Sofía',
    @apellido1 = 'Porras',
    @apellido2 = 'Alvarado',
    @genero_nombre = 'Femenino',
    @contrasena = 'NatS980#',
    @correo = 'natalia.sofiaporras@yahoo.com',
    @fecha_nacimiento = '1998-10-01',
    @telefonos = '86365678',
    @nivel_fitness = 'Principiante',
    @peso = 55.0;

EXEC sp_InsertarCliente
    @cedula = '7-0912-2345',
    @nombre = 'Esteban',
    @apellido1 = 'Vega',
    @apellido2 = 'Carmona',
    @genero_nombre = 'Masculino',
    @contrasena = 'EstebanV091!',
    @correo = 'esteban.vega@outlook.com',
    @fecha_nacimiento = '1984-05-05',
    @telefonos = '87365678',
    @nivel_fitness = 'Intermedio',
    @peso = 88.2;

EXEC sp_InsertarCliente
    @cedula = '1-1923-3456',
    @nombre = 'Carolina',
    @apellido1 = 'Sánchez',
    @apellido2 = 'Cordero',
    @genero_nombre = 'Femenino',
    @contrasena = 'CarS1923*',
    @correo = 'carolina.sanchez@gmail.com',
    @fecha_nacimiento = '2001-08-08',
    @telefonos = '88365678',
    @nivel_fitness = 'Principiante',
    @peso = 59.6;

EXEC sp_InsertarCliente
    @cedula = '2-2934-4567',
    @nombre = 'Rodrigo',
    @apellido1 = 'Vargas',
    @apellido2 = 'Herrera',
    @genero_nombre = 'Masculino',
    @contrasena = 'RodV2934!',
    @correo = 'rodrigo.vargas@hotmail.com',
    @fecha_nacimiento = '1993-07-07',
    @telefonos = '89365678',
    @nivel_fitness = 'Avanzado',
    @peso = 81.7;

EXEC sp_InsertarCliente
    @cedula = '2-2934-9999',
    @nombre = '',
    @apellido1 = 'Vargas',
    @apellido2 = 'Herrera',
    @genero_nombre = 'Masculino',
    @contrasena = 'RodV2934!',
    @correo = '.vargas@hotmail.com',
    @fecha_nacimiento = '1993-07-07',
    @nivel_fitness = 'Avanzado',
    @peso = 81.7;

select * from Cliente order by peso
select * from Condicion_Medica
-- Condiciones Médicas
INSERT INTO Cliente_Condicion_Medica (cedula_cliente, id_condicion_medica) VALUES
('1-0234-0567', 4),
('2-0456-0789', 5),
('3-0456-0678', 1),
('1-0678-0234', 6),
('2-0890-0567', 7),
('1-8899-0011', 4),
('2-0123-0456', 6),
('2-7676-7878', 7),
('2-2233-4455', 4),
('6-9801-1234', 8),
('3-1010-1212', 1),
('1-0678-0901', 2),
('7-3240-5060', 2),
('2-0567-0123', 2),
('3-0678-0234', 5),
('2-0456-0789', 3),
('1-1122-3344', 8),
('7-5454-5656', 2),
('6-6677-8899', 2),
('1-1923-3456', 7),
('4-7680-9010', 5),
('1-0678-0234', 7),
('4-4455-6677', 6);
