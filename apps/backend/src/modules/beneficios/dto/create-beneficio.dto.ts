import { IsNotEmpty, IsString } from "class-validator";

export class CreateBeneficioDto {

  @IsNotEmpty()
  @IsString()
  nombre: string;
}
