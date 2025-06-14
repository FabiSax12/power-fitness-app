export interface Person {
  cedula: string;
  nombre: string;
  apellido1: string;
  tipo_usuario: 'cliente' | 'entrenador' | 'administrativo';
  correo: string;
}

export type UserType = 'cliente' | 'entrenador' | 'administrativo'