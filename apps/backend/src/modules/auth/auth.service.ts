import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService
  ) {
  }

  async login(email: string, password: string) {
    const person = await this.dbService.executeProcedure({ name: 'sp_Login', params: { email, password } })

    console.log('Persona encontrada:', JSON.stringify(person, null, 2));

    if (person.recordset.length === 0) {
      throw new NotFoundException(`Credenciales inválidas`);
    };

    if (person.data.contraseña !== password) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    return person.data;
  }

  async loginWithQuery(email: string, password: string) {
    const person = await this.dbService.executeQuery('SELECT TOP 1 * FROM Persona WHERE correo = @email', { email })

    console.log('Persona encontrada:', JSON.stringify(person, null, 2));

    if (person.recordset.length === 0) {
      throw new NotFoundException(`No se encontró una persona con el email: ${email}`);
    };

    if (person.data.contraseña !== password) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    return person.data;
  }
}
