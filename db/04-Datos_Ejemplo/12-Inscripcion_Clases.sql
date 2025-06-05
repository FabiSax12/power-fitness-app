-- =====================================================
-- CLASES GRUPALES
-- =====================================================

-- Clases Programadas
INSERT INTO Clase (cedula_entrenador, id_area_gimnasio, descripcion, fecha, hora_inicio, id_tipo_clase, nombre, duracion) VALUES
-- Clases de Sofía (Yoga/Pilates)
('2-3456-7890', 3, 'Clase de yoga para principiantes', '2024-12-16', '07:00:00', 2, 'Yoga Matutino', '01:00:00'),
('2-3456-7890', 3, 'Pilates para fortalecimiento del core', '2024-12-16', '18:00:00', 3, 'Pilates Core', '00:45:00'),
('2-3456-7890', 4, 'Sesión de relajación y estiramiento', '2024-12-17', '19:00:00', 8, 'Stretching Nocturno', '00:30:00'),

-- Clases de Miguel (CrossFit/Funcional)
('3-4567-8901', 7, 'Entrenamiento funcional intenso', '2024-12-16', '06:00:00', 6, 'CrossFit Morning', '01:00:00'),
('3-4567-8901', 7, 'WOD del día - fuerza y cardio', '2024-12-16', '17:00:00', 6, 'CrossFit Tarde', '01:00:00'),
('3-4567-8901', 5, 'Aqua fitness para resistencia', '2024-12-17', '08:00:00', 7, 'Aqua CrossFit', '00:45:00'),

-- Clases de Gabriela (Aeróbicos/Zumba)
('4-5678-9012', 3, 'Zumba para quemar calorías', '2024-12-16', '08:00:00', 5, 'Zumba Fitness', '00:45:00'),
('4-5678-9012', 4, 'Aeróbicos de alto impacto', '2024-12-16', '16:00:00', 1, 'Aeróbicos Intensos', '00:50:00'),
('4-5678-9012', 2, 'Spinning cardiovascular', '2024-12-17', '07:00:00', 4, 'Spinning Matinal', '00:45:00'),

-- Clases de Luis (Fuerza)
('1-2345-6789', 1, 'Técnicas de levantamiento', '2024-12-16', '15:00:00', 6, 'Powerlifting Básico', '01:30:00'),
('1-2345-6789', 1, 'Entrenamiento de fuerza funcional', '2024-12-17', '16:00:00', 6, 'Fuerza Funcional', '01:00:00'),

-- Clases de Roberto (Boxeo/Fuerza)
('5-6789-0123', 7, 'Boxeo para principiantes', '2024-12-16', '19:00:00', 6, 'Boxeo Fitness', '01:00:00'),
('5-6789-0123', 7, 'Combinación boxeo y fuerza', '2024-12-17', '18:00:00', 6, 'Box & Strength', '01:15:00');

-- Inscripciones a Clases
INSERT INTO Inscripcion_Clase (id_clase, id_cliente) VALUES
-- Yoga Matutino (Clase 1)
(1, '2-2345-6789'), (1, '4-4567-8901'), (1, '8-8901-2345'), (1, '1-0123-4567'),

-- Pilates Core (Clase 2)
(2, '6-6789-0123'), (2, '8-8901-2345'), (2, '1-0123-4567'),

-- Stretching Nocturno (Clase 3)
(3, '8-8901-2345'), (3, '2-2345-6789'),

-- CrossFit Morning (Clase 4)
(4, '3-3456-7890'), (4, '7-7890-1234'), (4, '9-9012-3456'),

-- CrossFit Tarde (Clase 5)
(5, '3-3456-7890'), (5, '1-1234-5678'), (5, '5-5678-9012'), (5, '9-9012-3456'),

-- Aqua CrossFit (Clase 6)
(6, '7-7890-1234'), (6, '3-3456-7890'),

-- Zumba Fitness (Clase 7)
(7, '2-2345-6789'), (7, '4-4567-8901'), (7, '6-6789-0123'), (7, '8-8901-2345'),

-- Aeróbicos Intensos (Clase 8)
(8, '1-1234-5678'), (8, '5-5678-9012'), (8, '6-6789-0123'),

-- Spinning Matinal (Clase 9)
(9, '2-2345-6789'), (9, '6-6789-0123'), (9, '9-9012-3456'),

-- Powerlifting Básico (Clase 10)
(10, '1-1234-5678'), (10, '7-7890-1234'), (10, '5-5678-9012'),

-- Fuerza Funcional (Clase 11)
(11, '3-3456-7890'), (11, '1-1234-5678'),

-- Boxeo Fitness (Clase 12)
(12, '1-1234-5678'), (12, '3-3456-7890'), (12, '5-5678-9012'), (12, '9-9012-3456'),

-- Box & Strength (Clase 13)
(13, '7-7890-1234'), (13, '9-9012-3456');