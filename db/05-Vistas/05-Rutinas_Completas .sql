CREATE VIEW vw_RutinasCompletas AS
SELECT
    r.id_rutina,
    r.cedula_cliente,
    r.cedula_entrenador,
    r.descripcion,
    r.fecha_creacion,
    r.fecha_fin,
    tr.id_tipo_rutina,
    tr.nombre AS tipo_rutina,
    er.id_estado_rutina,
    er.nombre AS estado_rutina,

    -- Días concatenados con STRING_AGG
    STRING_AGG(d.dia, ', ') WITHIN GROUP (
        ORDER BY
            CASE d.dia
                WHEN 'Lunes' THEN 1
                WHEN 'Martes' THEN 2
                WHEN 'Miércoles' THEN 3
                WHEN 'Jueves' THEN 4
                WHEN 'Viernes' THEN 5
                WHEN 'Sábado' THEN 6
                WHEN 'Domingo' THEN 7
                ELSE 8
            END
    ) AS dias,

    -- Información adicional útil
    DATEDIFF(DAY, r.fecha_creacion, ISNULL(r.fecha_fin, GETDATE())) AS dias_duracion,

    CASE
        WHEN r.fecha_fin IS NULL AND er.nombre = 'Activa' THEN 'Vigente'
        WHEN r.fecha_fin IS NOT NULL THEN 'Finalizada'
        ELSE er.nombre
    END AS estado_descriptivo

FROM Rutina r
LEFT JOIN Tipo_Rutina tr ON r.id_tipo_rutina = tr.id_tipo_rutina
LEFT JOIN Estado_Rutina er ON r.id_estado_rutina = er.id_estado_rutina
LEFT JOIN Dia_Rutina dr ON r.id_rutina = dr.id_rutina
LEFT JOIN Dia d ON dr.id_dia = d.id_dia
GROUP BY
    r.id_rutina,
    r.cedula_cliente,
    r.cedula_entrenador,
    r.descripcion,
    r.fecha_creacion,
    r.fecha_fin,
    tr.id_tipo_rutina,
    tr.nombre,
    er.id_estado_rutina,
    er.nombre;