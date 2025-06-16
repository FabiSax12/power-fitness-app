import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';

@Injectable()
export class ClientesService {

  constructor(
    private readonly powerFitnessService: PowerFitnessDbService,
    private readonly dbService: DatabaseService,
  ) { }

  async findOneByCedula(cedula: string) {
    const response = await this.powerFitnessService.consultarCliente(cedula);
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Cliente con cédula ${cedula} no encontrado`);
    }
    return response.data;
  }

  async getDashboard(cedula: string) {
    const response = await this.powerFitnessService.obtenerDashboardClientes(cedula);
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Dashboard para el cliente con cédula ${cedula} no encontrado`);
    }
    return response.data;
  }

  async getRutinas(cedula: string, searchParams: { page?: number, estado?: string, tipo?: string, search?: string } = {}) {
    const response = await this.powerFitnessService.consultarRutinas(cedula = cedula, undefined, searchParams.estado);
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
    return this.powerFitnessService.obtenerProgresoCliente(cedula);
  }

  async findProgresosAgrupados(cedula: string) {
    // 1. Obtener datos base de progreso
    const progresosBase = await this.dbService.executeQuery(`
    SELECT DISTINCT
      p.id_progreso,
      p.fecha,
      FORMAT(p.fecha, 'dd/MM/yyyy') as fecha_legible
    FROM Progreso p
    WHERE p.cedula_cliente = @cedula
    ORDER BY p.fecha DESC;
  `, { cedula });

    // 2. Obtener todos los detalles
    const detalles = await this.dbService.executeQuery(`
    SELECT
      d.id_progreso,
      d.id_detalles,
      d.titulo,
      d.descripcion
    FROM Detalle d
    INNER JOIN Progreso p ON d.id_progreso = p.id_progreso
    WHERE p.cedula_cliente = @cedula
    ORDER BY d.id_progreso, d.titulo;
  `, { cedula });

    // 3. Obtener todas las mediciones
    const mediciones = await this.dbService.executeQuery(`
    SELECT
      m.id_progreso,
      m.id_medicion,
      m.musculo_nombre,
      m.musculo_kg,
      m.grasa_kg,
      m.medida_cm,
      m.edad_metabolica
    FROM Medicion m
    INNER JOIN Progreso p ON m.id_progreso = p.id_progreso
    WHERE p.cedula_cliente = @cedula
    ORDER BY m.id_progreso, m.musculo_nombre;
  `, { cedula });

    // 4. Agrupar en JavaScript
    return progresosBase.recordset.map(progreso => {
      // Filtrar detalles de este progreso
      const detallesProgreso = detalles.recordset.filter(d => d.id_progreso === progreso.id_progreso);

      // Filtrar mediciones de este progreso
      const medicionesProgreso = mediciones.recordset.filter(m => m.id_progreso === progreso.id_progreso);

      return {
        id_progreso: progreso.id_progreso,
        fecha: progreso.fecha,
        fecha_legible: progreso.fecha_legible,
        detalles: detallesProgreso.map(d => ({
          id_detalles: d.id_detalles,
          titulo: d.titulo,
          descripcion: d.descripcion
        })),
        mediciones: medicionesProgreso.map(m => ({
          id_medicion: m.id_medicion,
          musculo_nombre: m.musculo_nombre,
          musculo_kg: m.musculo_kg,
          grasa_kg: m.grasa_kg,
          medida_cm: m.medida_cm,
          edad_metabolica: m.edad_metabolica
        })),
        cantidad_detalles: detallesProgreso.length,
        cantidad_mediciones: medicionesProgreso.length
      };
    });
  }

  async createProgreso(cedula: string, body: { fecha: string, detalles: string, mediciones: string }) {
    const response = await this.powerFitnessService.registrarProgreso({ cedula_cliente: cedula, detalles: body.detalles, fecha: new Date(body.fecha), mediciones: body.mediciones });
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Progreso para el cliente con cédula ${cedula} no encontrado`);
    }
    return response;
  }

  async getPagos(cedula: string) {
    const response = await this.powerFitnessService.consultarPagosCliente(cedula);
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Pagos para el cliente con cédula ${cedula} no encontrado`);
    }
    return response;
  }
}
