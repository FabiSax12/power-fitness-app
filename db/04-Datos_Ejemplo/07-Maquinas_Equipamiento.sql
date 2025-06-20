-- =====================================================
-- MÁQUINAS Y EQUIPAMIENTO
-- =====================================================

-- Tipos de Máquina
INSERT INTO Tipo_Maquina (tipo) VALUES
('Cardiovascular'),
('Fuerza'),
('Funcional'),
('Libre');

-- Máquinas
INSERT INTO Maquina (peso_max_kg, sistema_resistencia, revisiones_tecnicas, requiere_energia, id_tipo_maquina) VALUES
(200.0, 'Placas', 2, 0, 2),      -- Máquina de Press
(150.0, 'Cables', 1, 0, 2),      -- Polea Alta
(300.0, 'Hidráulico', 3, 1, 1),  -- Cinta de Correr
(80.0, 'Magnético', 1, 1, 1),    -- Bicicleta Estática
(250.0, 'Placas', 2, 0, 2),      -- Leg Press
(100.0, 'Cables', 1, 0, 2),      -- Máquina de Remo
(120.0, 'Neumático', 2, 1, 1),   -- Elíptica
(180.0, 'Placas', 1, 0, 2);      -- Smith Machine

-- Relación Grupo Muscular-Máquina
INSERT INTO Grupo_Muscular_Maquina (id_maquina, id_grupo_muscular) VALUES
(1, 1), (1, 3), (1, 5),  -- Máquina de Press
(2, 2), (2, 4),          -- Polea Alta
(3, 6), (3, 9),          -- Cinta de Correr
(4, 6), (4, 9),          -- Bicicleta Estática
(5, 6), (5, 8),          -- Leg Press
(6, 2), (6, 4),          -- Máquina de Remo
(7, 6), (7, 8), (7, 9),  -- Elíptica
(8, 1), (8, 2), (8, 6);  -- Smith Machine