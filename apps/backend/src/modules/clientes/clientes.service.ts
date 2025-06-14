import { Injectable, NotFoundException } from '@nestjs/common';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';

@Injectable()
export class ClientesService {

  constructor(
    private readonly dbService: PowerFitnessDbService
  ) { }

  async findOneByCedula(cedula: string) {
    const response = await this.dbService.consultarCliente(cedula);
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Cliente con cédula ${cedula} no encontrado`);
    }
    return response.data;
  }

  async getDashboard(cedula: string) {
    const response = await this.dbService.obtenerDashboardClientes(cedula);
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Dashboard para el cliente con cédula ${cedula} no encontrado`);
    }
    return response.data;
  }

  async getRutinas(cedula: string, searchParams: { page?: number, estado?: string, tipo?: string, search?: string } = {}) {
    const response = await this.dbService.consultarRutinas(cedula = cedula, undefined, searchParams.estado);
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Rutinas para el cliente con cédula ${cedula} no encontrado`);
    }

    let filteredRutinas = response.recordset.filter(rutina => {
      if (searchParams.search) {
        const searchTerm = searchParams.search.toLowerCase();
        return rutina.nombre.toLowerCase().includes(searchTerm) || rutina.descripcion.toLowerCase().includes(searchTerm);
      }
      return true;
    });

    if (searchParams.tipo) {
      filteredRutinas = filteredRutinas.filter(rutina => rutina.tipo === searchParams.tipo);
    }

    return {
      rutinas: filteredRutinas,
      total: response.recordset.length,
      message: `Rutinas encontradas para el cliente con cédula ${cedula}`
    };
  }

  getProgresoCompleto(cedula: string) {
    return this.dbService.obtenerProgresoCliente(cedula);
  }

  async createProgreso(cedula: string, body: { fecha: string, detalles: string, mediciones: string }) {
    const response = await this.dbService.registrarProgreso({ cedula_cliente: cedula, detalles: body.detalles, fecha: new Date(body.fecha), mediciones: body.mediciones });
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Progreso para el cliente con cédula ${cedula} no encontrado`);
    }
    return response;
  }

  async getPagos(cedula: string) {
    const response = await this.dbService.consultarPagosCliente(cedula);
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Pagos para el cliente con cédula ${cedula} no encontrado`);
    }
    return response;
  }
}
