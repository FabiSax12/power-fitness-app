import { IsNumberString, IsOptional, IsString } from "class-validator";

export class ConsultarRutinasDTO {

  @IsOptional()
  @IsString()
  cedula_cliente?: string;

  @IsOptional()
  @IsString()
  cedula_entrenador?: string;

  @IsOptional()
  @IsNumberString()
  estado?: string
}