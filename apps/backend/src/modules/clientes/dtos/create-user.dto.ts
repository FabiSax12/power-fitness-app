import { IsArray, IsDateString, IsEmail, IsMobilePhone, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  cedula: string;

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
  @IsString()
  @Matches(/^(Masculino|Femenino)$/)
  genero_nombre: 'Masculino' | 'Femenino';

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  contrasena: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  fecha_nacimiento: string;

  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  telefonos?: string[];

  @IsNotEmpty()
  @IsString()
  @Matches(/^(Principiante|Intermedio|Avanzado)$/)
  nivel_fitness: 'Principiante' | 'Intermedio' | 'Avanzado';

  @IsNotEmpty()
  @IsNumber()
  @Min(30)
  peso: number;
}