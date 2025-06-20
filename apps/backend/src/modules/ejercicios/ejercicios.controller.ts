import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EjerciciosService } from './ejercicios.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';

@Controller('ejercicios')
export class EjerciciosController {
  constructor(private readonly ejerciciosService: EjerciciosService) { }

  @Post()
  create(@Body() createEjercicioDto: CreateEjercicioDto) {
    return this.ejerciciosService.create(createEjercicioDto);
  }

  @Get()
  async findAll() {
    const execises = await this.ejerciciosService.findAll();
    return execises.recordset;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ejerciciosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEjercicioDto: UpdateEjercicioDto) {
    return this.ejerciciosService.update(+id, updateEjercicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ejerciciosService.remove(+id);
  }
}
