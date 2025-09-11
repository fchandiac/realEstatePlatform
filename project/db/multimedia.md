
# MULTIMEDIA

| Campo     | Tipo de Dato                                                                 | NULL | Por Defecto | Descripción                                 |
|-----------|------------------------------------------------------------------------------|------|-------------|---------------------------------------------|
| id        | UUID (PK)                                                                   | No   | -           | Identificador único.                        |
| format    | ENUM('IMG', 'VIDEO')                                                        | No   | -           | Formato del archivo.                        |
| type      | ENUM('CEDULA_FRONT', 'CEDULA_REAR', 'SLIDE', 'LOGO', 'STAFF', 'PROPERTY_IMG', 'PROPERTY_VIDEO') | No   | -           | Tipo de uso del archivo.                    |
| url       | VARCHAR                                                                     | No   | -           | URL del archivo en servidor.                |
| seoTitle  | VARCHAR                                                                     | Sí   | -           | Título optimizado para SEO.                 |
| filename  | VARCHAR                                                                     | No   | -           | Nombre del archivo.                         |
| fileSize  | INT                                                                         | No   | -           | Tamaño del archivo en bytes/kb.             |

## Métodos asociados a la entidad Multimedia

| Método           | Descripción                                              |
|------------------|----------------------------------------------------------|
| create           | Crea un nuevo archivo multimedia.                        |
| findAll          | Obtiene la lista de todos los archivos multimedia.       |
| findOne          | Obtiene un archivo multimedia por su identificador único.|
| update           | Actualiza los datos de un archivo multimedia existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). |
| delete           | Elimina un archivo multimedia del sistema.               |
| getUrl           | Obtiene la URL pública del archivo multimedia.           |
| setSeoTitle      | Asigna o actualiza el título SEO del archivo.            |
| linkToEntity     | Relaciona el archivo multimedia con otra entidad (persona, propiedad, etc.). |
| unlinkFromEntity | Elimina la relación del archivo multimedia con otra entidad. |
