-- =========================
-- Roles Table
-- =========================
CREATE TABLE IF NOT EXISTS roles (
                                     id SERIAL PRIMARY KEY,
                                     name VARCHAR(50) NOT NULL UNIQUE
    );

-- =========================
-- Users Table
-- =========================
CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );

-- =========================
-- Users <-> Roles relation
-- =========================
CREATE TABLE IF NOT EXISTS users_roles (
                                           user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
    );

-- =========================
-- Appointments Table
-- =========================
CREATE TABLE IF NOT EXISTS appointments (
                                            id SERIAL PRIMARY KEY,
                                            patient_id INT NOT NULL REFERENCES users(id),
    doctor_id INT NOT NULL REFERENCES users(id),
    appointment_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED'
    );

-- =========================
-- Seed essential roles
-- =========================
INSERT INTO roles (name) VALUES ('ROLE_PATIENT')
    ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name) VALUES ('ROLE_DOCTOR')
    ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name) VALUES ('ROLE_ADMIN')
    ON CONFLICT (name) DO NOTHING;
