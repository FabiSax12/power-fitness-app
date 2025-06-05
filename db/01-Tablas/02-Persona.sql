CREATE TABLE Genero (
    id TINYINT PRIMARY KEY IDENTITY,
    nombre CHAR(9) NOT NULL
);

CREATE TABLE Persona (
    cedula TCedula PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    apellido1 VARCHAR(30) NOT NULL,
    apellido2 VARCHAR(30) NOT NULL,
    genero TINYINT NOT NULL,
    contraseña TContrasena NOT NULL,
    correo TCorreo NOT NULL UNIQUE,
    fecha_registro DATE DEFAULT GETDATE(),
    fecha_nacimiento DATE NOT NULL,

    -- Foreign Keys
    CONSTRAINT fk_persona_genero FOREIGN KEY (genero) REFERENCES Genero(id)
);

CREATE TABLE Telefono (
    id_telefono INT PRIMARY KEY IDENTITY,
    numero_telefono TTelefono NOT NULL UNIQUE
);

CREATE TABLE Telefono_Persona (
    id_telefono_persona INT PRIMARY KEY IDENTITY,
    id_telefono INT NOT NULL,
    cedula_persona TCedula NOT NULL,

    -- Foreign Keys
    CONSTRAINT fk_telefonopersona_telefono FOREIGN KEY (id_telefono) REFERENCES Telefono(id_telefono),
    CONSTRAINT fk_telefonopersona_persona FOREIGN KEY (cedula_persona) REFERENCES Persona(cedula)
);
