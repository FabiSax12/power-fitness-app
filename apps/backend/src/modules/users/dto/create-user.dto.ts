import { IsEmail, IsNotEmpty, IsString, IsDate, IsNumber, Min, Max, Matches, IsOptional, IsNumberString, IsDateString, MaxDate } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido1: string;

  @IsNotEmpty()
  @IsString()
  apellido2: string;

  @IsNotEmpty()
  @Matches(/^\d{1}-\d{4}-\d{4}$/)
  cedula: string;

  @IsNotEmpty()
  @IsString()
  contraseña: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @IsString()
  experiencia: string;

  @IsNotEmpty()
  @IsDateString()
  fecha_nacimiento: Date;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(Masculino|Femenino)$/)
  genero: 'Masculino' | 'Femenino';

  @IsNotEmpty()
  @IsNumberString()
  id_cargo: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(Principiante|Intermedio|Avanzado)$/)
  nivel_fitness: 'Principiante' | 'Intermedio' | 'Avanzado';

  @IsNotEmpty()
  @IsNumber()
  peso: number;

  @IsNotEmpty()
  @IsString()
  tipo_usuario: string;

  @IsOptional()
  @IsString({ each: true })
  telefonos?: string[]
}
