-- =====================================================
-- MEMBRESÍAS Y PAGOS DE EJEMPLO
-- =====================================================

-- Membresías Activas
INSERT INTO Membresia (cedula_cliente, id_tipo_membresia, fecha_inicio, fecha_vencimiento, id_estado_membresia) VALUES
('1-1234-5678', 2, '2024-12-01', '2025-01-01', 1),  -- José - Premium Mensual
('2-2345-6789', 1, '2024-11-15', '2024-12-15', 2),  -- Laura - Básica Mensual (Vencida)
('3-3456-7890', 5, '2024-06-01', '2025-06-01', 1),  -- Diego - Premium Anual
('4-4567-8901', 1, '2024-12-10', '2025-01-10', 1),  -- Carmen - Básica Mensual
('5-5678-9012', 3, '2024-11-01', '2024-12-01', 2),  -- Andrés - VIP Mensual (Vencida)
('6-6789-0123', 2, '2024-12-05', '2025-01-05', 1),  -- Melissa - Premium Mensual
('7-7890-1234', 6, '2024-01-01', '2025-01-01', 1),  -- Fernando - VIP Anual
('8-8901-2345', 1, '2024-12-12', '2025-01-12', 1),  -- Valeria - Básica Mensual
('9-9012-3456', 3, '2024-12-01', '2025-01-01', 1),  -- Ricardo - VIP Mensual
('1-0123-4567', 4, '2024-03-01', '2025-03-01', 1);  -- Paola - Básica Anual

-- Pagos de Membresías
INSERT INTO Pago (monto, fecha_pago, id_membresia, id_estado, id_metodo_pago) VALUES
(45000.00, '2024-12-01 10:30:00', 1, 1, 2),  -- José - Tarjeta Crédito
(25000.00, '2024-11-15 14:15:00', 2, 1, 1),  -- Laura - Efectivo
(450000.00, '2024-06-01 09:45:00', 3, 1, 4), -- Diego - Transferencia
(25000.00, '2024-12-10 16:20:00', 4, 1, 5),  -- Carmen - SINPE
(65000.00, '2024-11-01 11:10:00', 5, 1, 2),  -- Andrés - Tarjeta Crédito
(45000.00, '2024-12-05 13:30:00', 6, 1, 3),  -- Melissa - Tarjeta Débito
(650000.00, '2024-01-01 08:00:00', 7, 1, 4), -- Fernando - Transferencia
(25000.00, '2024-12-12 15:45:00', 8, 1, 1),  -- Valeria - Efectivo
(65000.00, '2024-12-01 12:15:00', 9, 1, 2),  -- Ricardo - Tarjeta Crédito
(250000.00, '2024-03-01 10:00:00', 10, 1, 4); -- Paola - Transferencia