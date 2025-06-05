-- =====================================================
-- RUTINAS DETALLADAS
-- =====================================================

-- Días de Rutina (Qué días entrena cada rutina)
INSERT INTO Dia_Rutina (id_rutina, id_dia) VALUES
-- Rutina 1 (José - Fuerza) - Lunes, Miércoles, Viernes
(1, 1), (1, 3), (1, 5),

-- Rutina 2 (Laura - Cardio) - Martes, Jueves, Sábado
(2, 2), (2, 4), (2, 6),

-- Rutina 3 (Diego - Funcional) - Lunes a Sábado
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),

-- Ejercicios por Rutina
INSERT INTO Ejercicio_Rutina (id_ejercicio, id_rutina, repeticiones, tiempo_descanso) VALUES
-- Rutina 1 (José - Fuerza)
(1, 1, 8, '00:02:00'),   -- Press de Banca
(3, 1, 5, '00:03:00'),   -- Peso Muerto
(2, 1, 10, '00:02:00'),  -- Sentadillas
(5, 1, 8, '00:02:00'),   -- Press Militar
(8, 1, 10, '00:01:30'),  -- Remo con Barra

-- Rutina 2 (Laura - Cardio)
(14, 2, 1, '00:01:00'),  -- Caminata en Cinta
(15, 2, 1, '00:01:00'),  -- Bicicleta Estática
(11, 2, 15, '00:00:30'), -- Burpees
(10, 2, 1, '00:00:30'),  -- Plancha

-- Rutina 3 (Diego - Funcional)
(11, 3, 20, '00:00:45'), -- Burpees
(9, 3, 15, '00:01:00'),  -- Lunges
(12, 3, 20, '00:00:30'), -- Push-ups
(2, 3, 15, '00:01:30'),  -- Sentadillas
(10, 3, 1, '00:00:30');  -- Plancha