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

    const grouped = membresias.recordset.reduce((acc, row) => {
      const tipoId = row.id;

      // Si el tipo no existe en el acumulador, crearlo
      if (!acc[tipoId]) {
        acc[tipoId] = {
          id: row.id,
          nombre: row.nombre,
          precio: row.precio,
          frecuencia: row.frecuencia,
          beneficios: [],
          cantidad_beneficios: 0
        };
      }

      // Agregar beneficio si existe (no está vacío)
      if (row.beneficio && row.beneficio.trim() !== '') {
        acc[tipoId].beneficios.push(row.beneficio);
        acc[tipoId].cantidad_beneficios = acc[tipoId].beneficios.length;
      }

      return acc;
    }, {});

    return {
      data: Object.values(grouped),
      message: 'Tipos de Membresías consultadas correctamente',
    };
  }

  @Get('tipos/usuarios')
  async findUsuariosByTipo() {
    const tipos = await this.membresiasService.findUsuariosByTipos();
    return tipos.recordset
  }

  @Get('tipos/:id/beneficios')
  async findBeneficiosByTipo(@Param('id', ParseIntPipe) id: number) {
    const beneficios = await this.membresiasService.findBeneficiosByTipo(id);
    return beneficios.recordset
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

  @Patch('tipos/:id/beneficios')
  async updateBeneficios(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMembresiaDto: { beneficios_ids: number[] }
  ) {
    const result = await this.membresiasService.updateBeneficios(id, updateMembresiaDto);
    return result
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
