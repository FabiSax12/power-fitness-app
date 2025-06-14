import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: PowerFitnessDbService
  ) { }
  create(createUserDto: CreateUserDto) {
    if (createUserDto.tipo_usuario === 'cliente') {
      const createdUser = this.dbService.insertarCliente({
        apellido1: createUserDto.apellido1,
        apellido2: createUserDto.apellido2,
        cedula: createUserDto.cedula,
        contraseña: createUserDto.contraseña,
        correo: createUserDto.correo,
        experiencia: createUserDto.experiencia,
        fecha_nacimiento: createUserDto.fecha_nacimiento,
        genero: createUserDto.genero,
        id_cargo: createUserDto.id_cargo,
        id_nivel_fitness: createUserDto.id_nivel_fitness,
        nombre: createUserDto.nombre,
        peso: createUserDto.peso,
        tipo_usuario: createUserDto.tipo_usuario
      });
    }
  }

  findAll() {
    return this.dbService.allUsers();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
