-- =====================================================
-- SISTEMA DE ÍNDICES COMPLETO PARA BASE DE DATOS GIMNASIO
-- =====================================================

-- =====================================================
-- 1. ÍNDICES PARA TABLA PERSONA Y RELACIONES
-- =====================================================

-- Búsqueda por nombre completo (muy común en sistemas)
CREATE NONCLUSTERED INDEX IX_Persona_NombreCompleto
ON Persona (nombre, apellido1, apellido2);

-- Búsqueda por correo (login y verificaciones)
CREATE NONCLUSTERED INDEX IX_Persona_Correo
ON Persona (correo);

-- Búsqueda por fecha de registro (reportes administrativos)
CREATE NONCLUSTERED INDEX IX_Persona_FechaRegistro
ON Persona (fecha_registro);

-- Búsqueda por género (estadísticas demográficas)
CREATE NONCLUSTERED INDEX IX_Persona_Genero
ON Persona (genero);

-- Búsqueda por rango de edad (calculada desde fecha_nacimiento)
CREATE NONCLUSTERED INDEX IX_Persona_FechaNacimiento
ON Persona (fecha_nacimiento);

-- =====================================================
-- 2. ÍNDICES PARA RELACIONES TELEFÓNICAS
-- =====================================================

-- Búsqueda de teléfonos por persona
CREATE NONCLUSTERED INDEX IX_TelefonoPersona_Cedula
ON Telefono_Persona (cedula_persona);

-- Búsqueda inversa: persona por teléfono
CREATE NONCLUSTERED INDEX IX_TelefonoPersona_Telefono
ON Telefono_Persona (id_telefono);

-- =====================================================
-- 3. ÍNDICES PARA ADMINISTRACIÓN
-- =====================================================

-- Búsqueda de administrativos por cargo
CREATE NONCLUSTERED INDEX IX_Administrativo_Cargo
ON Administrativo (id_cargo);

-- Búsqueda de permisos por administrativo
CREATE NONCLUSTERED INDEX IX_AdministrativoPermiso_Admin
ON Administrativo_Permiso (id_administrativo);

-- Búsqueda de administrativos por permiso específico
CREATE NONCLUSTERED INDEX IX_AdministrativoPermiso_Permiso
ON Administrativo_Permiso (id_permiso);

-- =====================================================
-- 4. ÍNDICES PARA ENTRENADORES
-- =====================================================

-- Búsqueda de especialidades por entrenador
CREATE NONCLUSTERED INDEX IX_EntrenadorEspecialidad_Entrenador
ON Entrenador_Especialidad (id_entrenador);

-- Búsqueda de entrenadores por especialidad
CREATE NONCLUSTERED INDEX IX_EntrenadorEspecialidad_Especialidad
ON Entrenador_Especialidad (id_especialidad);

-- Búsqueda de certificaciones por entrenador
CREATE NONCLUSTERED INDEX IX_EntrenadorCertificacion_Entrenador
ON Entrenador_Certificacion (id_entrenador);

-- Búsqueda por fecha de certificación (verificar vigencia)
CREATE NONCLUSTERED INDEX IX_Certificacion_FechaObtencion
ON Certificacion (fecha_obtencion);

-- Búsqueda de certificaciones por institución
CREATE NONCLUSTERED INDEX IX_Certificacion_Institucion
ON Certificacion (id_institucion);

-- =====================================================
-- 5. ÍNDICES PARA CLIENTES
-- =====================================================

-- Búsqueda de clientes activos/inactivos
CREATE NONCLUSTERED INDEX IX_Cliente_Estado
ON Cliente (estado);

-- Búsqueda por nivel de fitness
CREATE NONCLUSTERED INDEX IX_Cliente_NivelFitness
ON Cliente (id_nivel_fitness);

-- Búsqueda por rango de peso
CREATE NONCLUSTERED INDEX IX_Cliente_Peso
ON Cliente (peso);

-- Búsqueda de objetivos por cliente
CREATE NONCLUSTERED INDEX IX_ClienteObjetivo_Cliente
ON Cliente_Objetivo (cedula_cliente);

-- Búsqueda de clientes por objetivo específico
CREATE NONCLUSTERED INDEX IX_ClienteObjetivo_Objetivo
ON Cliente_Objetivo (id_objetivo);

-- Búsqueda de condiciones médicas por cliente
CREATE NONCLUSTERED INDEX IX_ClienteCondicion_Cliente
ON Cliente_Condicion_Medica (cedula_cliente);

-- Búsqueda de clientes por condición médica específica
CREATE NONCLUSTERED INDEX IX_ClienteCondicion_Condicion
ON Cliente_Condicion_Medica (id_condicion_medica);

-- =====================================================
-- 6. ÍNDICES PARA PROGRESO Y MEDICIONES
-- =====================================================

-- Búsqueda de progreso por cliente ordenado por fecha
CREATE NONCLUSTERED INDEX IX_Progreso_Cliente_Fecha
ON Progreso (cedula_cliente, fecha DESC);

-- Búsqueda de detalles por progreso
CREATE NONCLUSTERED INDEX IX_Detalle_Progreso
ON Detalle (id_progreso);

-- Búsqueda de mediciones por progreso
CREATE NONCLUSTERED INDEX IX_Medicion_Progreso
ON Medicion (id_progreso);

-- Búsqueda de mediciones por músculo específico
CREATE NONCLUSTERED INDEX IX_Medicion_Musculo
ON Medicion (musculo_nombre);

-- =====================================================
-- 7. ÍNDICES PARA MEMBRESÍAS Y PAGOS
-- =====================================================

-- Búsqueda de membresías por cliente
CREATE NONCLUSTERED INDEX IX_Membresia_Cliente
ON Membresia (cedula_cliente);

-- Búsqueda de membresías por estado
CREATE NONCLUSTERED INDEX IX_Membresia_Estado
ON Membresia (id_estado_membresia);

-- Búsqueda de membresías por tipo
CREATE NONCLUSTERED INDEX IX_Membresia_Tipo
ON Membresia (id_tipo_membresia);

-- Búsqueda de membresías por fecha de vencimiento (alertas)
CREATE NONCLUSTERED INDEX IX_Membresia_FechaVencimiento
ON Membresia (fecha_vencimiento);

-- Búsqueda de membresías activas por rango de fechas
CREATE NONCLUSTERED INDEX IX_Membresia_FechasActividad
ON Membresia (fecha_inicio, fecha_vencimiento, id_estado_membresia);

-- Búsqueda de pagos por membresía
CREATE NONCLUSTERED INDEX IX_Pago_Membresia
ON Pago (id_membresia);

-- Búsqueda de pagos por fecha (reportes financieros)
CREATE NONCLUSTERED INDEX IX_Pago_Fecha
ON Pago (fecha_pago DESC);

-- Búsqueda de pagos por estado
CREATE NONCLUSTERED INDEX IX_Pago_Estado
ON Pago (id_estado);

-- Búsqueda de pagos por método
CREATE NONCLUSTERED INDEX IX_Pago_Metodo
ON Pago (id_metodo_pago);

-- Índice compuesto para reportes financieros
CREATE NONCLUSTERED INDEX IX_Pago_FechaEstadoMonto
ON Pago (fecha_pago, id_estado, monto);

-- =====================================================
-- 8. ÍNDICES PARA RUTINAS
-- =====================================================

-- Búsqueda de rutinas por cliente
CREATE NONCLUSTERED INDEX IX_Rutina_Cliente
ON Rutina (cedula_cliente);

-- Búsqueda de rutinas por entrenador
CREATE NONCLUSTERED INDEX IX_Rutina_Entrenador
ON Rutina (cedula_entrenador);

-- Búsqueda de rutinas por estado
CREATE NONCLUSTERED INDEX IX_Rutina_Estado
ON Rutina (id_estado_rutina);

-- Búsqueda de rutinas por tipo
CREATE NONCLUSTERED INDEX IX_Rutina_Tipo
ON Rutina (id_tipo_rutina);

-- Búsqueda de rutinas por fecha de creación
CREATE NONCLUSTERED INDEX IX_Rutina_FechaCreacion
ON Rutina (fecha_creacion DESC);

-- Rutinas activas (sin fecha fin)
CREATE NONCLUSTERED INDEX IX_Rutina_Activas
ON Rutina (fecha_fin) WHERE fecha_fin IS NULL;

-- Búsqueda de días por rutina
CREATE NONCLUSTERED INDEX IX_DiaRutina_Rutina
ON Dia_Rutina (id_rutina);

-- Búsqueda de rutinas por día específico
CREATE NONCLUSTERED INDEX IX_DiaRutina_Dia
ON Dia_Rutina (id_dia);

-- =====================================================
-- 9. ÍNDICES PARA EJERCICIOS
-- =====================================================

-- Búsqueda de ejercicios por dificultad
CREATE NONCLUSTERED INDEX IX_Ejercicio_Dificultad
ON Ejercicio (id_dificultad);

-- Búsqueda de ejercicios por grupo muscular
CREATE NONCLUSTERED INDEX IX_EjercicioGrupo_Ejercicio
ON Ejercicio_Grupo_Muscular (id_ejercicio);

-- Búsqueda de grupos musculares por ejercicio
CREATE NONCLUSTERED INDEX IX_EjercicioGrupo_Grupo
ON Ejercicio_Grupo_Muscular (id_grupo_muscular);

-- Búsqueda de ejercicios en rutinas
CREATE NONCLUSTERED INDEX IX_EjercicioRutina_Rutina
ON Ejercicio_Rutina (id_rutina);

-- Búsqueda de rutinas por ejercicio específico
CREATE NONCLUSTERED INDEX IX_EjercicioRutina_Ejercicio
ON Ejercicio_Rutina (id_ejercicio);

-- =====================================================
-- 10. ÍNDICES PARA MÁQUINAS
-- =====================================================

-- Búsqueda de máquinas por tipo
CREATE NONCLUSTERED INDEX IX_Maquina_Tipo
ON Maquina (id_tipo_maquina);

-- Búsqueda por peso máximo (filtros de capacidad)
CREATE NONCLUSTERED INDEX IX_Maquina_PesoMax
ON Maquina (peso_max_kg);

-- Máquinas que requieren energía
CREATE NONCLUSTERED INDEX IX_Maquina_RequiereEnergia
ON Maquina (requiere_energia) WHERE requiere_energia = 1;

-- Búsqueda de grupos musculares por máquina
CREATE NONCLUSTERED INDEX IX_GrupoMuscularMaquina_Maquina
ON Grupo_Muscular_Maquina (id_maquina);

-- Búsqueda de máquinas por grupo muscular
CREATE NONCLUSTERED INDEX IX_GrupoMuscularMaquina_Grupo
ON Grupo_Muscular_Maquina (id_grupo_muscular);

-- =====================================================
-- 11. ÍNDICES PARA CLASES
-- =====================================================

-- Búsqueda de clases por entrenador
CREATE NONCLUSTERED INDEX IX_Clase_Entrenador
ON Clase (cedula_entrenador);

-- Búsqueda de clases por área
CREATE NONCLUSTERED INDEX IX_Clase_Area
ON Clase (id_area_gimnasio);

-- Búsqueda de clases por fecha y hora
CREATE NONCLUSTERED INDEX IX_Clase_FechaHora
ON Clase (fecha, hora_inicio);

-- Búsqueda de clases por tipo
CREATE NONCLUSTERED INDEX IX_Clase_Tipo
ON Clase (id_tipo_clase);

-- Clases futuras (programación)
CREATE NONCLUSTERED INDEX IX_Clase_ClasesFuturas
ON Clase (fecha, hora_inicio) WHERE fecha >= CAST(GETDATE() AS DATE);

-- Búsqueda de inscripciones por clase
CREATE NONCLUSTERED INDEX IX_InscripcionClase_Clase
ON Inscripcion_Clase (id_clase);

-- Búsqueda de inscripciones por cliente
CREATE NONCLUSTERED INDEX IX_InscripcionClase_Cliente
ON Inscripcion_Clase (id_cliente);

-- =====================================================
-- 12. ÍNDICES PARA EQUIPAMIENTO
-- =====================================================

-- Búsqueda de equipamiento por clase
CREATE NONCLUSTERED INDEX IX_Equipamiento_Clase
ON Equipamiento (id_clase);

-- Búsqueda de equipamiento por estado
CREATE NONCLUSTERED INDEX IX_Equipamiento_Estado
ON Equipamiento (id_estado);

-- Equipamiento por frecuencia de uso
CREATE NONCLUSTERED INDEX IX_Equipamiento_VecesUsado
ON Equipamiento (veces_usado DESC);

-- Equipamiento por fecha de compra (depreciación/garantías)
CREATE NONCLUSTERED INDEX IX_Equipamiento_FechaCompra
ON Equipamiento (fecha_compra);

-- Búsqueda de discos por tipo
CREATE NONCLUSTERED INDEX IX_Disco_Tipo
ON Disco (id_tipo);

-- Búsqueda de discos por peso
CREATE NONCLUSTERED INDEX IX_Disco_Peso
ON Disco (peso_kg);

-- Búsqueda de barras por tipo
CREATE NONCLUSTERED INDEX IX_Barra_Tipo
ON Barra (id_tipo);

-- Búsqueda de barras por peso
CREATE NONCLUSTERED INDEX IX_Barra_Peso
ON Barra (peso_kg);

-- Búsqueda de mancuernas por peso
CREATE NONCLUSTERED INDEX IX_Mancuerna_Peso
ON Mancuerna (peso_kg);

-- Mancuernas que son pareja
CREATE NONCLUSTERED INDEX IX_Mancuerna_EsPareja
ON Mancuerna (es_pareja) WHERE es_pareja = 1;

-- =====================================================
-- 13. ÍNDICES ESPECIALES PARA REPORTES Y ANALYTICS
-- =====================================================

-- Índice compuesto para análisis de membresías activas por tipo
CREATE NONCLUSTERED INDEX IX_MembresiasActivas_TipoFechas
ON Membresia (id_tipo_membresia, id_estado_membresia, fecha_inicio, fecha_vencimiento)
WHERE id_estado_membresia = 1; -- Solo membresías activas

-- Índice para análisis de ingresos por período
CREATE NONCLUSTERED INDEX IX_AnalisisIngresos
ON Pago (fecha_pago, id_estado, monto, id_metodo_pago)
WHERE id_estado = 1; -- Solo pagos completados

-- Índice para clientes con rutinas activas
CREATE NONCLUSTERED INDEX IX_ClientesRutinasActivas
ON Rutina (cedula_cliente, id_estado_rutina, fecha_creacion)
WHERE id_estado_rutina = 1; -- Solo rutinas activas

-- Índice para análisis de ocupación de clases
CREATE NONCLUSTERED INDEX IX_OcupacionClases
ON Clase (fecha, hora_inicio, id_tipo_clase, id_area_gimnasio);

-- =====================================================
-- 14. ÍNDICES PARA BÚSQUEDAS DE TEXTO
-- =====================================================

-- Para búsquedas de texto en nombres (si se necesita búsqueda parcial)
CREATE NONCLUSTERED INDEX IX_Persona_NombreLike
ON Persona (nombre) INCLUDE (apellido1, apellido2, cedula);

CREATE NONCLUSTERED INDEX IX_Ejercicio_NombreLike
ON Ejercicio (nombre) INCLUDE (id_dificultad);

-- =====================================================
-- 15. ÍNDICES DE COBERTURA PARA CONSULTAS FRECUENTES
-- =====================================================

-- Índice de cobertura para login de usuarios
CREATE NONCLUSTERED INDEX IX_Login_Cobertura
ON Persona (correo)
INCLUDE (cedula, contraseña, nombre, apellido1, apellido2);

-- Índice de cobertura para dashboard de cliente
CREATE NONCLUSTERED INDEX IX_DashboardCliente_Cobertura
ON Cliente (cedula_cliente)
INCLUDE (estado, peso, id_nivel_fitness);

-- Índice de cobertura para resumen de membresías
CREATE NONCLUSTERED INDEX IX_ResumenMembresia_Cobertura
ON Membresia (cedula_cliente, id_estado_membresia)
INCLUDE (id_tipo_membresia, fecha_inicio, fecha_vencimiento);

-- =====================================================
-- COMENTARIOS SOBRE ESTRATEGIA DE INDEXACIÓN:
--
-- 1. Se priorizaron las consultas más frecuentes del sistema
-- 2. Se evitó sobre-indexar para mantener performance en INSERT/UPDATE
-- 3. Se usaron índices filtrados donde era beneficioso
-- 4. Se incluyeron índices de cobertura para consultas críticas
-- 5. Se consideraron tanto búsquedas exactas como por rangos
-- 6. Se optimizó para reportes y analytics comunes
-- =====================================================