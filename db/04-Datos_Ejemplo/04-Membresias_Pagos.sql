-- =====================================================
-- MEMBRESÍAS Y PAGOS
-- =====================================================

-- Frecuencias de Membresía
INSERT INTO Frecuencia (frecuencia) VALUES
('Mensual'),
('Semanal'),
('Anual');

-- Tipos de Membresía
INSERT INTO Tipo_Membresia (nombre, precio, id_frecuencia) VALUES
('Básica Mensual', 25000.00, 1),
('Premium Mensual', 45000.00, 1),
('VIP Mensual', 65000.00, 1),
('Básica Anual', 250000.00, 3),
('Premium Anual', 450000.00, 3),
('VIP Anual', 650000.00, 3),
('Pase Diario', 5000.00, 2);

-- Estados de Membresía
INSERT INTO Estado_Membresia (estado) VALUES
('Activa'),
('Vencida'),
('Suspendida'),
('Cancelada');

-- Métodos de Pago
INSERT INTO Metodo_Pago (nombre) VALUES
('Efectivo'),
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('Transferencia Bancaria'),
('SINPE Móvil'),
('PayPal');

-- Estados de Pago
INSERT INTO Estado_Pago (estado) VALUES
('Completado'),
('Pendiente'),
('Cancelado'),
('Reembolsado');

-- Beneficios
INSERT INTO Beneficio (nombre) VALUES
('Acceso 24/7'),
('Clases Grupales'),
('Entrenador Personal'),
('Nutricionista'),
('Estacionamiento'),
('Toallas'),
('Casilleros'),
('Descuentos en Tienda');

-- Beneficios por Tipo de Membresía
INSERT INTO Beneficio_Tipo_Membresia (id_tipo_membresia, id_beneficio) VALUES
-- Básica Mensual
(1, 2), (1, 5),
-- Premium Mensual
(2, 2), (2, 3), (2, 5), (2, 6), (2, 7),
-- VIP Mensual
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8),
-- Básica Anual
(4, 2), (4, 5), (4, 8),
-- Premium Anual
(5, 2), (5, 3), (5, 5), (5, 6), (5, 7), (5, 8),
-- VIP Anual
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8),
-- Pase Diario
(7, 2), (7, 6);