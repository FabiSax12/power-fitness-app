import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BeneficiosService } from './beneficios.service';
import { CreateBeneficioDto } from './dto/create-beneficio.dto';
import { UpdateBeneficioDto } from './dto/update-beneficio.dto';

@Controller('beneficios')
export class BeneficiosController {
  constructor(private readonly beneficiosService: BeneficiosService) { }

  @Post()
  create(@Body() createBeneficioDto: CreateBeneficioDto) {
    return this.beneficiosService.create(createBeneficioDto);
  }

  @Get()
  async findAll() {
    const beneficios = await this.beneficiosService.findAll();

    return beneficios.recordset
  }

  @Get('asignaciones')
  async findAllAsignaciones() {
    const asignaciones = await this.beneficiosService.findAllAsignaciones();

    return asignaciones.recordset;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.beneficiosService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBeneficioDto: UpdateBeneficioDto) {
    const response = await this.beneficiosService.update(id, updateBeneficioDto);
    return {
      message: 'Beneficio actualizado correctamente',
      data: response.data
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.beneficiosService.remove(id);

    return {
      message: 'Beneficio eliminado correctamente',
      data: response.data
    }
  }
}
