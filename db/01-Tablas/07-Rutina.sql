-- Rutina y Cliente --

CREATE TABLE Estado_Rutina (
    id_estado_rutina INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(15) NOT NULL UNIQUE
);

CREATE TABLE Tipo_Rutina (
    id_tipo_rutina INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(15) NOT NULL UNIQUE
);

CREATE TABLE Dia (
    id_dia INT PRIMARY KEY IDENTITY,
    dia VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE Rutina (
    id_rutina INT PRIMARY KEY IDENTITY,
    cedula_cliente TCedula NOT NULL,
    fecha_creacion DATE NOT NULL DEFAULT GETDATE(),
    fecha_fin DATE NULL,
    id_tipo_rutina INT NOT NULL,
    id_estado_rutina INT NOT NULL DEFAULT 1,
    descripcion VARCHAR(200),
    cedula_entrenador TCedula NOT NULL,

    -- Validaciones
    CONSTRAINT chk_fechas_rutina CHECK (fecha_fin IS NULL OR fecha_fin > fecha_creacion),

    -- Foreign Keys
    CONSTRAINT fk_rutina_tipo FOREIGN KEY (id_tipo_rutina) REFERENCES Tipo_Rutina(id_tipo_rutina),
    CONSTRAINT fk_rutina_estado FOREIGN KEY (id_estado_rutina) REFERENCES Estado_Rutina(id_estado_rutina),
    CONSTRAINT fk_rutina_entrenador FOREIGN KEY (cedula_entrenador) REFERENCES Entrenador(cedula_entrenador),
    CONSTRAINT fk_rutina_cliente FOREIGN KEY (cedula_cliente) REFERENCES Cliente(cedula_cliente)
);

CREATE TABLE Dia_Rutina (
    id_rutina INT NOT NULL,
    id_dia INT NOT NULL,

    -- Primary Key compuesta
    CONSTRAINT pk_dia_rutina PRIMARY KEY (id_rutina, id_dia),

    -- Foreign Keys
    CONSTRAINT fk_diarutina_rutina FOREIGN KEY (id_rutina) REFERENCES Rutina(id_rutina),
    CONSTRAINT fk_diarutina_dia FOREIGN KEY (id_dia) REFERENCES Dia(id_dia)
);