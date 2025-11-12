-- Seed data for real_estate_platform database

-- Clean existing data first (careful with order due to foreign keys)
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM identities;
DELETE FROM property_types;
DELETE FROM document_types;
DELETE FROM team_members;
DELETE FROM testimonials;
DELETE FROM articles;
DELETE FROM about_us;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS=1;

-- Insert Identity
INSERT INTO identities (id, name, address, phone, mail, businessHours, urlLogo) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Real Estate Platform', 'Calle Principal 123, Santiago, Chile', '+56223334444', 'info@realestate.cl', 'Lunes a Viernes 09:00-18:00', 'https://example.com/logo.png');

-- Insert Property Types
INSERT INTO property_types (id, name, description) VALUES
('a1111111-1111-1111-1111-111111111111', 'Casa', 'Vivienda unifamiliar independiente'),
('a2222222-2222-2222-2222-222222222222', 'Apartamento', 'Departamento en condominio'),
('a3333333-3333-3333-3333-333333333333', 'Oficina', 'Espacio comercial para oficinas'),
('a4444444-4444-4444-4444-444444444444', 'Local Comercial', 'Local para negocios'),
('a5555555-5555-5555-5555-555555555555', 'Terreno', 'Terreno para construcción'),
('a6666666-6666-6666-6666-666666666666', 'Bodega', 'Espacio para almacenamiento'),
('a7777777-7777-7777-7777-777777777777', 'Casa Comercial', 'Casa con uso comercial'),
('a8888888-8888-8888-8888-888888888888', 'Estacionamiento', 'Espacios de estacionamiento');

-- Insert Document Types
INSERT INTO document_types (id, name, description, available) VALUES
('b1111111-1111-1111-1111-111111111111', 'Escritura', 'Documento de propiedad', 1),
('b2222222-2222-2222-2222-222222222222', 'Certificado Conservador', 'Certificado del Conservador de Bienes Raíces', 1),
('b3333333-3333-3333-3333-333333333333', 'Plano', 'Plano catastral o arquitectónico', 1),
('b4444444-4444-4444-4444-444444444444', 'Avalúo', 'Avalúo fiscal de la propiedad', 1),
('b5555555-5555-5555-5555-555555555555', 'Contrato', 'Contrato de compraventa', 1);

-- Insert Users (with hashed passwords - password123)
INSERT INTO users (id, username, email, password, role, status, permissions, personId) VALUES
('c1111111-1111-1111-1111-111111111111', 'admin', 'admin@realestate.cl', '$2b$10$YkxKyEn2TKCaT2R7f5oF8OuVL6T4G8H8Q9J8K7L6M5N4O3P2Q1R0S', 'ADMIN', 'ACTIVE', '["ALL"]', NULL),
('c2222222-2222-2222-2222-222222222222', 'agent1', 'agent1@realestate.cl', '$2b$10$YkxKyEn2TKCaT2R7f5oF8OuVL6T4G8H8Q9J8K7L6M5N4O3P2Q1R0S', 'AGENT', 'ACTIVE', '["PROPERTY_MANAGE","CONTRACT_VIEW"]', NULL),
('c3333333-3333-3333-3333-333333333333', 'agent2', 'agent2@realestate.cl', '$2b$10$YkxKyEn2TKCaT2R7f5oF8OuVL6T4G8H8Q9J8K7L6M5N4O3P2Q1R0S', 'AGENT', 'ACTIVE', '["PROPERTY_MANAGE","CONTRACT_VIEW"]', NULL),
('c4444444-4444-4444-4444-444444444444', 'user1', 'user1@example.com', '$2b$10$YkxKyEn2TKCaT2R7f5oF8OuVL6T4G8H8Q9J8K7L6M5N4O3P2Q1R0S', 'COMMUNITY', 'ACTIVE', '["PROPERTY_VIEW"]', NULL),
('c5555555-5555-5555-5555-555555555555', 'user2', 'user2@example.com', '$2b$10$YkxKyEn2TKCaT2R7f5oF8OuVL6T4G8H8Q9J8K7L6M5N4O3P2Q1R0S', 'COMMUNITY', 'ACTIVE', '["PROPERTY_VIEW"]', NULL);

-- Insert About Us
INSERT INTO about_us (id, bio, mision, vision) VALUES
('d1111111-1111-1111-1111-111111111111', 
'Somos una plataforma líder en soluciones inmobiliarias en Chile con más de 10 años de experiencia conectando compradores y vendedores.',
'Facilitar el acceso a información inmobiliaria confiable y conectar a las personas con sus propiedades ideales.',
'Ser la plataforma inmobiliaria más confiable y utilizada en Chile.');

-- Insert Articles
INSERT INTO articles (id, title, text, category) VALUES
('e1111111-1111-1111-1111-111111111111', 'Consejos para Comprar Casa', 'En este artículo compartimos tips importantes para la compra de vivienda...', 'Comprar'),
('e2222222-2222-2222-2222-222222222222', 'Tendencias Inmobiliarias 2025', 'Las tendencias que marcarán el mercado inmobiliario en 2025...', 'Mercado'),
('e3333333-3333-3333-3333-333333333333', 'Financiamiento de Vivienda', 'Opciones de financiamiento disponibles para comprar tu vivienda...', 'Comprar'),
('e4444444-4444-4444-4444-444444444444', 'Renovación de Espacios', 'Ideas para renovar y mejorar tus espacios habitacionales...', 'Decoración'),
('e5555555-5555-5555-5555-555555555555', 'Inversión Inmobiliaria', 'Guía completa para inversiones en bienes raíces...', 'Inversión'),
('e6666666-6666-6666-6666-666666666666', 'Ubicaciones Estratégicas', 'Las mejores ubicaciones para vivir y invertir en Santiago...', 'Mercado');

-- Insert Team Members
INSERT INTO team_members (id, name, position, bio, mail, phone, multimediaUrl) VALUES
('f1111111-1111-1111-1111-111111111111', 'Juan García', 'Gerente General', 'Profesional con 15 años en el sector inmobiliario', 'juan@realestate.cl', '+56223334441', 'https://example.com/juan.jpg'),
('f2222222-2222-2222-2222-222222222222', 'María López', 'Directora Comercial', 'Experta en ventas y negociación inmobiliaria', 'maria@realestate.cl', '+56223334442', 'https://example.com/maria.jpg'),
('f3333333-3333-3333-3333-333333333333', 'Carlos Rodríguez', 'Agente Senior', 'Especialista en propiedades comerciales', 'carlos@realestate.cl', '+56223334443', 'https://example.com/carlos.jpg'),
('f4444444-4444-4444-4444-444444444444', 'Ana Martínez', 'Asesora Juridica', 'Abogada especializada en derecho inmobiliario', 'ana@realestate.cl', '+56223334444', 'https://example.com/ana.jpg'),
('f5555555-5555-5555-5555-555555555555', 'Roberto Silva', 'Tasador', 'Tasador acreditado y certificado', 'roberto@realestate.cl', '+56223334445', 'https://example.com/roberto.jpg'),
('f6666666-6666-6666-6666-666666666666', 'Patricia González', 'Agente de Propiedades', 'Profesional en búsqueda y asesoría de viviendas', 'patricia@realestate.cl', '+56223334446', 'https://example.com/patricia.jpg'),
('f7777777-7777-7777-7777-777777777777', 'Fernando Díaz', 'Especialista Financiero', 'Asesor en opciones de financiamiento', 'fernando@realestate.cl', '+56223334447', 'https://example.com/fernando.jpg'),
('f8888888-8888-8888-8888-888888888888', 'Lorena Vásquez', 'Coordinadora de Proyectos', 'Gestiona proyectos inmobiliarios complejos', 'lorena@realestate.cl', '+56223334448', 'https://example.com/lorena.jpg'),
('f9999999-9999-9999-9999-999999999999', 'Miguel Flores', 'Desarrollador', 'Especialista en proyectos de desarrollo inmobiliario', 'miguel@realestate.cl', '+56223334449', 'https://example.com/miguel.jpg'),
('fa111111-1111-1111-1111-111111111111', 'Cristina Rojas', 'Ejecutiva de Cuentas', 'Gestión de clientes corporativos y empresariales', 'cristina@realestate.cl', '+56223334450', 'https://example.com/cristina.jpg');

-- Insert Testimonials
INSERT INTO testimonials (id, content, name, position, isActive) VALUES
('g1111111-1111-1111-1111-111111111111', 'Excelente servicio, encontré mi casa en menos de un mes. Recomendado!', 'José Pérez', 'Cliente', 1),
('g2222222-2222-2222-2222-222222222222', 'Profesionales muy atentos y responsables con el proceso de compra', 'Isabel Sánchez', 'Cliente', 1),
('g3333333-3333-3333-3333-333333333333', 'Muy satisfecho con la asesoría y el trato recibido', 'Marco Álvarez', 'Cliente', 1),
('g4444444-4444-4444-4444-444444444444', 'Plataforma intuitiva y fácil de usar para buscar propiedades', 'Andrea Costa', 'Cliente', 1),
('g5555555-5555-5555-5555-555555555555', 'Buen equipo de profesionales dispuesto a ayudar', 'Raúl Mendoza', 'Cliente', 1),
('g6666666-6666-6666-6666-666666666666', 'Variedad de opciones y precios accesibles', 'Paula Ramírez', 'Cliente', 1),
('g7777777-7777-7777-7777-777777777777', 'Proceso transparente y sin sorpresas desagradables', 'David Molina', 'Cliente', 1),
('g8888888-8888-8888-8888-888888888888', 'Atención personalizada y profesional en todo momento', 'Verónica Torres', 'Cliente', 1);
