-- Tablas Máquinas --

CREATE TABLE Tipo_Maquina (
    id_tipo_maquina INT PRIMARY KEY IDENTITY,
    tipo VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Maquina (
    id_maquina INT PRIMARY KEY IDENTITY,
    peso_max_kg DECIMAL(10,1) NOT NULL,
    sistema_resistencia VARCHAR(20),
    revisiones_tecnicas INT DEFAULT 0,
    requiere_energia BIT DEFAULT 0,
    id_tipo_maquina INT,

    -- Validaciones
    CONSTRAINT chk_peso_max CHECK (peso_max_kg > 0),
    CONSTRAINT chk_piezas_tecnicas CHECK (revisiones_tecnicas >= 0),

    -- Foreign Keys
    CONSTRAINT fk_maquina_tipo FOREIGN KEY (id_tipo_maquina) REFERENCES Tipo_Maquina(id_tipo_maquina)
);

CREATE TABLE Grupo_Muscular_Maquina (
    id_maquina INT NOT NULL,
    id_grupo_muscular INT NOT NULL,

    -- Primary Key compuesta
    CONSTRAINT pk_grupo_muscular_maquina PRIMARY KEY (id_maquina, id_grupo_muscular),

    -- Foreign Keys
    CONSTRAINT fk_grupomuscularmaquina_maquina FOREIGN KEY (id_maquina) REFERENCES Maquina(id_maquina),
    CONSTRAINT fk_grupomuscularmaquina_grupo FOREIGN KEY (id_grupo_muscular) REFERENCES Grupo_Muscular(id_grupo_muscular)
);