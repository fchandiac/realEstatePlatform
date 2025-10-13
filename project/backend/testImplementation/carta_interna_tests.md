Asunto: Informe interno - Fallos detectados en la suite de tests de integración

Resumen breve:
Durante la ejecución focalizada del test `users.integration.spec.ts` se detectaron dos problemas principales:

1) Conexión a la base de datos fallida: `Access denied for user 'test_user'@'localhost'` al iniciar TypeORM.
2) Problemas de autenticación (previos y parcialmente mitigados): conflicto entre JWE (producción) y JWT plano en tests; se aplicó un mock temporal para `JweService` y se forzó `NODE_ENV=test`.

Acciones realizadas:
- Modificación de `test/users/users.integration.spec.ts` para forzar `NODE_ENV='test'` y registrar un mock simple para `JweService` que emite JWT plano.
- Ejecución del test aislado con `npx jest test/users/users.integration.spec.ts --runInBand`.

Resultados:
- La suite falló en conexión a la base de datos antes de alcanzar la etapa de autenticación: TypeORM intenta conectar y recibe `Access denied` repetidamente.
- Como consecuencia, los hooks `beforeAll` excedieron el timeout y los tests quedaron abortados.

Recomendaciones inmediatas:
1. Verificar y actualizar las credenciales en `backend/.env.test` (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE). Asegurarse de que el usuario existe y tiene permisos desde `localhost`.
2. Alternativa rápida: para desarrollo local, ejecutar una instancia MySQL de prueba (docker-compose) con las credenciales previstas o cambiar temporalmente la configuración de tests a SQLite in-memory.
3. Re-ejecutar el test aislado tras corregir la DB para validar la mitigación del JWE/JWT.

Siguientes pasos propuestos (yo puedo ejecutar si confirmas):
- Actualizar `.env.test` con credenciales válidas o crear contenedor docker mysql y exportar variables.
- Re-run del test y generar logs. Si la conexión funciona, validar que el mock de JweService permite pasar autenticación y que no quedan otros bloqueos.

Fin del informe.
