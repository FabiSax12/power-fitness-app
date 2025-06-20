import { Injectable } from '@nestjs/common';
import { CreateEntrenadoreDto } from './dto/create-entrenadore.dto';
import { UpdateEntrenadoreDto } from './dto/update-entrenadore.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EntrenadoresService {

  constructor(
    private readonly dbService: DatabaseService
  ) { }

  create(createEntrenadoreDto: CreateEntrenadoreDto) {
    return 'This action adds a new entrenadore';
  }

  findAll() {
    return `This action returns all entrenadores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entrenadore`;
  }

  findClients(cedula_entrenador: string) {
    return this.dbService.executeQuery(`
      SELECT
        p.cedula,
        CONCAT(p.nombre, ' ', p.apellido1 + ' ', + p.apellido2) AS nombre_completo,
        nf.nivel as nivel_fitness
      FROM Persona p
      INNER JOIN Rutina r ON p.cedula = r.cedula_cliente
      JOIN Cliente c ON p.cedula = c.cedula_cliente
      JOIN Nivel_Fitness nf ON c.id_nivel_fitness = nf.id_nivel_fitness
      WHERE r.cedula_entrenador = @cedula_entrenador;
    `, {
      cedula_entrenador
    })
  }

  update(id: number, updateEntrenadoreDto: UpdateEntrenadoreDto) {
    return `This action updates a #${id} entrenadore`;
  }

  remove(id: number) {
    return `This action removes a #${id} entrenadore`;
  }
}
