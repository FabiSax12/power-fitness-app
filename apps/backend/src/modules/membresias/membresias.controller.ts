import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembresiasService } from './membresias.service';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';

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
