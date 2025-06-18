import { Injectable } from '@nestjs/common';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';
import { DatabaseService } from 'src/database/database.service';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';
import { CreateTipoMembresiaDto } from './dto/create-tipo-membresia.dto';

@Injectable()
export class MembresiasService {

  constructor(
    private readonly powerFitnessService: PowerFitnessDbService,
    private readonly dbService: DatabaseService,
  ) { }
  create(createMembresiaDto: CreateMembresiaDto) {
    return 'This action adds a new membresia';
  }

  createType(createTipoMembresiaDto: CreateTipoMembresiaDto) {
    return this.dbService.executeQuery(
      `INSERT INTO Tipo_Membresia (nombre, precio, id_frecuencia)
      VALUES (@nombre, @precio, @id_frecuencia);`,
      {
        nombre: createTipoMembresiaDto.nombre,
        precio: createTipoMembresiaDto.precio,
        id_frecuencia: createTipoMembresiaDto.id_frecuencia
      }
    )
  }

  findAll() {
    return this.dbService.executeProcedure({
      name: 'sp_ConsultarMembresias',
      params: {}
    });
  }

  findAllTypes() {
    return this.dbService.executeQuery(`
      SELECT
        tm.id_tipo_membresia AS id,
        tm.nombre,
        tm.precio,
        f.frecuencia,
        COALESCE(b.nombre, '') as beneficio
      FROM Tipo_Membresia tm
      JOIN Frecuencia f ON f.id_frecuencia = tm.id_frecuencia
      LEFT JOIN Beneficio_Tipo_Membresia btm ON btm.id_tipo_membresia = tm.id_tipo_membresia
      LEFT JOIN Beneficio b ON b.id_beneficio = btm.id_beneficio
      WHERE tm.activo = 1
      ORDER BY tm.nombre, b.nombre;
    `);
  }

  findUsuariosByTipos() {
    return this.dbService.executeQuery(`
      SELECT
        tm.nombre AS tipo,
        SUM(p.monto) AS ingresos,
        COUNT(DISTINCT c.cedula_cliente) AS clientes,
        COUNT(p.num_recibo) AS cantidad_pagos,
        tm.precio AS precio,
        f.frecuencia AS frecuencia
      FROM Tipo_Membresia tm
      LEFT JOIN Membresia m ON m.id_tipo_membresia = tm.id_tipo_membresia
      LEFT JOIN Pago p ON m.id_membresia = p.id_membresia
      LEFT JOIN Cliente c ON m.cedula_cliente = c.cedula_cliente
      LEFT JOIN Frecuencia f ON tm.id_frecuencia = f.id_frecuencia
      GROUP BY tm.nombre, tm.precio, f.frecuencia;
    `)
  }

  findAllFrecuencias() {
    return this.dbService.executeQuery(
      `SELECT
        *
      FROM Frecuencia;`
    );
  }

  findBeneficiosByTipo(id: number) {
    return this.dbService.executeQuery(
      `SELECT
        b.id_beneficio AS id,
        b.nombre
      FROM Beneficio b
      JOIN Beneficio_Tipo_Membresia btm ON btm.id_beneficio = b.id_beneficio
      WHERE btm.id_tipo_membresia = @id`,
      { id }
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} membresia`;
  }

  update(id: number, updateMembresiaDto: UpdateMembresiaDto) {
    return `This action updates a #${id} membresia`;
  }

  updateType(id: number, updateTipoMembresiaDto: CreateTipoMembresiaDto) {
    return this.dbService.executeQuery(
      `UPDATE Tipo_Membresia
      SET nombre = @nombre,
          precio = @precio,
          id_frecuencia = @id_frecuencia
      WHERE id_tipo_membresia = @id`,
      {
        id,
        nombre: updateTipoMembresiaDto.nombre,
        precio: updateTipoMembresiaDto.precio,
        id_frecuencia: updateTipoMembresiaDto.id_frecuencia
      }
    );
  }

  updateBeneficios(id: number, updateMembresiaDto: { beneficios_ids: number[] }) {
    return 'Not implemented yet.'
  }

  remove(id: number) {
    return `This action removes a #${id} membresia`;
  }

  removeType(id: number) {
    return this.dbService.executeQuery(
      `DELETE FROM Tipo_Membresia WHERE id_tipo_membresia = @id`,
      { id }
    );
  }
}
