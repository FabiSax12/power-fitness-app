export interface SP_Login {
  name: 'sp_Login';
  params: {
    email: string;
    password: string;
  };
}

export interface SP_AgregarEjercicioRutina {
  name: 'sp_AgregarEjercicioRutina';
  params: {
    idRutina: number;
    idEjercicio: number;
    series: number;
    repeticiones: number;
    descanso: number;
  };
}

export interface SP_ConsultarCliente {
  name: 'sp_ConsultarCliente';
  params: {
    cedula?: string;
    correo?: string;
  };
}

export interface SP_ConsultarMembresias {
  name: 'sp_ConsultarMembresias';
  params: {
    cedula_cliente?: string;
    estado?: string;
  };
}

export interface SP_ConsultarProgreso {
  name: 'sp_ConsultarProgreso';
  params: {
    cedula_cliente?: string;
    fecha_desde?: Date;
    fecha_hasta?: Date;
  };
}

export interface SP_InsertarCliente {
  name: 'sp_InsertarCliente';
  params: {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    genero_nombre: 'Masculino' | 'Femenino';
    contrasena: string;
    correo: string;
    fecha_nacimiento: Date;
    telefonos?: string; // Lista separada por comas
    nivel_fitness?: 'Principiante' | 'Intermedio' | 'Avanzado';
    peso?: number; // Peso en kg
  };
}

export interface SP_CrearMembresia {
  name: 'sp_CrearMembresia';
  params: {
    cedula_cliente: string;
    tipo_membresia: string; // Nombre del tipo de membresía
    fecha_inicio?: Date;
    metodo_pago?: string; // Por defecto 'Efectivo'
  };
}

export interface sp_RenovarMembresia {
  name: 'sp_RenovarMembresia';
  params: {
    cedula_cliente: string;
    metodo_pago?: string; // Por defecto 'Efectivo'
  };
}

export interface SP_CrearRutina {
  name: 'sp_CrearRutina';
  params: {
    cedula_cliente: string;
    cedula_entrenador: string;
    tipo_rutina: string; // Nombre del tipo de rutina
    descripcion?: string; // Descripción de la rutina
    dias?: string; // Días de la semana en que se realiza la rutina, separados por comas
  };
}

export interface SP_ConsultarRutinas {
  name: 'sp_ConsultarRutinas';
  params: {
    cedula_cliente?: string;
    cedula_entrenador?: string;
    estado?: string
  };
}

export interface SP_RegistrarProgreso {
  name: 'sp_RegistrarProgreso';
  params: {
    cedula_cliente: string;
    fecha?: Date; // Fecha del progreso, por defecto la fecha actual
    detalles?: string; // Formato: 'titulo1:descripcion1,titulo2:descripcion2'
    mediciones?: string; // Formato: 'musculo:kg_musculo:kg_grasa:kg_peso:kg'
  };
}

export interface SP_InsertarEmpleado {
  name: 'sp_InsertarEmpleado';
  params: {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    genero_nombre: 'Masculino' | 'Femenino';
    contrasena: string;
    correo: string;
    fecha_nacimiento: Date;
    id_cargo: number; // ID del cargo del empleado
    telefonos?: string; // Lista separada por comas
  };
}

export type Procedures =
  SP_Login
  | SP_AgregarEjercicioRutina
  | SP_ConsultarCliente
  | SP_ConsultarMembresias
  | SP_ConsultarProgreso
  | SP_InsertarCliente
  | SP_CrearMembresia
  | sp_RenovarMembresia
  | SP_CrearRutina
  | SP_ConsultarRutinas
  | SP_RegistrarProgreso
  | SP_InsertarEmpleado;