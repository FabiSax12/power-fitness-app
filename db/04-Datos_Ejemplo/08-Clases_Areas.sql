-- =====================================================
-- CLASES Y ÁREAS
-- =====================================================

-- Áreas del Gimnasio
INSERT INTO Area_Gimnasio (nombre, piso, señas, ubicacion) VALUES
('Área de Pesas', 1, 'Lado izquierdo al entrar', 'Primer piso, zona oeste'),
('Área Cardiovascular', 1, 'Frente a recepción', 'Primer piso, zona central'),
('Salón de Clases 1', 2, 'Primera puerta a la derecha', 'Segundo piso, zona este'),
('Salón de Clases 2', 2, 'Segunda puerta a la derecha', 'Segundo piso, zona este'),
('Piscina', 1, 'Área exterior', 'Primer piso, zona sur'),
('Sauna', 1, 'Junto a vestidores', 'Primer piso, zona norte'),
('Área Funcional', 1, 'Lado derecho al entrar', 'Primer piso, zona este');

-- Tipos de Clase
INSERT INTO Tipo_Clase (nombre) VALUES
('Aeróbicos'),
('Yoga'),
('Pilates'),
('Spinning'),
('Zumba'),
('CrossFit'),
('Aqua Aeróbicos'),
('Stretching');

-- Estados de Equipamiento
INSERT INTO Equipamiento_Estado (estado) VALUES
('Disponible'),
('En Uso'),
('Mantenimiento'),
('Dañado'),
('Fuera de Servicio');

-- Tipos de Disco
INSERT INTO Tipo_Disco (tipo) VALUES
('Olímpico'),
('Estándar'),
('Bumper'),
('Técnico');

-- Tipos de Barra
INSERT INTO Tipo_Barra (tipo) VALUES
('Olímpica'),
('Estándar'),
('EZ'),
('Hex');