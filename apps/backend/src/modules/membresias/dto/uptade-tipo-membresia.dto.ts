import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateTipoMembresiaDto {

  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @IsInt()
  id_frecuencia: number;
}