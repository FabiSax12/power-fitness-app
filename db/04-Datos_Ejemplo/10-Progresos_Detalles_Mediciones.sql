-- =====================================================
-- DATOS DE PROGRESO PARA Fabian Vargas
-- Cédula: 3-0234-0567 | Peso inicial: 69kg | Altura: 172cm
-- Período: Enero 2025 - Junio 2025
-- =====================================================

-- ENERO 2025 - MEDICIONES INICIALES
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-01-15',
    @peso_kg = 70.8,
    @porcentaje_grasa = 22,
    @edad_metabolica = 42,
    @detalles = 'Evaluación Inicial:Primera evaluación corporal del año,Objetivos 2025:Reducir grasa corporal y aumentar masa muscular,Plan Nutricional:Iniciando dieta balanceada con déficit calórico moderado',
    @mediciones = 'Bíceps:29.2,Pectorales:89.5,Cuádriceps:52.3,Glúteos:96.2';

-- FEBRERO 2025 - PRIMERA EVALUACIÓN MENSUAL
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-02-12',
    @peso_kg = 69.6,
    @porcentaje_grasa = 20,
    @edad_metabolica = 40,
    @detalles = 'Un Mes de Progreso:He perdido 1.2kg y ganado definición,Rutinas:Las rutinas de fuerza están dando resultados,Motivación:Me siento muy motivada con los cambios',
    @mediciones = 'Bíceps:29.6,Pectorales:88.8,Cuádriceps:51.8,Glúteos:95.5,Espalda:82.3';

-- FEBRERO 2025 - FINAL DEL MES
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-02-26',
    @peso_kg = 69.2,
    @porcentaje_grasa = 19,
    @edad_metabolica = 39,
    @detalles = 'Hábitos Consolidados:Ya tengo una rutina establecida,Fuerza:Puedo levantar más peso que al inicio,Resistencia:Mi resistencia cardiovascular ha mejorado notablemente',
    @mediciones = 'Bíceps:29.8,Tríceps:24.6,Abdominales:70.8,Pantorrillas:34.3';

-- MARZO 2025 - SEGUNDO MES COMPLETO
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-03-15',
    @peso_kg = 68.7,
    @porcentaje_grasa = 18,
    @edad_metabolica = 38,
    @detalles = 'Dos Meses de Constancia:He perdido 2.1kg en total,Definición Muscular:Se nota más definición en brazos y piernas,Confianza:Me siento más segura y fuerte',
    @mediciones = 'Bíceps:30.1,Pectorales:87.9,Cuádriceps:51.2,Glúteos:94.8,Espalda:81.5,Hombros:31.4';

-- ABRIL 2025 - FINAL DEL MES
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-04-28',
    @peso_kg = 67.6,
    @porcentaje_grasa = 17,
    @edad_metabolica = 35,
    @detalles = 'Trimestre Completo:He perdido 3.2kg y ganado mucha fuerza,Composición Corporal:Notable mejora en la relación músculo-grasa,Bienestar:Duermo mejor y tengo más energía todo el día',
    @mediciones = 'Bíceps:30.8,Tríceps:25.2,Abdominales:68.5,Pantorrillas:34.7,Isquiotibiales:45.2';

-- MAYO 2025 - CUARTO MES
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-05-12',
    @peso_kg = 66.8,
    @porcentaje_grasa = 16,
    @edad_metabolica = 34,
    @detalles = 'Resultados Visibles:La gente nota los cambios físicos,Fuerza Funcional:Actividades diarias son mucho más fáciles,Meta Cumplida:Logré hacer 15 push-ups seguidos',
    @mediciones = 'Bíceps:31.1,Pectorales:85.6,Cuádriceps:49.8,Glúteos:92.8,Espalda:79.9,Hombros:32.2';

-- JUNIO 2025 - QUINTO MES (ACTUAL)
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-06-08',
    @peso_kg = 66.3,
    @porcentaje_grasa = 15,
    @edad_metabolica = 32,
    @detalles = 'Cinco Meses Transformación:He perdido 4.5kg y ganado mucha masa muscular,Confianza Total:Me siento increíble con mi cuerpo,Estilo de Vida:El ejercicio es parte natural de mi rutina diaria',
    @mediciones = 'Bíceps:31.7,Pectorales:84.3,Cuádriceps:49.1,Glúteos:91.5,Espalda:79.0,Hombros:32.6';

-- JUNIO 2025 - EVALUACIÓN ACTUAL
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-06-12',
    @peso_kg = 66.0,
    @porcentaje_grasa = 14,
    @edad_metabolica = 31,
    @detalles = 'Estado Actual:En la mejor forma física de mi vida,Objetivos Nuevos:Preparándome para competencia amateur,Agradecimiento:Gracias al equipo por todo el apoyo y motivación',
    @mediciones = 'Bíceps:31.9,Tríceps:25.9,Abdominales:66.0,Pantorrillas:35.2,Isquiotibiales:44.3,Core:73.1,Antebrazos:23.1';