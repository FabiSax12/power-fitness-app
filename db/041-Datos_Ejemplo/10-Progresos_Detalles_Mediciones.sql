-- =====================================================
-- DATOS DE PROGRESO PARA GABRIELA HERNÁNDEZ CASTRO
-- Cédula: 3-0234-0567 | Peso inicial: 69kg | Altura: 172cm
-- Período: Enero 2025 - Junio 2025
-- =====================================================

-- ENERO 2025 - MEDICIONES INICIALES
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-01-15',
    @detalles = 'Evaluación Inicial:Primera evaluación corporal del año,Objetivos 2025:Reducir grasa corporal y aumentar masa muscular,Plan Nutricional:Iniciando dieta balanceada con déficit calórico moderado',
    @mediciones = 'Bíceps:2.8:18.5:29.2:42,Pectorales:8.2:22.1:89.5:42,Cuádriceps:12.4:19.8:52.3:42,Glúteos:9.1:21.5:96.2:42';

-- FEBRERO 2025 - PRIMERA EVALUACIÓN MENSUAL
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-02-12',
    @detalles = 'Un Mes de Progreso:He perdido 1.2kg y ganado definición,Rutinas:Las rutinas de fuerza están dando resultados,Motivación:Me siento muy motivada con los cambios',
    @mediciones = 'Bíceps:3.1:17.8:29.6:40,Pectorales:8.5:21.2:88.8:40,Cuádriceps:12.8:19.1:51.8:40,Glúteos:9.4:20.8:95.5:40,Espalda:11.2:20.5:82.3:40';

-- FEBRERO 2025 - FINAL DEL MES
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-02-26',
    @detalles = 'Hábitos Consolidados:Ya tengo una rutina establecida,Fuerza:Puedo levantar más peso que al inicio,Resistencia:Mi resistencia cardiovascular ha mejorado notablemente',
    @mediciones = 'Bíceps:3.2:17.5:29.8:39,Tríceps:2.9:17.1:24.6:39,Abdominales:3.3:20.2:70.8:39,Pantorrillas:4.4:17.5:34.3:39';

-- MARZO 2025 - SEGUNDO MES COMPLETO
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-03-15',
    @detalles = 'Dos Meses de Constancia:He perdido 2.1kg en total,Definición Muscular:Se nota más definición en brazos y piernas,Confianza:Me siento más segura y fuerte',
    @mediciones = 'Bíceps:3.4:17.1:30.1:38,Pectorales:8.8:20.4:87.9:38,Cuádriceps:13.2:18.5:51.2:38,Glúteos:9.8:20.1:94.8:38,Espalda:11.6:19.8:81.5:38,Hombros:4.1:18.9:31.4:38';

-- ABRIL 2025 - FINAL DEL MES
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-04-28',
    @detalles = 'Trimestre Completo:He perdido 3.2kg y ganado mucha fuerza,Composición Corporal:Notable mejora en la relación músculo-grasa,Bienestar:Duermo mejor y tengo más energía todo el día',
    @mediciones = 'Bíceps:3.8:16.1:30.8:35,Tríceps:3.3:16.0:25.2:35,Abdominales:3.9:18.8:68.5:35,Pantorrillas:4.8:16.7:34.7:35,Isquiotibiales:8.4:17.3:45.2:35';

-- MAYO 2025 - CUARTO MES
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-05-12',
    @detalles = 'Resultados Visibles:La gente nota los cambios físicos,Fuerza Funcional:Actividades diarias son mucho más fáciles,Meta Cumplida:Logré hacer 15 push-ups seguidos',
    @mediciones = 'Bíceps:4.0:15.7:31.1:34,Pectorales:9.6:18.9:85.6:34,Cuádriceps:14.1:17.2:49.8:34,Glúteos:10.7:18.7:92.8:34,Espalda:12.7:18.4:79.9:34,Hombros:4.7:17.5:32.2:34';

-- JUNIO 2025 - QUINTO MES (ACTUAL)
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-06-08',
    @detalles = 'Cinco Meses Transformación:He perdido 4.5kg y ganado mucha masa muscular,Confianza Total:Me siento increíble con mi cuerpo,Estilo de Vida:El ejercicio es parte natural de mi rutina diaria',
    @mediciones = 'Bíceps:4.3:15.0:31.7:32,Pectorales:10.1:18.2:84.3:32,Cuádriceps:14.6:16.5:49.1:32,Glúteos:11.2:18.0:91.5:32,Espalda:13.3:17.7:79.0:32,Hombros:5.0:16.8:32.6:32';

-- JUNIO 2025 - EVALUACIÓN ACTUAL
EXEC sp_RegistrarProgreso
    @cedula_cliente = '3-0234-0567',
    @fecha = '2025-06-12',
    @detalles = 'Estado Actual:En la mejor forma física de mi vida,Objetivos Nuevos:Preparándome para competencia amateur,Agradecimiento:Gracias al equipo por todo el apoyo y motivación',
    @mediciones = 'Bíceps:4.4:14.8:31.9:31,Tríceps:3.7:15.1:25.9:31,Abdominales:4.5:17.4:66.0:31,Pantorrillas:5.2:15.9:35.2:31,Isquiotibiales:9.1:16.6:44.3:31,Core:6.2:17.2:73.1:31,Antebrazos:2.7:15.4:23.1:31';