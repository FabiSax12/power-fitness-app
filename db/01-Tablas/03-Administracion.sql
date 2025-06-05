-- ESPECIALIZACIÓN: ADMINISTRACIÓN --
CREATE TABLE Cargo (
     id_cargo INT PRIMARY KEY IDENTITY,
     nombre VARCHAR(30) NOT NULL,
     descripcion VARCHAR(100),
     salario DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE Administrativo (
    cedula_administrativo TCedula PRIMARY KEY,
    id_cargo INT NOT NULL,

    -- Foreign Keys
    CONSTRAINT fk_administrativo_persona FOREIGN KEY (cedula_administrativo) REFERENCES Persona(cedula),
    CONSTRAINT fk_administrativo_cargo FOREIGN KEY (id_cargo) REFERENCES Cargo(id_cargo)
);

CREATE TABLE Permiso (
    id_permiso INT PRIMARY KEY IDENTITY,
    permiso VARCHAR(30) NOT NULL
);

CREATE TABLE Administrativo_Permiso (
    id_administrativo TCedula FOREIGN KEY REFERENCES Administrativo(cedula_administrativo),
    id_permiso INT FOREIGN KEY REFERENCES Permiso(id_permiso),

    CONSTRAINT pk_administrativopermiso PRIMARY KEY (id_administrativo, id_permiso)
);