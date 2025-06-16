import { Injectable } from '@nestjs/common';
import { CreateProgresoDto } from './dto/create-progreso.dto';
import { UpdateProgresoDto } from './dto/update-progreso.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProgresoService {

  constructor(
    private readonly dbService: DatabaseService
  ) { }

  create(createProgresoDto: CreateProgresoDto) {
    return 'This action adds a new progreso';
  }

  findAll() {
    return `This action returns all progreso`;
  }

  findDetalles(id: string) {
    return this.dbService.executeQuery(`
      SELECT * FROM Detalle d
      WHERE d.id_progreso = @id;
      `,
      {
        id
      }
    )
  }

  findOne(id: number) {
    return `This action returns a #${id} progreso`;
  }

  update(id: number, updateProgresoDto: UpdateProgresoDto) {
    return `This action updates a #${id} progreso`;
  }

  remove(id: number) {
    return this.dbService.executeQuery(`
      DELETE FROM Progreso
      WHERE id_progreso = @id;
    `,
      { id }
    )
  }
}
