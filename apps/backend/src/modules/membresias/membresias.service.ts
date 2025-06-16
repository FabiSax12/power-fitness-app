import { Injectable } from '@nestjs/common';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';
import { DatabaseService } from 'src/database/database.service';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';

@Injectable()
export class MembresiasService {

  constructor(
    private readonly powerFitnessService: PowerFitnessDbService,
    private readonly dbService: DatabaseService,
  ) { }
  create(createMembresiaDto: CreateMembresiaDto) {
    return 'This action adds a new membresia';
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
      JOIN Frecuencia f ON f.id_frecuencia = tm.id_frecuencia;`
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} membresia`;
  }

  update(id: number, updateMembresiaDto: UpdateMembresiaDto) {
    return `This action updates a #${id} membresia`;
  }

  remove(id: number) {
    return `This action removes a #${id} membresia`;
  }
}
