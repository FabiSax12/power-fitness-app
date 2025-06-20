import { Injectable } from '@nestjs/common';
import { CreateRutinaDto } from './dto/create-rutina.dto';
import { UpdateRutinaDto } from './dto/update-rutina.dto';
import { DatabaseService } from 'src/database/database.service';
import { SP_AgregarEjercicioRutina, SP_ConsultarRutinas } from 'src/database/procedures/availableProcedures';

@Injectable()
export class RutinasService {

  constructor(

    private readonly dbService: DatabaseService

  ) { }

  create(createRutinaDto: CreateRutinaDto) {
    return this.dbService.executeProcedure({
      name: 'sp_CrearRutina',
      params: {
        cedula_entrenador: createRutinaDto.cedula_entrenador,
        cedula_cliente: createRutinaDto.cedula_cliente,
        tipo_rutina: createRutinaDto.tipo_rutina,
        descripcion: createRutinaDto.descripcion,
        dias: createRutinaDto.dias,
      }
    });
  }

  createRoutineExecise(data: SP_AgregarEjercicioRutina['params']) {
    return this.dbService.executeProcedure({
      name: 'sp_AgregarEjercicioRutina',
      params: data
    });
  }

  findAll(params?: SP_ConsultarRutinas['params']) {
    return this.dbService.executeProcedure({
      name: 'sp_ConsultarRutinas',
      params
    })
  }

  findOne(id: number) {
    return this.dbService.executeQuery(`
      SELECT * FROM vw_RutinasCompletas WHERE id_rutina = @id
    `, { id });
  }

  findRoutineExecises(id: number) {
    return this.dbService.executeProcedure({ name: 'sp_ConsultarEjerciciosRutina', params: { id_rutina: id } });
  }


  update(id: number, updateRutinaDto: UpdateRutinaDto) {
    return this.dbService.executeProcedure({
      name: 'sp_ActualizarRutina',
      params: { id_rutina: id, ...updateRutinaDto }
    });
  }

  updateState(id: number, estado_rutina: string) {
    return this.dbService.executeProcedure({
      name: 'sp_ActualizarRutina',
      params: { id_rutina: id, estado_rutina }
    });
  }

  remove(id: number) {
    return this.dbService.executeProcedure({ name: 'sp_EliminarRutina', params: { id_rutina: id } });
  }

  removeRoutineExecise(id_rutina: number, id_ejercicio: number) {
    return this.dbService.executeProcedure({
      name: 'sp_EliminarEjercicioRutina',
      params: { id_rutina, id_ejercicio }
    });
  }
}
