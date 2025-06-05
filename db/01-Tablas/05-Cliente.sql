-- ESPECIALIZACIÓN: CLIENTE --
CREATE TABLE Nivel_Fitness (
    id_nivel_fitness INT PRIMARY KEY IDENTITY,
    nivel VARCHAR(20) NOT NULL
);

CREATE TABLE Cliente (
    cedula_cliente TCedula PRIMARY KEY,
    id_nivel_fitness INT,
    estado BIT DEFAULT 1,
    peso TPeso DEFAULT 70.0,

    -- Foreign Keys
    CONSTRAINT fk_cliente_persona FOREIGN KEY (cedula_cliente) REFERENCES Persona(cedula),
    CONSTRAINT fk_cliente_nivelfitness FOREIGN KEY (id_nivel_fitness) REFERENCES Nivel_Fitness(id_nivel_fitness)
);

CREATE TABLE Objetivo (
    id_objetivo INT PRIMARY KEY IDENTITY,
    descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE Cliente_Objetivo (
    cedula_cliente TCedula FOREIGN KEY REFERENCES Cliente(cedula_cliente),
    id_objetivo INT FOREIGN KEY REFERENCES Objetivo(id_objetivo),
    descripcion VARCHAR(100),

    CONSTRAINT pk_cliente_objetivo PRIMARY KEY (cedula_cliente, id_objetivo)
);

CREATE TABLE Condicion_Medica (
    id_condicion_medica INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(30) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE Cliente_Condicion_Medica (
    cedula_cliente TCedula FOREIGN KEY REFERENCES Cliente(cedula_cliente),
    id_condicion_medica INT FOREIGN KEY REFERENCES Condicion_Medica(id_condicion_medica),

    CONSTRAINT pk_cliente_condicion_medica PRIMARY KEY (cedula_cliente, id_condicion_medica)
);

CREATE TABLE Progreso (
    id_progreso INT PRIMARY KEY IDENTITY,
    cedula_cliente TCedula NOT NULL,
    fecha DATE DEFAULT GETDATE(),
    -- Foreign Keys
    CONSTRAINT fk_progreso_cliente FOREIGN KEY (cedula_cliente) REFERENCES Cliente(cedula_cliente)
);

CREATE TABLE Detalle (
    id_detalles INT PRIMARY KEY IDENTITY,
    id_progreso INT NOT NULL,
    titulo VARCHAR(30) NOT NULL,
    descripcion VARCHAR(255),
    -- Foreign Keys
    CONSTRAINT fk_detalle_progreso FOREIGN KEY (id_progreso) REFERENCES Progreso(id_progreso)
);

CREATE TABLE Medicion (
    id_medicion INT PRIMARY KEY IDENTITY,
    id_progreso INT NOT NULL,
    musculo_nombre VARCHAR(25) NOT NULL,
    musculo_kg DECIMAL(5,2) NOT NULL,
    grasa_kg DECIMAL(5,2) NOT NULL,
    medida_cm DECIMAL(5,1) NOT NULL,
    edad_metabolica INT NOT NULL,

    -- Checks
    CONSTRAINT chk_musculo_kg CHECK (musculo_kg >= 0),
    CONSTRAINT chk_grasa_kg CHECK (grasa_kg >= 0 AND grasa_kg <= 100),
    CONSTRAINT chk_edad_metabolica CHECK (edad_metabolica BETWEEN 10 AND 100),
    CONSTRAINT chk_medida_cm CHECK (medida_cm > 0),

    -- Foreign Keys
    CONSTRAINT fk_medicion_progreso FOREIGN KEY (id_progreso) REFERENCES Progreso(id_progreso)
);