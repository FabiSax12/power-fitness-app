-- =====================================================
-- RUTINAS Y EJERCICIOS
-- =====================================================

-- Estados de Rutina
INSERT INTO Estado_Rutina (nombre) VALUES
('Activa'),
('Completada'),
('Pausada'),
('Cancelada');

-- Tipos de Rutina
INSERT INTO Tipo_Rutina (nombre) VALUES
('Fuerza'),
('Cardio'),
('Mixta'),
('Funcional'),
('Rehabilitación');

-- Días de la Semana
INSERT INTO Dia (dia) VALUES
('Lunes'),
('Martes'),
('Miércoles'),
('Jueves'),
('Viernes'),
('Sábado'),
('Domingo');

-- Dificultades de Ejercicios
INSERT INTO Dificultad (dificultad) VALUES
('Principiante'),
('Intermedio'),
('Avanzado'),
('Experto');

-- Grupos Musculares
INSERT INTO Grupo_Muscular (nombre_grupo) VALUES
('Pectorales'),
('Espalda'),
('Hombros'),
('Bíceps'),
('Tríceps'),
('Cuádriceps'),
('Isquiotibiales'),
('Glúteos'),
('Pantorrillas'),
('Abdominales'),
('Core'),
('Antebrazos');

-- Ejercicios
INSERT INTO Ejercicio (nombre, id_dificultad) VALUES
('Press de Banca', 2),
('Sentadillas', 1),
('Peso Muerto', 3),
('Dominadas', 3),
('Press Militar', 2),
('Curl de Bíceps', 1),
('Extensiones de Tríceps', 1),
('Remo con Barra', 2),
('Lunges', 1),
('Plancha', 1),
('Burpees', 3),
('Push-ups', 1),
('Hip Thrust', 2),
('Caminata en Cinta', 1),
('Bicicleta Estática', 1);

-- Relación Ejercicio-Grupo Muscular
INSERT INTO Ejercicio_Grupo_Muscular (id_ejercicio, id_grupo_muscular) VALUES
(1, 1), (1, 3), (1, 5),  -- Press de Banca
(2, 6), (2, 8),          -- Sentadillas
(3, 2), (3, 7), (3, 8),  -- Peso Muerto
(4, 2), (4, 4),          -- Dominadas
(5, 3),                  -- Press Militar
(6, 4),                  -- Curl de Bíceps
(7, 5),                  -- Extensiones de Tríceps
(8, 2), (8, 4),          -- Remo con Barra
(9, 6), (9, 8),          -- Lunges
(10, 10), (10, 11),      -- Plancha
(11, 1), (11, 6), (11, 10), -- Burpees
(12, 1), (12, 5),        -- Push-ups
(13, 8),                 -- Hip Thrust
(14, 9),                 -- Caminata en Cinta
(15, 6), (15, 9);        -- Bicicleta Estática