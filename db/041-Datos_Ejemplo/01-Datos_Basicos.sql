-- =====================================================
-- DATOS BÁSICOS - CATÁLOGOS
-- =====================================================

-- Géneros
INSERT INTO Genero (nombre) VALUES
('Masculino'),
('Femenino'),
('Otro');

-- Niveles de Fitness
INSERT INTO Nivel_Fitness (nivel) VALUES
('Principiante'),
('Intermedio'),
('Avanzado');

-- Cargos Administrativos
INSERT INTO Cargo (nombre, descripcion, salario) VALUES
('Gerente General', 'Responsable de la administración general del gimnasio', 850000.00),
('Recepcionista', 'Atención al cliente y manejo de membresías', 450000.00),
('Limpieza', 'Mantenimiento y limpieza de instalaciones', 350000.00);

-- Permisos del Sistema
INSERT INTO Permiso (permiso) VALUES
('Gestionar Usuarios'),
('Gestionar Membresías'),
('Gestionar Pagos'),
('Gestionar Reportes'),
('Gestionar Equipamiento'),
('Gestionar Clases'),
('Acceso Total');

-- Especialidades de Entrenadores
INSERT INTO Especialidad (nombre) VALUES
('Gimnasio'),
('CrossFit'),
('Jiujitsu'),
('Zumba');

-- Instituciones de Certificación
INSERT INTO Institucion (nombre) VALUES
('Universidad de Costa Rica'),
('Colegio de Profesionales en Ciencias del Deporte'),
('Instituto Nacional de Aprendizaje');

-- Certificaciones
INSERT INTO Certificacion (nombre, id_institucion, fecha_obtencion) VALUES
('Personal Trainer Certificado', 1, '2023-01-15'),
('Especialista en Fuerza y Acondicionamiento', 2, '2022-06-20'),
('Entrenador de CrossFit', 2, '2022-11-05'),
('Licenciatura en Ciencias del Deporte', 1, '2021-12-15');

-- Objetivos de Clientes
INSERT INTO Objetivo (descripcion) VALUES
('Pérdida de peso'),
('Ganancia de masa muscular'),
('Mejorar condición cardiovascular'),
('Tonificación corporal'),
('Preparación para competencias'),
('Rehabilitación física'),
('Mantenimiento físico general'),
('Aumento de flexibilidad'),
('Reducción de estrés'),
('Mejora de postura corporal');

-- Condiciones Médicas
INSERT INTO Condicion_Medica (nombre, descripcion) VALUES
('Hipertensión', 'Presión arterial elevada'),
('Diabetes Tipo 2', 'Resistencia a la insulina'),
('Artritis', 'Inflamación de articulaciones'),
('Asma', 'Dificultad respiratoria'),
('Lesión de Rodilla', 'Problemas en articulación de rodilla'),
('Hernias Discales', 'Problemas en discos intervertebrales'),
('Fibromialgia', 'Dolor muscular crónico'),
('Osteoporosis', 'Debilitamiento de huesos');