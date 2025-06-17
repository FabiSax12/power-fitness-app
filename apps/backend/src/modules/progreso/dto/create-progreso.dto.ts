import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";

export class CreateProgresoDto {

  @IsNotEmpty()
  @IsString()
  cedula_cliente: string;

  @IsOptional()
  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsNumber()
  @Min(30)
  peso_kg: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  porcentaje_grasa: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  edad_metabolica: number;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  detalles: {
    titulo: string;
    descripcion: string;
  }[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  mediciones: {
    musculo_nombre: string;
    medida_cm: number;
  }[];
}
