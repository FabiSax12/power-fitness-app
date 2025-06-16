import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MembresiasService } from './membresias.service';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';
import { CreateTipoMembresiaDto } from './dto/create-tipo-membresia.dto';
import { UpdateTipoMembresiaDto } from './dto/uptade-tipo-membresia.dto';

@Controller('membresias')
export class MembresiasController {
  constructor(private readonly membresiasService: MembresiasService) { }

  @Post()
  create(@Body() createMembresiaDto: CreateMembresiaDto) {
    return this.membresiasService.create(createMembresiaDto);
  }

  @Get()
  async findAll() {
    const membresias = await this.membresiasService.findAll();
    return {
      data: membresias.recordset,
      total: membresias.data.length,
      message: 'Membresías consultadas correctamente',
    };
  }

  @Get('tipos')
  async findAllTypes() {
    const membresias = await this.membresiasService.findAllTypes();
    return {
      data: membresias.recordset,
      total: membresias.data.length,
      message: 'Tipos de Membresías consultadas correctamente',
    };
  }

  @Post('tipos')
  async createTipo(@Body() createMembresiaDto: CreateTipoMembresiaDto) {
    const result = await this.membresiasService.createType(createMembresiaDto);
    return {
      data: result,
      message: 'Tipo de Membresía creado correctamente',
    };
  }

  @Patch('tipos/:id')
  async updateTipo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMembresiaDto: UpdateTipoMembresiaDto
  ) {
    const result = await this.membresiasService.updateType(id, updateMembresiaDto);
    return {
      data: result.data,
      message: 'Tipo de Membresía actualizado correctamente',
    };
  }

  @Delete('tipos/:id')
  async removeTipo(@Param('id', ParseIntPipe) id: number) {
    const result = await this.membresiasService.removeType(id);
    return {
      data: result,
      message: 'Tipo de Membresía eliminado correctamente',
    };
  }

  @Get('frecuencias')
  async findAllFrecuencias() {
    const membresias = await this.membresiasService.findAllFrecuencias();
    return membresias.recordset
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membresiasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembresiaDto: UpdateMembresiaDto) {
    return this.membresiasService.update(+id, updateMembresiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membresiasService.remove(+id);
  }
}
