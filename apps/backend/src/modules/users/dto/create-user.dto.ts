import { IsEmail, IsNotEmpty, IsString, IsDate, IsNumber, Min, Max, Matches } from 'class-validator';

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
  @IsDate()
  fecha_nacimiento: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2)
  genero: number;

  @IsNotEmpty()
  @IsNumber()
  id_cargo: number;

  @IsNotEmpty()
  @IsNumber()
  id_nivel_fitness: number;

  @IsNotEmpty()
  @IsNumber()
  peso: number;

  @IsNotEmpty()
  @IsString()
  tipo_usuario: string;
}
