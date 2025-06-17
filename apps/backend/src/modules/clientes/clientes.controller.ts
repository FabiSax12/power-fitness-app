import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(
    private readonly clientesService: ClientesService
  ) { }

  @Get(":cedula")
  async findAll(
    @Param('cedula') cedula: string
  ) {
    return this.clientesService.findOneByCedula(cedula);
  }

  @Get('dashboard/:cedula')
  async getDashboard(
    @Param('cedula') cedula: string
  ) {
    return this.clientesService.getDashboard(cedula);
  }

  @Get(':cedula/rutinas')
  async getRutinas(
    @Param('cedula') cedula: string,
    @Query() searchParams: { page?: number, estado?: string, tipo?: string, search?: string } = {}
  ) {
    return this.clientesService.getRutinas(cedula, searchParams);
  }

  @Get(':cedula/progreso-completo')
  async getProgresoCompleto(
    @Param('cedula') cedula: string
  ) {

    const progreso = await this.clientesService.getProgresoCompleto(cedula);

    return {
      data: progreso.recordset
    }
  }

  @Post(':cedula/progreso')
  async createProgreso(
    @Param('cedula') cedula: string,
    @Body() body: { fecha: string, detalles: string, mediciones: string, edad_metabolica: number, peso_kg: number, porcentaje_grasa: number }
  ) {
    const progreso = await this.clientesService.createProgreso(cedula, body);

    return {
      data: progreso.recordset
    }
  }


  @Get(':cedula/pagos')
  async getPagos(
    @Param('cedula') cedula: string
  ) {
    const pagos = await this.clientesService.getPagos(cedula);

    console.log('Pagos encontrados:', JSON.stringify(pagos, null, 2));

    return {
      data: pagos.recordset
    }
  }

  @Get(':cedula/progreso')
  async findProgresos(@Param('cedula') cedula: string) {
    const progresos = await this.clientesService.findProgresosAgrupados(cedula);

    return progresos
  }
}
