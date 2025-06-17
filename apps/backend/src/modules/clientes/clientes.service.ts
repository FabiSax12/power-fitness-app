import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class ClientesService {

  constructor(
    private readonly powerFitnessService: PowerFitnessDbService,
    private readonly dbService: DatabaseService,
  ) { }

  async create(body: CreateUserDto) {
    // Validar si el cliente ya existe
    const existingPerson = await this.dbService.executeQuery(`
      SELECT * FROM Persona WHERE cedula = @cedula OR correo = @correo
    `,
      {
        cedula: body.cedula,
        correo: body.correo
      }
    );

    if (existingPerson.recordset.length > 0) {

      if (existingPerson.recordset.some(person => person.cedula === body.cedula)) {
        throw new ConflictException(`Persona con cédula ${body.cedula} ya existe`);
      }

      if (existingPerson.recordset.some(person => person.correo === body.correo)) {
        throw new ConflictException(`Persona con correo ${body.correo} ya existe`);
      }
    }

    console.log('body', body)

    // Registrar el nuevo cliente
    const response = await this.dbService.executeProcedure({
      name: 'sp_InsertarCliente',
      params: {
        cedula: body.cedula,
        nombre: body.nombre,
        apellido1: body.apellido1,
        apellido2: body.apellido2,
        genero_nombre: body.genero_nombre,
        contrasena: body.contrasena,
        correo: body.correo,
        fecha_nacimiento: new Date(body.fecha_nacimiento),
        telefonos: body.telefonos?.join(','),
        nivel_fitness: body.nivel_fitness,
        peso: body.peso
      }
    });

    // if (!response.recordset || response.recordset.length === 0) {
    //   throw new NotFoundException(`Error al registrar el cliente con cédula ${body.cedula}`);
    // }

    return response;
  }

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
    // 1. Obtener datos base de progreso (ACTUALIZADO con nuevos campos)
    const progresosBase = await this.dbService.executeQuery(`
    SELECT DISTINCT
      p.id_progreso,
      p.fecha,
      p.peso_kg,
      p.porcentaje_grasa,
      p.edad_metabolica,
      FORMAT(p.fecha, 'dd/MM/yyyy') as fecha_legible
    FROM Progreso p
    WHERE p.cedula_cliente = @cedula
    ORDER BY p.fecha DESC;
  `, { cedula });

    // 2. Obtener todos los detalles (SIN CAMBIOS)
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

    // 3. Obtener todas las mediciones (ACTUALIZADO - solo medida_cm)
    const mediciones = await this.dbService.executeQuery(`
    SELECT
      m.id_progreso,
      m.id_medicion,
      m.musculo_nombre,
      m.medida_cm
    FROM Medicion m
    INNER JOIN Progreso p ON m.id_progreso = p.id_progreso
    WHERE p.cedula_cliente = @cedula
    ORDER BY m.id_progreso, m.musculo_nombre;
  `, { cedula });

    // 4. Agrupar en JavaScript (ACTUALIZADO)
    return progresosBase.recordset.map(progreso => {
      // Filtrar detalles de este progreso
      const detallesProgreso = detalles.recordset.filter(d => d.id_progreso === progreso.id_progreso);

      // Filtrar mediciones de este progreso
      const medicionesProgreso = mediciones.recordset.filter(m => m.id_progreso === progreso.id_progreso);

      return {
        id_progreso: progreso.id_progreso,
        fecha: progreso.fecha,
        fecha_legible: progreso.fecha_legible,
        // Nuevos campos del progreso
        peso_kg: progreso.peso_kg,
        porcentaje_grasa: progreso.porcentaje_grasa,
        edad_metabolica: progreso.edad_metabolica,
        // Detalles (sin cambios)
        detalles: detallesProgreso.map(d => ({
          id_detalles: d.id_detalles,
          titulo: d.titulo,
          descripcion: d.descripcion
        })),
        // Mediciones (ACTUALIZADO - solo medida_cm)
        mediciones: medicionesProgreso.map(m => ({
          id_medicion: m.id_medicion,
          musculo_nombre: m.musculo_nombre,
          medida_cm: m.medida_cm
        })),
        cantidad_detalles: detallesProgreso.length,
        cantidad_mediciones: medicionesProgreso.length
      };
    });
  }

  async createProgreso(cedula: string, body: { fecha: string, detalles: string, mediciones: string, edad_metabolica: number, peso_kg: number, porcentaje_grasa: number }) {
    const response = await this.powerFitnessService.registrarProgreso({
      cedula_cliente: cedula,
      detalles: body.detalles,
      edad_metabolica: body.edad_metabolica,
      peso_kg: body.peso_kg,
      porcentaje_grasa: body.porcentaje_grasa,
      fecha: new Date(body.fecha),
      mediciones: body.mediciones
    });
    if (!response || response.recordset.length === 0) {
      throw new NotFoundException(`Progreso para el cliente con cédula ${cedula} no encontrado`);
    }
    return response;
  }

  async getPagos(cedula: string) {
    const response = await this.powerFitnessService.consultarPagosCliente(cedula);
    // if (!response || response.recordset.length === 0) {
    //   throw new NotFoundException(`Pagos para el cliente con cédula ${cedula} no encontrado`);
    // }
    return response;
  }
}
