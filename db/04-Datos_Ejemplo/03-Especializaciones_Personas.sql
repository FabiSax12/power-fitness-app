-- =====================================================
-- ESPECIALIZACIONES DE PERSONAS
-- =====================================================

-- Administrativos
INSERT INTO Administrativo (cedula_administrativo, id_cargo) VALUES
('1-1111-1111', 1),  -- María José - Gerente General
('2-2222-2222', 3),  -- Carlos - Contador
('3-3333-3333', 2);  -- Ana Patricia - Recepcionista

-- Permisos de Administrativos
INSERT INTO Administrativo_Permiso (id_administrativo, id_permiso) VALUES
('1-1111-1111', 7),  -- Gerente - Acceso Total
('2-2222-2222', 3), ('2-2222-2222', 4),  -- Contador - Pagos y Reportes
('3-3333-3333', 1), ('3-3333-3333', 2);  -- Recepcionista - Usuarios y Membresías

-- Entrenadores
INSERT INTO Entrenador (cedula_entrenador, experiencia) VALUES
('1-2345-6789', '5 años en entrenamiento personalizado, especializado en musculación y pérdida de peso'),
('2-3456-7890', '3 años como instructora de yoga y pilates, certificada en técnicas de relajación'),
('3-4567-8901', '7 años en CrossFit y entrenamiento funcional, ex-atleta de natación'),
('4-5678-9012', '4 años en aeróbicos y zumba, especializada en acondicionamiento cardiovascular'),
('5-6789-0123', '6 años en musculación y powerlifting, entrenador de competidores');

-- Especialidades de Entrenadores
INSERT INTO Entrenador_Especialidad (id_entrenador, id_especialidad) VALUES
('1-2345-6789', 1), ('1-2345-6789', 2),  -- Luis - Musculación y Funcional
('3-4567-8901', 3),  -- Miguel - CrossFit
('4-5678-9012', 5), -- Gabriela - Cardio y Zumba
('5-6789-0123', 1), ('5-6789-0123', 4);  -- Roberto - Musculación y JiuJitsu

-- Certificaciones de Entrenadores
INSERT INTO Entrenador_Certificacion (id_entrenador, id_certificacion) VALUES
('1-2345-6789', 3), ('1-2345-6789', 4),  -- Luis
('3-4567-8901', 5),
('4-5678-9012', 6), ('4-5678-9012', 4),  -- Gabriela
('5-6789-0123', 4), ('5-6789-0123', 6);  -- Roberto

-- Clientes
INSERT INTO Cliente (cedula_cliente, id_nivel_fitness, peso) VALUES
('1-1234-5678', 2, 75.5),  -- José - Intermedio
('2-2345-6789', 1, 62.0),  -- Laura - Principiante
('3-3456-7890', 3, 82.3),  -- Diego - Avanzado
('4-4567-8901', 1, 58.7),  -- Carmen - Principiante
('5-5678-9012', 2, 78.9),  -- Andrés - Intermedio
('6-6789-0123', 2, 65.4),  -- Melissa - Intermedio
('7-7890-1234', 3, 88.1),  -- Fernando - Avanzado
('8-8901-2345', 1, 55.2),  -- Valeria - Principiante
('9-9012-3456', 3, 91.7),  -- Ricardo - Avanzado
('1-0123-4567', 2, 67.8);  -- Paola - Intermedio

-- Objetivos de Clientes
INSERT INTO Cliente_Objetivo (cedula_cliente, id_objetivo, descripcion) VALUES
('1-1234-5678', 2, 'Ganar 5kg de masa muscular en 6 meses'),
('1-1234-5678', 3, 'Mejorar resistencia cardiovascular'),
('2-2345-6789', 1, 'Perder 8kg en 4 meses'),
('3-3456-7890', 5, 'Preparación para competencia de CrossFit'),
('4-4567-8901', 4, 'Tonificar abdomen y piernas'),
('5-5678-9012', 7, 'Mantener peso y condición actual'),
('6-6789-0123', 1, 'Perder 3kg y tonificar'),
('7-7890-1234', 2, 'Aumentar masa muscular en tren superior'),
('8-8901-2345', 8, 'Mejorar flexibilidad general'),
('9-9012-3456', 5, 'Entrenamiento para maratón'),
('1-0123-4567', 9, 'Reducir estrés mediante ejercicio');

-- Condiciones Médicas de Clientes
INSERT INTO Cliente_Condicion_Medica (cedula_cliente, id_condicion_medica) VALUES
('2-2345-6789', 4),  -- Laura - Asma
('3-3456-7890', 5),  -- Diego - Lesión de Rodilla
('4-4567-8901', 1),  -- Carmen - Hipertensión
('7-7890-1234', 6),  -- Fernando - Hernias Discales
('8-8901-2345', 7);  -- Valeria - Fibromialgia