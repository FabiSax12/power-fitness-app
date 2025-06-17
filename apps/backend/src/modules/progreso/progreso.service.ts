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

    const detallesString = updateProgresoDto.detalles.reduce((acc, detalle) => {
      return acc + `${detalle.titulo}:${detalle.descripcion},`;
    }, '').slice(0, -1);

    const medicionesString = updateProgresoDto.mediciones.reduce((acc, medicion) => {
      return acc + `${medicion.musculo_nombre}:${medicion.medida_cm},`;
    }, '').slice(0, -1);

    return this.dbService.executeProcedure({
      name: 'sp_ActualizarProgreso',
      params: {
        id_progreso: id,
        peso_kg: updateProgresoDto.peso_kg,
        porcentaje_grasa: updateProgresoDto.porcentaje_grasa,
        edad_metabolica: updateProgresoDto.edad_metabolica,
        detalles: detallesString,
        mediciones: medicionesString,
        preservar_detalles_existentes: false,
        preservar_mediciones_existentes: false
      }
    })
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
