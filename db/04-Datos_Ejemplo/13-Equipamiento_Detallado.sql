-- =====================================================
-- EQUIPAMIENTO DETALLADO
-- =====================================================

-- Equipamiento General
INSERT INTO Equipamiento (id_clase, id_estado, veces_usado, nombre, fecha_compra) VALUES
-- Equipamiento para clases específicas
(1, 1, 45, 'Colchonetas Yoga Premium', '2024-01-15'),
(1, 1, 45, 'Bloques de Yoga', '2024-01-15'),
(2, 1, 32, 'Pelotas Pilates', '2024-02-10'),
(2, 1, 32, 'Bandas Elásticas', '2024-02-10'),
(4, 1, 78, 'Kettlebells 16kg', '2023-11-20'),
(4, 1, 78, 'Box Jump 60cm', '2023-11-20'),
(7, 1, 89, 'Mancuernas 2kg', '2023-10-05'),
(12, 1, 34, 'Guantes de Boxeo', '2024-03-12'),
(12, 1, 34, 'Sacos de Boxeo', '2024-03-12'),

-- Equipamiento general del gimnasio
(NULL, 1, 156, 'Barras Olímpicas', '2023-08-15'),
(NULL, 1, 134, 'Discos Olímpicos Set', '2023-08-15'),
(NULL, 1, 89, 'Mancuernas Ajustables', '2023-09-10'),
(NULL, 1, 67, 'Banco Press Plano', '2023-07-22'),
(NULL, 1, 45, 'Rack de Sentadillas', '2023-06-18'),
(NULL, 2, 234, 'Cinta de Correr Profesional', '2022-12-01'),
(NULL, 1, 178, 'Bicicleta Estática', '2023-05-14'),
(NULL, 3, 89, 'Máquina Remo Concept2', '2023-04-20'),
(NULL, 1, 123, 'Discos Bumper 20kg', '2023-09-25'),
(NULL, 1, 98, 'Barras EZ Curl', '2023-10-12'),
(NULL, 1, 67, 'Mancuernas Fijas Set', '2023-11-08');

-- Discos Específicos
INSERT INTO Disco (codigo_equipamiento, peso_kg, diametro_cm, id_tipo) VALUES
(11, 20.00, 45.0, 1),  -- Disco Olímpico 20kg
(11, 15.00, 45.0, 1),  -- Disco Olímpico 15kg
(11, 10.00, 45.0, 1),  -- Disco Olímpico 10kg
(11, 5.00, 45.0, 1),   -- Disco Olímpico 5kg
(11, 2.50, 45.0, 1),   -- Disco Olímpico 2.5kg
(18, 20.00, 45.0, 3),  -- Disco Bumper 20kg
(18, 15.00, 45.0, 3),  -- Disco Bumper 15kg
(18, 10.00, 45.0, 3);  -- Disco Bumper 10kg

-- Barras Específicas
INSERT INTO Barra (codigo_equipamiento, peso_kg, longitud_cm, diametro_mm, id_tipo) VALUES
(10, 20.00, 220.0, 28.0, 1),  -- Barra Olímpica Estándar
(10, 15.00, 180.0, 25.0, 1),  -- Barra Olímpica Mujer
(19, 8.00, 120.0, 25.0, 3),   -- Barra EZ Curl
(19, 6.00, 100.0, 25.0, 4);   -- Barra Hex

-- Mancuernas Específicas
INSERT INTO Mancuerna (codigo_equipamiento, peso_kg, es_pareja) VALUES
(7, 2.00, 1),   -- Par de mancuernas 2kg
(12, 5.00, 1),  -- Par de mancuernas 5kg (ajustables)
(20, 10.00, 1), -- Par de mancuernas 10kg (fijas)
(20, 15.00, 1), -- Par de mancuernas 15kg (fijas)
(20, 20.00, 1), -- Par de mancuernas 20kg (fijas)
(20, 25.00, 1), -- Par de mancuernas 25kg (fijas)
(20, 30.00, 1); -- Par de mancuernas 30kg (fijas)