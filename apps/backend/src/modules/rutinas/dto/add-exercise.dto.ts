import { IsInt, IsString, IsNotEmpty, Min, Matches, IsOptional } from 'class-validator';

export class AddExerciseDto {
  @IsInt()
  @Min(1)
  id_rutina: number;

  @IsString()
  @IsNotEmpty()
  nombre_ejercicio: string;

  @IsInt()
  @Min(1)
  repeticiones?: number;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'tiempo_descanso must be in HH:mm:ss format' })
  tiempo_descanso?: string; // Formato 'HH:mm:ss'
}