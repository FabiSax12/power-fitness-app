import { Injectable } from '@nestjs/common';
import { CreateBeneficioDto } from './dto/create-beneficio.dto';
import { UpdateBeneficioDto } from './dto/update-beneficio.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BeneficiosService {

  constructor(
    private readonly dbService: DatabaseService
  ) { }

  create(createBeneficioDto: CreateBeneficioDto) {
    return this.dbService.executeQuery(`
      INSERT INTO Beneficio (nombre)
      VALUES (@nombre);
    `,
      {
        nombre: createBeneficioDto.nombre
      }
    );
  }

  findAll() {
    return this.dbService.executeQuery(`
      SELECT
          b.id_beneficio as id,
          b.nombre,
      COUNT(btm.id_tipo_membresia) as cantidad_tipos_membresia
      FROM Beneficio AS b LEFT JOIN Beneficio_Tipo_Membresia AS btm ON btm.id_beneficio = b.id_beneficio
      GROUP BY b.id_beneficio, b.nombre
    `);
  }

  findAllAsignaciones() {
    return this.dbService.executeQuery(`
      SELECT
        btm.id_beneficio as id,
        btm.id_tipo_membresia,
        b.nombre as nombre_beneficio,
        tm.nombre as nombre_tipo,
        tm.precio,
        f.frecuencia
      FROM Beneficio_Tipo_Membresia btm
      INNER JOIN Beneficio b ON b.id_beneficio = btm.id_beneficio
      INNER JOIN Tipo_Membresia tm ON tm.id_tipo_membresia = btm.id_tipo_membresia
      INNER JOIN Frecuencia f ON f.id_frecuencia = tm.id_frecuencia
      WHERE tm.activo = 1
      ORDER BY tm.nombre, b.nombre;
    `);
  }

  findOne(id: number) {
    return `This action returns a #${id} beneficio`;
  }

  update(id: number, updateBeneficioDto: UpdateBeneficioDto) {
    return this.dbService.executeQuery(`
       UPDATE Beneficio
        SET nombre = @nombre
        WHERE id_beneficio = @id_beneficio;
      `,
      {
        id_beneficio: id,
        nombre: updateBeneficioDto.nombre
      }
    )
  }


  remove(id: number) {
    return this.dbService.executeQuery(`
      DELETE FROM Beneficio
      WHERE id_beneficio = @id_beneficio;
    `,
      {
        id_beneficio: id
      }
    );
  }
}
