-- =====================================================
-- PROGRESO Y MEDICIONES
-- =====================================================

-- Progreso de Clientes
INSERT INTO Progreso (cedula_cliente, fecha) VALUES
-- José Manuel - Progreso mensual
('1-1234-5678', '2024-12-01'),
('1-1234-5678', '2024-11-01'),
('1-1234-5678', '2024-10-01'),

-- Laura Beatriz - Progreso quincenal
('2-2345-6789', '2024-12-01'),
('2-2345-6789', '2024-11-15'),

-- Diego Alejandro - Progreso semanal (atleta)
('3-3456-7890', '2024-12-08'),
('3-3456-7890', '2024-12-01'),
('3-3456-7890', '2024-11-24'),

-- Carmen Lucía - Progreso mensual
('4-4567-8901', '2024-12-10'),
('4-4567-8901', '2024-11-10'),

-- Andrés Felipe - Progreso mensual
('5-5678-9012', '2024-12-01'),

-- Melissa Andrea - Progreso quincenal
('6-6789-0123', '2024-12-05'),
('6-6789-0123', '2024-11-20'),

-- Fernando José - Progreso semanal
('7-7890-1234', '2024-12-07'),
('7-7890-1234', '2024-11-30'),

-- Valeria Stephanie - Progreso mensual
('8-8901-2345', '2024-12-12'),

-- Ricardo David - Progreso semanal (experto)
('9-9012-3456', '2024-12-08'),
('9-9012-3456', '2024-12-01'),

-- Paola Andrea - Progreso mensual
('1-0123-4567', '2024-12-01');

-- Detalles de Progreso
INSERT INTO Detalle (id_progreso, titulo, descripcion) VALUES
-- José Manuel (Progreso 1)
(1, 'Aumento de Peso', 'Ganó 2kg de masa muscular en el último mes'),
(1, 'Mejora en Press Banca', 'Incrementó 10kg en press de banca'),
(1, 'Resistencia Cardiovascular', 'Puede correr 30 minutos sin parar'),

-- José Manuel (Progreso 2)
(2, 'Inicio de Rutina', 'Comenzó programa de musculación'),
(2, 'Evaluación Inicial', 'Realizó mediciones corporales base'),

-- José Manuel (Progreso 3)
(3, 'Primera Semana', 'Adaptación a la rutina de ejercicios'),

-- Laura Beatriz (Progreso 4)
(4, 'Pérdida de Peso', 'Perdió 3kg en el último mes'),
(4, 'Mejora Cardio', 'Aumentó tiempo en caminadora'),

-- Laura Beatriz (Progreso 5)
(5, 'Evaluación Intermedia', 'Revisión de rutina cardiovascular'),

-- Diego Alejandro (Progreso 6)
(6, 'Preparación Competencia', 'Intensificó entrenamiento funcional'),
(6, 'Record Personal', 'Nuevo PR en deadlift: 180kg'),

-- Diego Alejandro (Progreso 7)
(7, 'Entrenamiento Semanal', 'Cumplió 6 días de entrenamiento'),

-- Carmen Lucía (Progreso 8)
(8, 'Tonificación', 'Mejora visible en abdomen y piernas'),
(8, 'Control Hipertensión', 'Presión arterial estable'),

-- Andrés Felipe (Progreso 10)
(10, 'Mantenimiento', 'Mantiene peso y condición física'),

-- Melissa Andrea (Progreso 11)
(11, 'Pérdida Gradual', 'Perdió 1.5kg de forma saludable'),

-- Fernando José (Progreso 13)
(13, 'Ganancia Muscular', 'Aumento en masa muscular del tren superior'),
(13, 'Cuidado Espalda', 'Ejercicios específicos para hernias'),

-- Valeria Stephanie (Progreso 15)
(15, 'Flexibilidad', 'Mejora notable en flexibilidad'),
(15, 'Manejo Dolor', 'Reducción de dolor por fibromialgia'),

-- Ricardo David (Progreso 16)
(16, 'Entrenamiento Maratón', 'Corrió 25km sin parar'),

-- Paola Andrea (Progreso 18)
(18, 'Reducción Estrés', 'Mejor manejo del estrés laboral');

-- Mediciones Corporales
INSERT INTO Medicion (id_progreso, musculo_nombre, musculo_kg, grasa_kg, medida_cm, edad_metabolica) VALUES
-- José Manuel - Evaluaciones
(1, 'Pectoral', 8.5, 12.3, 98.5, 27),
(2, 'Pectoral', 7.8, 14.1, 96.2, 29),
(3, 'Pectoral', 7.2, 15.8, 95.1, 31),

-- Laura Beatriz - Evaluaciones
(4, 'Abdominal', 4.2, 8.7, 68.3, 25),
(5, 'Abdominal', 3.8, 10.4, 70.1, 27),

-- Diego Alejandro - Evaluaciones
(6, 'Cuádriceps', 12.1, 8.9, 58.7, 23),
(7, 'Cuádriceps', 11.8, 9.2, 59.1, 24),
(8, 'Cuádriceps', 11.5, 9.8, 59.5, 25),

-- Carmen Lucía - Evaluaciones
(9, 'Glúteo', 5.1, 11.2, 92.4, 28),
(10, 'Glúteo', 4.7, 12.8, 94.1, 30),

-- Andrés Felipe - Evaluación
(11, 'Bíceps', 6.8, 10.5, 32.1, 26),

-- Melissa Andrea - Evaluaciones
(12, 'Triceps', 3.9, 9.1, 24.7, 24),
(13, 'Triceps', 3.6, 10.2, 25.3, 25),

-- Fernando José - Evaluaciones
(14, 'Dorsal', 9.2, 13.7, 105.2, 31),
(15, 'Dorsal', 8.9, 14.3, 106.1, 32),

-- Valeria Stephanie - Evaluación
(16, 'Pantorrilla', 3.2, 7.8, 33.5, 22),

-- Ricardo David - Evaluaciones
(17, 'Isquiotibiales', 11.8, 7.2, 56.8, 25),
(18, 'Isquiotibiales', 11.5, 7.5, 57.1, 26),

-- Paola Andrea - Evaluación
(19, 'Hombro', 4.5, 9.8, 35.2, 27);