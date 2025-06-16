import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateTipoMembresiaDto {

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precio: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @IsInt()
  id_frecuencia: number;
}