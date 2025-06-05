
INSERT INTO Frecuencia (frecuencia) VALUES
('Mensual'),
('Semanal'),
('Anual');

INSERT INTO Tipo_Membresia (nombre, precio, id_frecuencia) VALUES
('Básica Mensual', 25000.00, 1),
('Premium Mensual', 45000.00, 1),
('VIP Mensual', 65000.00, 1),
('Básica Anual', 250000.00, 3),
('Premium Anual', 450000.00, 3),
('VIP Anual', 650000.00, 3),
('Pase Diario', 5000.00, 2),
('Estudiante', 15000, 1);

INSERT INTO Estado_Membresia (estado) VALUES
('Activa'),
('Vencida'),
('Suspendida'),
('Cancelada');

INSERT INTO Metodo_Pago (nombre) VALUES
('Efectivo'),
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('Transferencia Bancaria'),
('SINPE Móvil'),
('PayPal');

INSERT INTO Estado_Pago (estado) VALUES
('Completado'),
('Pendiente'),
('Cancelado'),
('Reembolsado');

INSERT INTO Beneficio (nombre) VALUES
('Acceso 24/7'),
('Clases Grupales'),
('Entrenador Personal'),
('Nutricionista'),
('Estacionamiento'),
('Toallas'),
('Casilleros'),
('Descuentos en Tienda');

INSERT INTO Beneficio_Tipo_Membresia (id_tipo_membresia, id_beneficio) VALUES
(1, 2), (1, 5),
(2, 2), (2, 3), (2, 5), (2, 6), (2, 7),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8),
(4, 2), (4, 5), (4, 8),
(5, 2), (5, 3), (5, 5), (5, 6), (5, 7), (5, 8),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8),
(7, 2), (7, 6);

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0234-0567',
    @tipo_membresia = 'Premium Mensual',
    @fecha_inicio = '2025-05-15',
    @metodo_pago = 'Tarjeta de Crédito';

EXEC sp_CrearMembresia
    @cedula_cliente = '2-0456-0789',
    @tipo_membresia = 'Premium Anual',
    @fecha_inicio = '2025-01-01',
    @metodo_pago = 'Transferencia Bancaria';

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0567-0890',
    @tipo_membresia = 'Básica Mensual',
    @fecha_inicio = '2025-06-01',
    @metodo_pago = 'SINPE Móvil';

EXEC sp_CrearMembresia
    @cedula_cliente = '3-0234-0567',
    @tipo_membresia = 'Premium Mensual',
    @fecha_inicio = '2025-04-10',
    @metodo_pago = 'Tarjeta de Débito';

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0789-0123',
    @tipo_membresia = 'Premium Mensual',
    @fecha_inicio = '2025-05-20',
    @metodo_pago = 'Efectivo';

EXEC sp_CrearMembresia
    @cedula_cliente = '2-0890-0234',
    @tipo_membresia = 'Básica Mensual',
    @fecha_inicio = '2025-05-05',
    @metodo_pago = 'Tarjeta de Crédito';

EXEC sp_CrearMembresia
    @cedula_cliente = '3-0456-0678',
    @tipo_membresia = 'Básica Anual',
    @fecha_inicio = '2025-03-15',
    @metodo_pago = 'Transferencia Bancaria';

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0567-0789',
    @tipo_membresia = 'Premium Mensual',
    @fecha_inicio = '2025-05-28',
    @metodo_pago = 'SINPE Móvil';

EXEC sp_CrearMembresia
    @cedula_cliente = '2-0123-0456',
    @tipo_membresia = 'Estudiante',
    @fecha_inicio = '2025-05-25',
    @metodo_pago = 'Efectivo';

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0901-0345',
    @tipo_membresia = 'Básica Mensual',
    @fecha_inicio = '2025-04-01',
    @metodo_pago = 'Tarjeta de Débito';

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0345-0678',
    @tipo_membresia = 'Premium Mensual',
    @fecha_inicio = '2025-05-08',
    @metodo_pago = 'Tarjeta de Crédito';

EXEC sp_CrearMembresia
    @cedula_cliente = '3-0789-0123',
    @tipo_membresia = 'Básica Mensual',
    @fecha_inicio = '2025-05-12',
    @metodo_pago = 'SINPE Móvil';

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0678-0901',
    @tipo_membresia = 'Estudiante',
    @fecha_inicio = '2025-03-01',
    @metodo_pago = 'Efectivo';

EXEC sp_CrearMembresia
    @cedula_cliente = '2-0345-0789',
    @tipo_membresia = 'Básica Mensual',
    @fecha_inicio = '2025-03-15',
    @metodo_pago = 'Tarjeta de Débito';

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0678-0234',
    @tipo_membresia = 'Estudiante',
    @fecha_inicio = '2025-04-20',
    @metodo_pago = 'Efectivo';

EXEC sp_CrearMembresia
    @cedula_cliente = '3-0123-0567',
    @tipo_membresia = 'Básica Mensual',
    @fecha_inicio = '2025-06-02',
    @metodo_pago = 'Tarjeta de Crédito';

EXEC sp_CrearMembresia
    @cedula_cliente = '2-0567-0123',
    @tipo_membresia = 'Premium Mensual',
    @fecha_inicio = '2025-06-03',
    @metodo_pago = 'SINPE Móvil';

EXEC sp_CrearMembresia
    @cedula_cliente = '1-0234-0890',
    @tipo_membresia = 'Premium Anual',
    @fecha_inicio = '2025-02-01',
    @metodo_pago = 'Transferencia Bancaria';

EXEC sp_CrearMembresia
    @cedula_cliente = '3-0678-0234',
    @tipo_membresia = 'Estudiante',
    @fecha_inicio = '2025-05-18',
    @metodo_pago = 'Efectivo';

EXEC sp_CrearMembresia
    @cedula_cliente = '2-0890-0567',
    @tipo_membresia = 'Básica Mensual',
    @fecha_inicio = '2025-05-30',
    @metodo_pago = 'Tarjeta de Débito';