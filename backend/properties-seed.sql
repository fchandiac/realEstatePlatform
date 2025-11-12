-- Insertar 10 propiedades de prueba
INSERT INTO properties (
  id, title, description, status, operationType, creatorUserId, assignedAgentId,
  price, currencyPrice, propertyTypeId, state, city, address, latitude, longitude,
  bedrooms, bathrooms, parkingSpaces, builtSquareMeters, landSquareMeters,
  constructionYear, floors, seoTitle, seoDescription, isFeatured, mainImageUrl
) VALUES
-- 1. Casa en Providencia
(UUID(), 'Hermosa Casa Moderna en Providencia',
 'Amplia casa de 3 pisos con jardín privado, piscina y vista panorámica a la cordillera. Excelente ubicación cerca de centros comerciales.',
 'PUBLISHED', 'SALE', 'c1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
 850000000, 'CLP', 'a1111111-1111-1111-1111-111111111111', 'Metropolitana de Santiago', 'Providencia',
 'Avenida Apoquindo 3456, Providencia', -33.41500000, -70.58300000,
 4, 3, 2, 350.00, 500.00, 2018, 3,
 'Casa Moderna Las Condes - Venta', 'Hermosa casa de 4 dormitorios en Las Condes con piscina y jardín', 1,
 'http://72.61.6.232:3000/public/properties/img/casa-las-condes-1.jpg'),

-- 2. Apartamento en Providencia
(UUID(), 'Moderno Apartamento en Providencia',
 'Apartamento de 2 dormitorios completamente amoblado, con terraza privada y vista a la ciudad. Cercano al metro.',
 'PUBLISHED', 'RENT', 'c1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
 850000, 'CLP', 'a2222222-2222-2222-2222-222222222222', 'Metropolitana de Santiago', 'Providencia',
 'Manuel Montt 567, Providencia', -33.43100000, -70.61100000,
 2, 2, 1, 85.00, NULL, 2020, 8,
 'Apartamento Providencia - Arriendo', 'Moderno apartamento de 2 dormitorios en Providencia', 0,
 'http://72.61.6.232:3000/public/properties/img/apartamento-providencia-1.jpg'),

-- 3. Oficina en Providencia
(UUID(), 'Oficina Corporativa en Centro Histórico',
 'Espaciosa oficina de 200m² en edificio moderno con ascensor, aire acondicionado central y estacionamiento subterráneo.',
 'PUBLISHED', 'SALE', 'c1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
 450000000, 'CLP', 'a3333333-3333-3333-3333-333333333333', 'Metropolitana de Santiago', 'Providencia',
 'Huérfanos 789, Providencia', -33.44200000, -70.65100000,
 NULL, 2, 5, 200.00, NULL, 2015, 12,
 'Oficina Centro Santiago - Venta', 'Oficina corporativa de 200m² en Santiago Centro', 1,
 'http://72.61.6.232:3000/public/properties/img/oficina-centro-1.jpg'),

-- 4. Local Comercial en Ñuñoa
(UUID(), 'Local Comercial en Ñuñoa',
 'Excelente local comercial de esquina con gran visibilidad, ideal para restaurante o tienda. Zona de alto tránsito peatonal.',
 'PUBLISHED', 'SALE', 'c1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
 280000000, 'CLP', 'a4444444-4444-4444-4444-444444444444', 'Metropolitana de Santiago', 'Ñuñoa',
 'Irarrázaval 1234 esquina, Ñuñoa', -33.45600000, -70.59600000,
 NULL, 1, 2, 120.00, NULL, 2010, 1,
 'Local Comercial Ñuñoa - Venta', 'Local comercial de esquina en Ñuñoa con alta visibilidad', 0,
 'http://72.61.6.232:3000/public/properties/img/local-nunoa-1.jpg'),

-- 5. Terreno en Ñuñoa
(UUID(), 'Terreno Urbano en Ñuñoa',
 'Terreno plano de 800m² en zona residencial consolidada, ideal para construcción de vivienda unifamiliar o multifamiliar.',
 'PUBLISHED', 'SALE', 'c1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
 150000000, 'CLP', 'a5555555-5555-5555-5555-555555555555', 'Metropolitana de Santiago', 'Ñuñoa',
 'Camino La Campiña 456, Ñuñoa', -33.44500000, -70.53500000,
 NULL, NULL, NULL, NULL, 800.00, NULL, NULL,
 'Terreno La Reina - Venta', 'Terreno urbano de 800m² en La Reina para construcción', 0,
 'http://72.61.6.232:3000/public/properties/img/terreno-la-reina-1.jpg'),

-- 6. Casa en Viña del Mar
(UUID(), 'Casa con Vista al Mar en Viña del Mar',
 'Hermosa casa de 3 dormitorios con vista panorámica al océano Pacífico. Jardín amplio y piscina climatizada.',
 'PUBLISHED', 'SALE', 'c1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
 650000000, 'CLP', 'a1111111-1111-1111-1111-111111111111', 'Valparaíso', 'Viña del Mar',
 'Avenida Marina 789, Viña del Mar', -33.02400000, -71.55100000,
 3, 2, 2, 280.00, 400.00, 2016, 2,
 'Casa Vista Mar Viña del Mar - Venta', 'Casa de 3 dormitorios con vista al mar en Viña del Mar', 1,
 'http://72.61.6.232:3000/public/properties/img/casa-vina-mar-1.jpg'),

-- 7. Apartamento en Concepción
(UUID(), 'Apartamento Moderno en Concepción',
 'Apartamento de 3 dormitorios en edificio con amenities: gimnasio, piscina y quincho. Excelente ubicación cerca del centro.',
 'PUBLISHED', 'RENT', 'c1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
 650000, 'CLP', 'a2222222-2222-2222-2222-222222222222', 'Biobío', 'Concepción',
 'Barros Arana 234, Concepción', -36.82700000, -73.05000000,
 3, 2, 1, 95.00, NULL, 2019, 6,
 'Apartamento Concepción - Arriendo', 'Moderno apartamento de 3 dormitorios en Concepción', 0,
 'http://72.61.6.232:3000/public/properties/img/apartamento-concepcion-1.jpg'),

-- 8. Bodega Industrial en Maipú
(UUID(), 'Bodega Industrial en Maipú',
 'Amplia bodega de 500m² con acceso directo a carretera, ideal para distribución y almacenamiento. Portón eléctrico y oficina incluida.',
 'PUBLISHED', 'SALE', 'c1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
 380000000, 'CLP', 'a6666666-6666-6666-6666-666666666666', 'Metropolitana de Santiago', 'Maipú',
 'Camino Lo Echevers 567, Maipú', -33.36500000, -70.72600000,
 NULL, 1, 4, 500.00, 600.00, 2012, 1,
 'Bodega Industrial Quilicura - Venta', 'Bodega de 500m² con acceso directo a carretera', 0,
 'http://72.61.6.232:3000/public/properties/img/bodega-quilicura-1.jpg'),

-- 9. Casa Comercial en La Florida
(UUID(), 'Casa Comercial en La Florida',
 'Propiedad mixta: vivienda en primer piso y local comercial en planta baja. Excelente para inversión con renta inmediata.',
 'PUBLISHED', 'SALE', 'c1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
 420000000, 'CLP', 'a7777777-7777-7777-7777-777777777777', 'Metropolitana de Santiago', 'La Florida',
 'Vicente Pérez Rosales 890, La Florida', -33.52200000, -70.59800000,
 3, 2, 2, 180.00, 250.00, 2014, 2,
 'Casa Comercial La Florida - Venta', 'Casa comercial con vivienda y local en La Florida', 0,
 'http://72.61.6.232:3000/public/properties/img/casa-comercial-florida-1.jpg'),

-- 10. Estacionamiento en Providencia
(UUID(), 'Estacionamiento Cubierto en Providencia',
 'Estacionamiento individual cubierto en edificio moderno con seguridad 24/7. Cercano a Plaza de Armas y metro.',
 'PUBLISHED', 'RENT', 'c1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
 150000, 'CLP', 'a8888888-8888-8888-8888-888888888888', 'Metropolitana de Santiago', 'Providencia',
 'Compañía 123, Providencia', -33.44100000, -70.65000000,
 NULL, NULL, 1, 25.00, NULL, 2018, NULL,
 'Estacionamiento Santiago Centro - Arriendo', 'Estacionamiento cubierto en Santiago Centro', 0,
 'http://72.61.6.232:3000/public/properties/img/estacionamiento-centro-1.jpg');