-- Clases y Equipamientos --
CREATE TABLE  Area_Gimnasio (
    id_area_gimnasio INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    piso TINYINT DEFAULT 1,
    señas VARCHAR(100),
    ubicacion VARCHAR(255)
);

CREATE TABLE  Tipo_Clase (
    id_tipo_clase INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(25) NOT NULL
);

CREATE TABLE Clase (
    id_clase INT PRIMARY KEY IDENTITY,
    cedula_entrenador TCedula,
    id_area_gimnasio INT,
    descripcion VARCHAR(100),
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    id_tipo_clase INT NOT NULL,
    nombre VARCHAR(30),
    duracion TIME,

    -- Foreign Keys
    CONSTRAINT fk_clase_entrenador FOREIGN KEY (cedula_entrenador) REFERENCES Entrenador(cedula_entrenador),
    CONSTRAINT fk_clase_area FOREIGN KEY (id_area_gimnasio) REFERENCES Area_Gimnasio(id_area_gimnasio)
);

CREATE TABLE  Inscripcion_Clase (
    id_clase INT NOT NULL FOREIGN KEY REFERENCES Clase(id_clase),
    id_cliente TCedula NOT NULL FOREIGN KEY REFERENCES Cliente(cedula_cliente),

    CONSTRAINT pk_inscripcion_clase PRIMARY KEY (id_clase, id_cliente)
);

CREATE TABLE  Equipamiento_Estado (
    id_estado INT PRIMARY KEY IDENTITY,
    estado VARCHAR(30) NOT NULL
);

CREATE TABLE Equipamiento (
    codigo_equipamiento INT PRIMARY KEY IDENTITY,
    id_clase INT,
    id_estado INT,
    veces_usado INT DEFAULT 0,
    nombre VARCHAR(30),
    fecha_compra DATE DEFAULT GETDATE(),

    -- Foreign Keys
    CONSTRAINT fk_equipamiento_estado FOREIGN KEY (id_estado) REFERENCES Equipamiento_Estado(id_estado),
    CONSTRAINT fk_equipamiento_clase FOREIGN KEY (id_clase) REFERENCES Clase(id_clase)
);