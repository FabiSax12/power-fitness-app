import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService, QueryResult } from './database.service';
import { SP_AgregarEjercicioRutina, SP_CrearMembresia, SP_CrearRutina, SP_InsertarCliente, SP_InsertarEmpleado, SP_RegistrarProgreso } from './procedures/availableProcedures';

@Injectable()
export class PowerFitnessDbService {
  private readonly logger = new Logger(PowerFitnessDbService.name);

  constructor(private readonly db: DatabaseService) { }

  async allUsers() {
    const admins = await this.db.executeQuery('SELECT * FROM Administrativo JOIN Persona ON Administrativo.cedula_administrativo = Persona.cedula');
    const clients = await this.db.executeQuery('SELECT * FROM Cliente JOIN Persona ON Cliente.cedula_cliente = Persona.cedula');
    const trainers = await this.db.executeQuery('SELECT * FROM Entrenador JOIN Persona ON Entrenador.cedula_entrenador = Persona.cedula');

    return {
      data: {
        administrativos: admins.recordset,
        clientes: clients.recordset,
        entrenadores: trainers.recordset
      }
    }
  }

  // ===== GESTIÓN DE ADMINISTRATIVOS =====
  async consultarAdministrativo(cedula?: string): Promise<QueryResult> {
    return await this.db.executeQuery(`
      SELECT * FROM Administrativo a
      JOIN Persona p ON a.cedula_administrativo = p.cedula
      WHERE a.cedula_administrativo = @cedula
      `,
      {
        cedula
      }
    );
  }

  // ===== GESTIÓN DE CLIENTES =====
  async insertarCliente(clienteData: SP_InsertarCliente['params']): Promise<QueryResult> {
    this.logger.debug(`Creando cliente: ${clienteData.cedula}`);
    return await this.db.executeProcedure({ name: 'sp_InsertarCliente', params: clienteData });
  }

  async consultarCliente(cedula?: string, correo?: string): Promise<QueryResult> {
    return await this.db.executeProcedure({ name: 'sp_ConsultarCliente', params: { cedula, correo } });
  }

  async obtenerDashboardClientes(cedula?: string): Promise<QueryResult> {
    if (cedula) {
      this.logger.debug(`Obteniendo dashboard para el cliente: ${cedula}`);
      return await this.db.executeQuery('SELECT * FROM vw_DashboardCliente WHERE cedula = @cedula', { cedula });
    }

    return await this.db.executeQuery('SELECT * FROM vw_DashboardCliente ORDER BY nombre_completo');
  }

  async obtenerProgresoCliente(cedula: string): Promise<QueryResult> {
    this.logger.debug(`Obteniendo progreso completo para el cliente: ${cedula}`);
    return await this.db.executeQuery('SELECT * FROM vw_ProgresoCliente WHERE cedula = @cedula', { cedula });
  }

  async consultarPagosCliente(cedula: string): Promise<QueryResult> {
    this.logger.debug(`Consultando pagos para el cliente: ${cedula}`);
    return await this.db.executeQuery(`
      SELECT
        num_recibo,
        mp.nombre AS metodo_pago,
        tm.nombre AS tipo_membresia,
        em.estado AS estado_membresia,
        ep.estado AS estado_pago,
        fecha_inicio,
        fecha_pago,
        fecha_vencimiento,
        frecuencia,
        monto,
        precio
    FROM Pago p
    JOIN Membresia m ON p.id_membresia = m.id_membresia
    JOIN Tipo_Membresia tm ON m.id_tipo_membresia = tm.id_tipo_membresia
    JOIN Frecuencia f ON tm.id_frecuencia = f.id_frecuencia
    JOIN Estado_Membresia em ON m.id_estado_membresia = em.id_estado_membresia
    JOIN Estado_Pago ep ON p.id_estado = ep.id_estado_pago
    JOIN Metodo_Pago mp ON p.id_metodo_pago = mp.id_metodo_pago
    WHERE m.cedula_cliente = '3-0234-0567'
      `,
      { cedula }
    );
  }

  // ===== GESTIÓN DE MEMBRESÍAS =====
  async crearMembresia(membresiaData: SP_CrearMembresia['params']): Promise<QueryResult> {
    return await this.db.executeProcedure({ name: 'sp_CrearMembresia', params: membresiaData });
  }

  async renovarMembresia(cedula: string, metodoPago?: string): Promise<QueryResult> {
    return await this.db.executeProcedure({
      name: 'sp_RenovarMembresia',
      params: {
        cedula_cliente: cedula,
        metodo_pago: metodoPago
      }
    });
  }

  async consultarMembresias(cedula?: string, estado?: string): Promise<QueryResult> {
    return await this.db.executeProcedure({
      name: 'sp_ConsultarMembresias',
      params: {
        cedula_cliente: cedula,
        estado
      }
    });
  }

  // ===== GESTIÓN DE RUTINAS =====
  async crearRutina(rutinaData: SP_CrearRutina['params']): Promise<QueryResult> {
    return await this.db.executeProcedure({
      name: 'sp_CrearRutina',
      params: rutinaData
    });
  }

  async consultarRutinas(cedulaCliente?: string, cedulaEntrenador?: string, estado?: string): Promise<QueryResult> {
    return await this.db.executeProcedure({
      name: 'sp_ConsultarRutinas',
      params: {
        cedula_cliente: cedulaCliente,
        cedula_entrenador: cedulaEntrenador,
        estado
      }
    });
  }

  async agregarEjercicioRutina(ejercicioData: SP_AgregarEjercicioRutina['params']): Promise<QueryResult> {
    return await this.db.executeProcedure({
      name: 'sp_AgregarEjercicioRutina',
      params: ejercicioData
    });
  }

  // ===== GESTIÓN DE PROGRESO =====
  async registrarProgreso(progresoData: SP_RegistrarProgreso['params']): Promise<QueryResult> {
    return await this.db.executeProcedure({ name: 'sp_RegistrarProgreso', params: progresoData });
  }

  async consultarProgreso(cedula: string, fechaDesde?: Date, fechaHasta?: Date): Promise<QueryResult> {
    return await this.db.executeProcedure({
      name: 'sp_ConsultarProgreso',
      params: {
        cedula_cliente: cedula,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta
      }
    });
  }

  // ===== VISTAS ESTRATÉGICAS =====
  async obtenerAnalisisFinanciero(): Promise<QueryResult> {
    return await this.db.executeQuery('SELECT * FROM vw_AnalisisFinanciero ORDER BY periodo_yyyymm DESC');
  }

  async obtenerPerformanceEntrenadores(): Promise<QueryResult> {
    return await this.db.executeQuery('SELECT * FROM vw_PerformanceEntrenadores ORDER BY clientes_actuales DESC');
  }

  // ===== BÚSQUEDA GLOBAL =====
  async buscarGlobal(query: string): Promise<QueryResult> {
    const searchQuery = `
      SELECT 'Cliente' as tipo, cedula as id, nombre_completo as titulo, correo as descripcion,
             '/clientes/' + cedula as url
      FROM vw_DashboardCliente
      WHERE nombre_completo LIKE @query OR cedula LIKE @query OR correo LIKE @query

      UNION ALL

      SELECT 'Membresía' as tipo, CAST(id_membresia as VARCHAR) as id,
             'Membresía ' + tipo_membresia_actual as titulo,
             'Cliente: ' + nombre_completo as descripcion,
             '/membresias/' + cedula as url
      FROM vw_DashboardCliente
      WHERE tipo_membresia_actual LIKE @query

      ORDER BY tipo, titulo
    `;

    return await this.db.executeQuery(searchQuery, { query: `%${query}%` });
  }


  async insertarEmpleado(empleadoData: SP_InsertarEmpleado['params']): Promise<QueryResult> {
    return await this.db.executeProcedure({ name: 'sp_InsertarEmpleado', params: empleadoData });
  }


  // ===== ESTADÍSTICAS RÁPIDAS =====
  async obtenerEstadisticasGenerales(): Promise<QueryResult> {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM Cliente WHERE estado = 1) as total_clientes_activos,
        (SELECT COUNT(*) FROM Membresia WHERE id_estado_membresia = 1 AND fecha_vencimiento > GETDATE()) as membresias_vigentes,
        (SELECT COUNT(*) FROM Rutina WHERE id_estado_rutina = 1) as rutinas_activas,
        (SELECT COUNT(*) FROM Entrenador) as total_entrenadores,
        (SELECT ISNULL(SUM(monto), 0) FROM Pago WHERE id_estado = 1 AND MONTH(fecha_pago) = MONTH(GETDATE()) AND YEAR(fecha_pago) = YEAR(GETDATE())) as ingresos_mes_actual,
        (SELECT COUNT(*) FROM Membresia WHERE fecha_vencimiento BETWEEN GETDATE() AND DATEADD(DAY, 7, GETDATE())) as membresias_por_vencer
    `;

    return await this.db.executeQuery(query);
  }

  // ===== MANEJO DE ERRORES Y VALIDACIONES =====
  async validarCliente(cedula: string): Promise<boolean> {
    const result = await this.db.executeQuery(
      'SELECT COUNT(*) as existe FROM Cliente WHERE cedula_cliente = @cedula AND estado = 1',
      { cedula }
    );
    return result.success && result.data?.existe > 0;
  }

  async validarEntrenador(cedula: string): Promise<boolean> {
    const result = await this.db.executeQuery(
      'SELECT COUNT(*) as existe FROM Entrenador WHERE cedula_entrenador = @cedula',
      { cedula }
    );
    return result.success && result.data?.existe > 0;
  }
}