// src/database/database.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';
import { Procedures } from './procedures/availableProcedures';

export interface QueryResult<T = any> {
  success: boolean;
  data?: T;
  recordset?: T[];
  error?: string;
  affectedRows?: number;
}

export interface ProcedureParams {
  [key: string]: any;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: sql.ConnectionPool;
  private isConnected = false;

  constructor(private configService: ConfigService) { }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const dbConfig = this.configService.get('database');

      const config: sql.config = {
        server: dbConfig.server,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        options: dbConfig.options,
        pool: dbConfig.pool
      };

      this.pool = await sql.connect(config);

      if (this.pool.connected) {
        this.logger.log('✅ Conectado a SQL Server Azure');
        this.isConnected = true;
      } else {
        this.isConnected = false;
      }

      // Test de conexión
      await this.testConnection();

    } catch (error) {
      this.logger.error('❌ Error al conectar a la base de datos:', error.message);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.close();
        this.logger.log('🔌 Desconectado de SQL Server');
      }
    } catch (error) {
      this.logger.error('Error al desconectar:', error.message);
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const result = await this.executeQuery('SELECT 1 as test, GETDATE() as fecha');
      if (result.success) {
        this.logger.log(`🔍 Test de conexión exitoso - Fecha servidor: ${result.recordset[0].fecha}`);
      }
    } catch (error) {
      this.logger.error('❌ Test de conexión falló:', error.message);
      throw error;
    }
  }

  /**
   * Ejecutar consulta SQL directa
   */
  async executeQuery<T = any>(
    query: string,
    params?: ProcedureParams
  ): Promise<QueryResult<T>> {
    if (!this.isConnected) {
      throw new Error('No hay conexión a la base de datos');
    }

    const startTime = Date.now();
    let request: sql.Request;

    try {
      request = this.pool.request();

      // Agregar parámetros si existen
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, this.getSqlType(value), value);
        });
      }

      const result = await request.query(query);
      const executionTime = Date.now() - startTime;

      // Log de queries en desarrollo
      if (this.configService.get('database.logging.queries')) {
        this.logger.debug(`📊 Query ejecutada en ${executionTime}ms: ${query.substring(0, 100)}...`);
      }

      return {
        success: true,
        recordset: result.recordset,
        data: result.recordset[0],
        affectedRows: result.rowsAffected[0],
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(`❌ Error en query (${executionTime}ms):`, {
        query: query.substring(0, 200),
        error: error.message,
        params
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Ejecutar procedimiento almacenado
   */
  async executeProcedure<T = any>(
    {
      name,
      params
    }: Procedures
  ): Promise<QueryResult<T>> {
    if (!this.isConnected) {
      throw new Error('No hay conexión a la base de datos');
    }

    const startTime = Date.now();
    let request: sql.Request;

    try {
      request = this.pool.request();

      // Agregar parámetros
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, this.getSqlType(value), value);
        });
      }

      const result = await request.execute(name);
      const executionTime = Date.now() - startTime;

      this.logger.debug(`🔧 Procedimiento '${JSON.stringify(request.toReadableStream())}' ejecutado en ${executionTime}ms`);

      return {
        success: true,
        recordset: result.recordset,
        data: result.recordset[0],
        affectedRows: result.rowsAffected[0],
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(`❌ Error en procedimiento '${name}' (${executionTime}ms):`, {
        error: error.message,
        params
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Ejecutar transacción
   */
  async executeTransaction<T = any[]>(
    operations: ((transaction: sql.Transaction) => Promise<any>)[]
  ): Promise<QueryResult<T>> {
    const transaction = new sql.Transaction(this.pool);
    const startTime = Date.now();

    try {
      await transaction.begin();
      this.logger.debug('🔄 Transacción iniciada');

      const results = [];
      for (const operation of operations) {
        const result = await operation(transaction);
        results.push(result);
      }

      await transaction.commit();
      const executionTime = Date.now() - startTime;
      this.logger.debug(`✅ Transacción completada en ${executionTime}ms`);

      return {
        success: true,
        data: results as unknown as T,
      };

    } catch (error) {
      await transaction.rollback();
      const executionTime = Date.now() - startTime;
      this.logger.error(`❌ Transacción fallida (${executionTime}ms):`, error.message);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtener estadísticas de conexión
   */
  getConnectionStats() {
    if (!this.pool) {
      return { connected: false };
    }

    return {
      connected: this.isConnected,
      size: this.pool.size,
      available: this.pool.available,
      pending: this.pool.pending,
      borrowed: this.pool.borrowed,
    };
  }

  /**
   * Determinar tipo SQL automáticamente
   */
  private getSqlType(value: any): sql.ISqlType {
    if (value === null || value === undefined) {
      return sql.NVarChar();
    }

    switch (typeof value) {
      case 'string':
        return value.length > 4000 ? sql.Text() : sql.NVarChar(value.length || 255);
      case 'number':
        return Number.isInteger(value) ? sql.Int() : sql.Decimal(18, 2);
      case 'boolean':
        return sql.Bit();
      case 'object':
        if (value instanceof Date) {
          return sql.DateTime();
        }
        return sql.NVarChar();
      default:
        return sql.NVarChar();
    }
  }
}