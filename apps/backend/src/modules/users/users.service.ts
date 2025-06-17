import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly powerFitnessService: PowerFitnessDbService,
    private readonly dbService: DatabaseService,
  ) { }
  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.dbService.executeQuery(
      'SELECT cedula FROM Persona WHERE cedula = @cedula OR correo = @correo',
      {
        cedula: createUserDto.cedula,
        correo: createUserDto.correo,
      }
    );

    if (existingUser.recordset.length > 0) {
      throw new ConflictException('El usuario ya existe con la cédula o correo proporcionado.');
    }

    if (createUserDto.tipo_usuario === 'cliente') {
      const createdUser = await this.powerFitnessService.insertarCliente({
        apellido1: createUserDto.apellido1,
        apellido2: createUserDto.apellido2,
        cedula: createUserDto.cedula,
        contrasena: createUserDto.contraseña,
        correo: createUserDto.correo,
        fecha_nacimiento: createUserDto.fecha_nacimiento,
        genero_nombre: createUserDto.genero,
        nivel_fitness: createUserDto.nivel_fitness,
        nombre: createUserDto.nombre,
        peso: createUserDto.peso,
        telefonos: createUserDto.telefonos?.join(','),
      });

      return {
        data: createdUser.data
      };
    }

    if (createUserDto.tipo_usuario === 'empleado') {
      const createdUser = await this.powerFitnessService.insertarEmpleado({
        apellido1: createUserDto.apellido1,
        apellido2: createUserDto.apellido2,
        cedula: createUserDto.cedula,
        contrasena: createUserDto.contraseña,
        correo: createUserDto.correo,
        fecha_nacimiento: createUserDto.fecha_nacimiento,
        genero_nombre: createUserDto.genero,
        id_cargo: createUserDto.id_cargo,
        nombre: createUserDto.nombre,
        telefonos: createUserDto.telefonos?.join(','),
      });

      return {
        data: createdUser.data
      };
    }
  }

  findAll() {
    return this.powerFitnessService.allUsers();
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  findProgresos(cedula: string) {
    return this.dbService.executeQuery(
      'SELECT * FROM Progreso WHERE cedula = @cedula',
      { cedula }
    )
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return null
  }
}
