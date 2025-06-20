-- =====================================================
-- RUTINAS Y EJERCICIOS
-- =====================================================

EXEC sp_CrearRutina
     @cedula_cliente = '3-0234-0567',
     @cedula_entrenador = '1-2345-6789',
     @tipo_rutina = 'Fuerza',
     @descripcion = 'Rutina de fuerza para ganancia de masa muscular',
     @dias = 'Lunes,Martes,Miércoles,Jueves,Viernes';

EXEC sp_AgregarEjercicioRutina
     @id_rutina = 1,
     @nombre_ejercicio = 'Press de Banca',
     @repeticiones = 10,
     @tiempo_descanso = '00:03:00',
     @dificultad = 'Intermedio';