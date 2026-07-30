-- Crear tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    completada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo (opcional)
INSERT INTO tareas (titulo, completada) VALUES
    ('Aprender Docker', false),
    ('Desplegar aplicacion', false),
    ('Configurar PostgreSQL', true);
