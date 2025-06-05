-- =====================================================
-- PERSONAS Y USUARIOS
-- =====================================================

-- Teléfonos
INSERT INTO Telefono (numero_telefono) VALUES
('88887777'),
('66665555'),
('77778888'),
('99991111'),
('22223333'),
('44445555'),
('11112222'),
('33334444'),
('55556666'),
('87654321'),
('12345678'),
('98765432'),
('11223344'),
('55667788'),
('99887766');

-- Personas (Administradores, Entrenadores y Clientes)
INSERT INTO Persona (cedula, nombre, apellido1, apellido2, genero, contraseña, correo, fecha_nacimiento) VALUES
-- Administradores
('1-1111-1111', 'María José', 'González', 'Rodríguez', 2, 'admin123456', 'maria.gonzalez@gym.cr', '1985-03-15'),
('2-2222-2222', 'Carlos Alberto', 'Mendez', 'Vargas', 1, 'admin789012', 'carlos.mendez@gym.cr', '1982-07-22'),
('3-3333-3333', 'Ana Patricia', 'Solís', 'Jiménez', 2, 'admin345678', 'ana.solis@gym.cr', '1990-11-08'),

-- Entrenadores
('1-2345-6789', 'Luis Fernando', 'Pérez', 'Mora', 1, 'trainer123', 'luis.perez@gym.cr', '1988-05-12'),
('2-3456-7890', 'Sofía Elena', 'Ramírez', 'Castro', 2, 'trainer456', 'sofia.ramirez@gym.cr', '1992-09-03'),
('3-4567-8901', 'Miguel Ángel', 'Torres', 'Hernández', 1, 'trainer789', 'miguel.torres@gym.cr', '1985-12-20'),
('4-5678-9012', 'Gabriela María', 'Vargas', 'Quesada', 2, 'trainer012', 'gabriela.vargas@gym.cr', '1991-04-18'),
('5-6789-0123', 'Roberto Carlos', 'Madrigal', 'Alfaro', 1, 'trainer345', 'roberto.madrigal@gym.cr', '1987-08-25'),

-- Clientes
('1-1234-5678', 'José Manuel', 'Rodríguez', 'López', 1, 'cliente123', 'jose.rodriguez@email.com', '1995-02-14'),
('2-2345-6789', 'Laura Beatriz', 'Fernández', 'Morales', 2, 'cliente456', 'laura.fernandez@email.com', '1993-06-30'),
('3-3456-7890', 'Diego Alejandro', 'Martínez', 'Ruiz', 1, 'cliente789', 'diego.martinez@email.com', '1989-10-17'),
('4-4567-8901', 'Carmen Lucía', 'Vega', 'Montero', 2, 'cliente012', 'carmen.vega@email.com', '1996-01-25'),
('5-5678-9012', 'Andrés Felipe', 'Calderón', 'Sandoval', 1, 'cliente345', 'andres.calderon@email.com', '1992-07-08'),
('6-6789-0123', 'Melissa Andrea', 'Rojas', 'Céspedes', 2, 'cliente678', 'melissa.rojas@email.com', '1994-03-12'),
('7-7890-1234', 'Fernando José', 'Aguilar', 'Navarro', 1, 'cliente901', 'fernando.aguilar@email.com', '1990-09-05'),
('8-8901-2345', 'Valeria Stephanie', 'Campos', 'Villalobos', 2, 'cliente234', 'valeria.campos@email.com', '1997-11-22'),
('9-9012-3456', 'Ricardo David', 'Mora', 'Gómez', 1, 'cliente567', 'ricardo.mora@email.com', '1991-05-14'),
('1-0123-4567', 'Paola Andrea', 'Chacón', 'Brenes', 2, 'cliente890', 'paola.chacon@email.com', '1995-08-19');

-- Asociar teléfonos con personas
INSERT INTO Telefono_Persona (id_telefono, cedula_persona) VALUES
(1, '1-1111-1111'), (2, '2-2222-2222'), (3, '3-3333-3333'),
(4, '1-2345-6789'), (5, '2-3456-7890'), (6, '3-4567-8901'),
(7, '4-5678-9012'), (8, '5-6789-0123'), (9, '1-1234-5678'),
(10, '2-2345-6789'), (11, '3-3456-7890'), (12, '4-4567-8901'),
(13, '5-5678-9012'), (14, '6-6789-0123'), (15, '7-7890-1234');