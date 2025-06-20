import { Injectable } from '@nestjs/common';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EjerciciosService {

  constructor(
    private readonly dbService: DatabaseService
  ) { }

  create(createEjercicioDto: CreateEjercicioDto) {
    return 'This action adds a new ejercicio';
  }

  findAll() {
    return this.dbService.executeProcedure({ name: 'sp_ConsultarEjercicios', params: undefined });
  }

  findOne(id: number) {
    return this.dbService.executeQuery(`
      SELECT
          id_ejercicio,
          nombre,
          dificultad
      FROM Ejercicio e
      LEFT JOIN Dificultad d ON e.id_dificultad = d.id_dificultad
      WHERE id_ejercicio = @id;
    `, { id });
  }

  update(id: number, updateEjercicioDto: UpdateEjercicioDto) {
    return `This action updates a #${id} ejercicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} ejercicio`;
  }
}
