import { Controller, Get, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { UpdateProgresoDto } from './dto/update-progreso.dto';

@Controller('progreso')
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) { }

  @Get(':id/detalle')
  async getProgresoDetalle(@Param('id') id: string) {
    const detalles = await this.progresoService.findDetalles(id);

    return detalles.recordset;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProgresoDto: UpdateProgresoDto) {
    return this.progresoService.update(id, updateProgresoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.progresoService.remove(id);
  }
}
