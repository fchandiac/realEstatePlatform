# users.integration.spec.ts - Diagnóstico de fallo

## Resumen
El test `users.integration.spec.ts` falla en el hook `beforeAll` por problemas de conexión a la base de datos; esto impide alcanzar la fase de autenticación donde se observaba un conflicto entre JWE y JWT plano.

## Evidencia observada
- Error: `Access denied for user 'test_user'@'localhost' (using password: YES)` desde el driver mysql2.
- Mensaje adicional: "Exceeded timeout of 5000 ms for a hook" indicando que `beforeAll` no terminó.

## Causas probables
1. Credenciales inválidas en `.env.test` (usuario/contraseña incorrectos). 
2. La cuenta de BD `test_user` no tiene permisos desde `localhost`.
3. La base de datos no está corriendo o no acepta conexiones desde el host.

## Acciones recomendadas
1. Verificar `backend/.env.test` y credenciales.  
2. Levantar una instancia MySQL de prueba (Docker) con credenciales coincidentes: 

```yaml
services:
  mysql-test:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: realestate_test
      MYSQL_USER: test_user
      MYSQL_PASSWORD: test_pass
    ports:
      - '3306:3306'
```

3. Alternativa temporal: cambiar configuración de pruebas a SQLite in-memory para ejecutar rápidamente.

## Estado actual
- JWE vs JWT: mitigado parcialmente con mock en test util.
- DB: bloqueante. Resolver DB permitirá validar la autenticación y confirmar que la solución JWT se comporta correctamente.
