-- Administradores
INSERT INTO Persona (cedula, nombre, apellido1, apellido2, genero, contraseña, correo, fecha_nacimiento) VALUES
('1-1111-1111', 'Johan', 'Villegas', 'Villegas', 2, 'admin123456', 'johan.villegas@gym.cr', '1985-03-15'),
('2-2222-2222', 'Carlos Alberto', 'Mendez', 'Vargas', 1, 'admin789012', 'carlos.mendez@gym.cr', '1982-07-22'),
('3-3333-3333', 'Ana Patricia', 'Solís', 'Jiménez', 2, 'admin345678', 'ana.solis@gym.cr', '1990-11-08');

INSERT INTO Administrativo (cedula_administrativo, id_cargo) VALUES
('1-1111-1111', 1),
('2-2222-2222', 3),
('3-3333-3333', 2);

-- Permisos de Administrativos
INSERT INTO Administrativo_Permiso (id_administrativo, id_permiso) VALUES
('1-1111-1111', 7),
('2-2222-2222', 3), ('2-2222-2222', 4),
('3-3333-3333', 1), ('3-3333-3333', 2);