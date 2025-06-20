import { IsString, Length, IsOptional, MaxLength } from "class-validator";

export class CreateRutinaDto {
  @IsString()
  @Length(1, 11)
  cedula_cliente: string;

  @IsString()
  @Length(1, 11)
  cedula_entrenador: string;

  @IsString()
  @Length(1, 15)
  tipo_rutina: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dias?: string;
}
