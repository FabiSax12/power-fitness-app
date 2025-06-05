-- Tablas de Ejercicios --

CREATE TABLE Dificultad (
    id_dificultad INT PRIMARY KEY IDENTITY,
    dificultad VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE Ejercicio (
    id_ejercicio INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(25) NOT NULL UNIQUE,
    id_dificultad INT NOT NULL,

    -- Foreign Keys
    CONSTRAINT fk_ejercicio_dificultad FOREIGN KEY (id_dificultad) REFERENCES Dificultad(id_dificultad)
);

CREATE TABLE Grupo_Muscular (
    id_grupo_muscular INT PRIMARY KEY IDENTITY,
    nombre_grupo VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Ejercicio_Grupo_Muscular (
    id_ejercicio INT NOT NULL,
    id_grupo_muscular INT NOT NULL,

    -- Primary Key compuesta
    CONSTRAINT pk_ejercicio_grupo_muscular PRIMARY KEY (id_ejercicio, id_grupo_muscular),

    -- Foreign Keys
    CONSTRAINT fk_ejerciciogrupo_ejercicio FOREIGN KEY (id_ejercicio) REFERENCES Ejercicio(id_ejercicio),
    CONSTRAINT fk_ejerciciogrupo_grupo FOREIGN KEY (id_grupo_muscular) REFERENCES Grupo_Muscular(id_grupo_muscular)
);

CREATE TABLE Ejercicio_Rutina (
    id_ejercicio_rutina INT PRIMARY KEY IDENTITY,
    id_ejercicio INT NOT NULL,
    id_rutina INT NOT NULL,
    repeticiones INT DEFAULT 1,
    tiempo_descanso TIME,

    -- Validaciones
    CONSTRAINT chk_repeticiones CHECK (repeticiones > 0),

    -- Foreign Keys
    CONSTRAINT fk_ejerciciorutina_ejercicio FOREIGN KEY (id_ejercicio) REFERENCES Ejercicio(id_ejercicio),
    CONSTRAINT fk_ejerciciorutina_rutina FOREIGN KEY (id_rutina) REFERENCES Rutina(id_rutina)
);