-- Administradores
INSERT INTO Persona (cedula, nombre, apellido1, apellido2, genero, contraseña, correo, fecha_nacimiento) VALUES
('2-0055-9851', 'Johan', 'Villegas', 'Villegas', 2, 'admin123456', 'johan.villegas@gym.cr', '1985-03-15'),
('2-2332-2325', 'Carlos Alberto', 'Mendez', 'Vargas', 1, 'admin789012', 'carlos.mendez@gym.cr', '1982-07-22'),
('3-8933-0303', 'Ana Patricia', 'Solís', 'Jiménez', 2, 'admin345678', 'ana.solis@gym.cr', '1990-11-08');

select * from Persona p join Cliente c on p.cedula = c.cedula_cliente
select * from Cliente

select * from Persona p join Entrenador e on p.cedula = e.cedula_entrenador
select * from Entrenador

select * from Persona

INSERT INTO Administrativo (cedula_administrativo, id_cargo) VALUES
('1-1111-1111', 1),
('2-2222-2222', 3),
('3-3333-3333', 2);

-- Permisos de Administrativos
INSERT INTO Administrativo_Permiso (id_administrativo, id_permiso) VALUES
('1-1111-1111', 7),
('2-2222-2222', 3), ('2-2222-2222', 4),
('3-3333-3333', 1), ('3-3333-3333', 2);

select TP.cedula_persona as Cédula,T.numero_telefono as Número
from Telefono T join dbo.Telefono_Persona TP on T.id_telefono = TP.id_telefono
order by numero_telefono
EXEC dbo.sp_InsertarAdministrativo
  @cedula           = '8-2345-0678',
  @nombre           = 'Andres',
  @apellido1        = 'Ochoa',
  @apellido2        = N'Gómez',
  @genero_nombre    = 'Masculino',
  @contrasena       = 'MiPass#123',
  @correo           = 'anocho90@gmail.com',
  @fecha_nacimiento = '1990-05-10',
  @telefonos = '',
  @permisos = '',
  @cargo            = 'Supervisor';

