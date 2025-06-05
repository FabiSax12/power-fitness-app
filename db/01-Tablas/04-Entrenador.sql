-- ESPECIALIZACIÓN: ENTRENADOR --
CREATE TABLE Entrenador (
    cedula_entrenador TCedula PRIMARY KEY,
    experiencia VARCHAR(255),
    -- Foreign Keys
    CONSTRAINT fk_entrenador_persona FOREIGN KEY (cedula_entrenador) REFERENCES Persona(cedula)
);

CREATE TABLE Especialidad (
    id_especialidad INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Entrenador_Especialidad (
    id_entrenador TCedula FOREIGN KEY REFERENCES Entrenador(cedula_entrenador),
    id_especialidad INT FOREIGN KEY REFERENCES Especialidad(id_especialidad),

    CONSTRAINT pk_entrenador_especialidad PRIMARY KEY (id_entrenador, id_especialidad)
);

CREATE TABLE Institucion (
    id_institucion INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Certificacion (
    id_certificacion INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    id_institucion INT,
    fecha_obtencion DATE NOT NULL,
    -- Foreign Keys
    CONSTRAINT fk_certificacion_institucion FOREIGN KEY (id_institucion) REFERENCES Institucion(id_institucion)
);

CREATE TABLE Entrenador_Certificacion (
    id_entrenador TCedula FOREIGN KEY REFERENCES Entrenador(cedula_entrenador),
    id_certificacion INT FOREIGN KEY REFERENCES Certificacion(id_certificacion),

    CONSTRAINT pk_entrenador_certificacion PRIMARY KEY (id_entrenador, id_certificacion)
);
