-- Membresías
CREATE TABLE Frecuencia (
    id_frecuencia INT PRIMARY KEY IDENTITY,
    frecuencia TFrecuencia NOT NULL UNIQUE
);

CREATE TABLE Tipo_Membresia (
    id_tipo_membresia INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(25) NOT NULL UNIQUE,
    precio TMonto NOT NULL,
    id_frecuencia INT NOT NULL,
    activo BIT NOT NULL DEFAULT 1

    -- Foreign Keys
    CONSTRAINT fk_tipomembresia_frecuencia FOREIGN KEY (id_frecuencia) REFERENCES Frecuencia(id_frecuencia)
);

CREATE TABLE Estado_Membresia (
    id_estado_membresia INT PRIMARY KEY IDENTITY,
    estado VARCHAR(15) NOT NULL
);

CREATE TABLE Membresia (
    id_membresia INT PRIMARY KEY IDENTITY,
    cedula_cliente TCedula NOT NULL,
    id_tipo_membresia INT NOT NULL,
    fecha_inicio DATE NOT NULL DEFAULT GETDATE(),
    fecha_vencimiento DATE NOT NULL,
    id_estado_membresia INT NOT NULL DEFAULT 1,

    -- Validaciones
    CONSTRAINT chk_fechas_membresia CHECK (fecha_vencimiento > fecha_inicio),

    -- Foreign Keys
    CONSTRAINT fk_membresia_cliente FOREIGN KEY (cedula_cliente) REFERENCES Cliente(cedula_cliente),
    CONSTRAINT fk_membresia_tipo FOREIGN KEY (id_tipo_membresia) REFERENCES Tipo_Membresia(id_tipo_membresia),
    CONSTRAINT fk_membresia_estado FOREIGN KEY (id_estado_membresia) REFERENCES Estado_Membresia(id_estado_membresia)
);

CREATE TABLE Metodo_Pago (
    id_metodo_pago INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Estado_Pago (
    id_estado_pago INT PRIMARY KEY IDENTITY,
    estado VARCHAR(15) NOT NULL UNIQUE
);

CREATE TABLE Pago (
    num_recibo INT PRIMARY KEY IDENTITY,
    monto TMonto NOT NULL,
    fecha_pago DATETIME NOT NULL DEFAULT GETDATE(),
    id_membresia INT NOT NULL,
    id_estado INT NOT NULL DEFAULT 1,
    id_metodo_pago INT NOT NULL,

    -- Validaciones
    CONSTRAINT chk_monto_positivo CHECK (monto > 0),
    CONSTRAINT chk_fecha_pago CHECK (fecha_pago <= GETDATE()),

    -- Foreign Keys
    CONSTRAINT fk_pago_membresia FOREIGN KEY (id_membresia) REFERENCES Membresia(id_membresia),
    CONSTRAINT fk_pago_estado FOREIGN KEY (id_estado) REFERENCES Estado_Pago(id_estado_pago),
    CONSTRAINT fk_pago_metodo FOREIGN KEY (id_metodo_pago) REFERENCES Metodo_Pago(id_metodo_pago)
);

CREATE TABLE Beneficio (
    id_beneficio INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Beneficio_Tipo_Membresia (
    id_tipo_membresia INT FOREIGN KEY REFERENCES Tipo_Membresia(id_tipo_membresia),
    id_beneficio INT FOREIGN KEY REFERENCES Beneficio(id_beneficio) ON DELETE CASCADE,

    CONSTRAINT pk_beneficio_tipo_membresia PRIMARY KEY (id_tipo_membresia, id_beneficio)
);