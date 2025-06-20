import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, InternalServerErrorException, Put } from '@nestjs/common';
import { RutinasService } from './rutinas.service';
import { CreateRutinaDto } from './dto/create-rutina.dto';
import { UpdateRutinaDto } from './dto/update-rutina.dto';
import { ConsultarRutinasDTO } from './dto/consultar-rutinas.dto';
import { AddExerciseDto } from './dto/add-exercise.dto';

@Controller('rutinas')
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) { }

  @Post()
  create(@Body() createRutinaDto: CreateRutinaDto) {
    return this.rutinasService.create(createRutinaDto);
  }

  @Get()
  async findAll(
    @Query() searchParams: ConsultarRutinasDTO
  ) {
    const rutinas = await this.rutinasService.findAll(searchParams);

    return rutinas.recordset
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const rutina = await this.rutinasService.findOne(id);
    return rutina.data
  }

  @Put(':id/estado')
  async updateState(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estado_rutina: string }
  ) {
    const reponse = await this.rutinasService.updateState(id, body.estado_rutina);

    if (reponse.error) {
      throw new InternalServerErrorException('Error al actualizar el estado de la rutina');
    }

    return { message: 'Estado actualizado correctamente' };
  }

  @Get(':id/ejercicios')
  async findRoutineExecises(@Param('id', ParseIntPipe) id: number) {
    const exercises = await this.rutinasService.findRoutineExecises(id);
    return exercises.recordset;
  }

  @Post(':id/ejercicios')
  async createRoutineExecise(@Body() body: AddExerciseDto) {
    const exercises = await this.rutinasService.createRoutineExecise(body);
    return exercises.recordset;
  }

  @Delete(':id/ejercicios/:id_ejercicio')
  async removeRoutineExecise(
    @Param('id', ParseIntPipe) id: number,
    @Param('id_ejercicio', ParseIntPipe) id_ejercicio: number,
  ) {
    const exercises = await this.rutinasService.removeRoutineExecise(id, id_ejercicio);
    return exercises.recordset;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRutinaDto: UpdateRutinaDto) {
  //   return this.rutinasService.update(+id, updateRutinaDto);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRutinaDto: UpdateRutinaDto) {
    return this.rutinasService.update(+id, updateRutinaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutinasService.remove(+id);
  }
}
