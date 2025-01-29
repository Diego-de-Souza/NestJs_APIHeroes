-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS HeroesPlataform;

-- Usar o banco de dados
USE HeroesPlataform;

-- Criar a tabela "studios"
CREATE TABLE IF NOT EXISTS studios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nationality VARCHAR(50),
    history TEXT
);

-- Criar a tabela "team"
CREATE TABLE IF NOT EXISTS team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    creator VARCHAR(50)
);

-- Criar a tabela "heroes"
CREATE TABLE IF NOT EXISTS heroes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    studio_id INT NOT NULL,
    power_type VARCHAR(50),
    morality VARCHAR(50),
    first_appearance VARCHAR(255),
    release_date DATE,
    creator VARCHAR(50),
    weak_point VARCHAR(100),
    affiliation VARCHAR(100),
    story VARCHAR(255),
    team_id INT,
    genre VARCHAR(50),
    image1 BLOB,
    image2 BLOB,
    FOREIGN KEY (studio_id) REFERENCES studios(id),
    FOREIGN KEY (team_id) REFERENCES team(id)
);

-- Criar a tabela "users"
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    birthdate DATE,
    firstemail VARCHAR(100) NOT NULL UNIQUE,
    secondemail VARCHAR(100),
    uf VARCHAR(3),
    address VARCHAR(150),
    complement VARCHAR(100),
    cep CHAR(8),
    state CHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    usuario_id INT NOT NULL,
    access VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
