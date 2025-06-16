import { Injectable } from '@nestjs/common';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';
import { DatabaseService } from 'src/database/database.service';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';
import { CreateTipoMembresiaDto } from './dto/create-tipo-membresia.dto';

@Injectable()
export class MembresiasService {

  constructor(
    private readonly powerFitnessService: PowerFitnessDbService,
    private readonly dbService: DatabaseService,
  ) { }
  create(createMembresiaDto: CreateMembresiaDto) {
    return 'This action adds a new membresia';
  }

  createType(createTipoMembresiaDto: CreateTipoMembresiaDto) {
    return this.dbService.executeQuery(
      `INSERT INTO Tipo_Membresia (nombre, precio, id_frecuencia)
      VALUES (@nombre, @precio, @id_frecuencia);`,
      {
        nombre: createTipoMembresiaDto.nombre,
        precio: createTipoMembresiaDto.precio,
        id_frecuencia: createTipoMembresiaDto.id_frecuencia
      }
    )
  }

  findAll() {
    return this.dbService.executeProcedure({
      name: 'sp_ConsultarMembresias',
      params: {}
    });
  }

  findAllTypes() {
    return this.dbService.executeQuery(
      `SELECT
        id_tipo_membresia AS id,
        nombre,
        precio,
        frecuencia
      FROM Tipo_Membresia tm
      JOIN Frecuencia f ON f.id_frecuencia = tm.id_frecuencia
      WHERE activo = 1;`
    );
  }

  findAllFrecuencias() {
    return this.dbService.executeQuery(
      `SELECT
        *
      FROM Frecuencia;`
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} membresia`;
  }

  update(id: number, updateMembresiaDto: UpdateMembresiaDto) {
    return `This action updates a #${id} membresia`;
  }

  updateType(id: number, updateTipoMembresiaDto: CreateTipoMembresiaDto) {
    return this.dbService.executeQuery(
      `UPDATE Tipo_Membresia
      SET nombre = @nombre,
          precio = @precio,
          id_frecuencia = @id_frecuencia
      WHERE id_tipo_membresia = @id`,
      {
        id,
        nombre: updateTipoMembresiaDto.nombre,
        precio: updateTipoMembresiaDto.precio,
        id_frecuencia: updateTipoMembresiaDto.id_frecuencia
      }
    );
  }

  remove(id: number) {
    return `This action removes a #${id} membresia`;
  }

  removeType(id: number) {
    return this.dbService.executeQuery(
      `DELETE FROM Tipo_Membresia WHERE id_tipo_membresia = @id`,
      { id }
    );
  }
}
