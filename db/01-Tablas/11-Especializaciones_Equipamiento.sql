-- Especializaciones de Equipamiento

CREATE TABLE Tipo_Disco (
    id_tipo_disco INT PRIMARY KEY IDENTITY,
    tipo VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Disco (
    id_disco INT PRIMARY KEY IDENTITY,
    codigo_equipamiento INT NOT NULL,
    peso_kg DECIMAL(10,2) NOT NULL,
    diametro_cm DECIMAL(10,2) NOT NULL,
    id_tipo INT NOT NULL,

    -- Validaciones
    CONSTRAINT chk_disco_peso CHECK (peso_kg > 0),
    CONSTRAINT chk_disco_diametro CHECK (diametro_cm > 0),

    -- Foreign Keys
    CONSTRAINT fk_disco_equipamiento FOREIGN KEY (codigo_equipamiento) REFERENCES Equipamiento(codigo_equipamiento),
    CONSTRAINT fk_disco_tipo FOREIGN KEY (id_tipo) REFERENCES Tipo_Disco(id_tipo_disco)
);

CREATE TABLE Tipo_Barra (
    id_tipo_barra INT PRIMARY KEY IDENTITY,
    tipo VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE Barra (
    id_barra INT PRIMARY KEY IDENTITY,
    codigo_equipamiento INT NOT NULL,
    peso_kg DECIMAL(10,2) NOT NULL,
    longitud_cm DECIMAL(10,2) NOT NULL,
    diametro_mm DECIMAL(10,2) NOT NULL,
    id_tipo INT NOT NULL,

    -- Validaciones
    CONSTRAINT chk_barra_peso CHECK (peso_kg > 0),
    CONSTRAINT chk_barra_longitud CHECK (longitud_cm > 0),
    CONSTRAINT chk_barra_diametro CHECK (diametro_mm > 0),

    -- Foreign Keys
    CONSTRAINT fk_barra_equipamiento FOREIGN KEY (codigo_equipamiento) REFERENCES Equipamiento(codigo_equipamiento),
    CONSTRAINT fk_barra_tipo FOREIGN KEY (id_tipo) REFERENCES Tipo_Barra(id_tipo_barra)
);

CREATE TABLE Mancuerna (
    id_mancuerna INT PRIMARY KEY IDENTITY,
    codigo_equipamiento INT NOT NULL,
    peso_kg DECIMAL(10,2) NOT NULL,
    es_pareja BIT NOT NULL DEFAULT 0,

    -- Validaciones
    CONSTRAINT chk_mancuerna_peso CHECK (peso_kg > 0),

    -- Foreign Keys
    CONSTRAINT fk_mancuerna_equipamiento FOREIGN KEY (codigo_equipamiento) REFERENCES Equipamiento(codigo_equipamiento)
);