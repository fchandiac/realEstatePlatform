# MULTIMEDIA Table Structure

| Campo     | Tipo de Dato                                                                 | NULL | Por Defecto | Descripción                                 |
|-----------|------------------------------------------------------------------------------|------|-------------|---------------------------------------------|
| id        | UUID (PK)                                                                   | No   | -           | Identificador único.                        |
| format    | ENUM('IMG', 'VIDEO')                                                        | No   | -           | Formato del archivo.                        |
| type      | ENUM('CEDULA_FRONT', 'CEDULA_REAR', 'SLIDE', 'LOGO', 'STAFF', 'PROPERTY_IMG', 'PROPERTY_VIDEO') | No   | -           | Tipo de uso del archivo.                    |
| url       | VARCHAR                                                                     | No   | -           | URL del archivo en servidor.       |
| seoTitle  | VARCHAR                                                                     | Sí   | -           | Título optimizado para SEO.                 |
| filename  | VARCHAR                                                                     | No   | -           | Nombre del archivo.                |
| fileSize  | INT                                                                         | No   | -           | Tamaño del archivo en bytes/kb.             |
