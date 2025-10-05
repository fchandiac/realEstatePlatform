# Real Estate Platform Backend

Backend API para la plataforma inmobiliaria desarrollado con NestJS y TypeORM.

## Tecnologías

- **NestJS**: Framework de Node.js para aplicaciones server-side escalables
- **TypeORM**: ORM para TypeScript que soporta múltiples bases de datos
- **MySQL**: Base de datos relacional
- **class-validator**: Validación de datos
- **class-transformer**: Transformación de objetos

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=real_estate_platform

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Base de Datos

Asegúrate de tener MySQL corriendo y crear la base de datos especificada en las variables de entorno.

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar en modo producción
npm run build
npm run start:prod
```

## Estructura del Proyecto

```
src/
├── config/                 # Configuraciones
│   └── database.config.ts  # Configuración de TypeORM
├── entities/               # Entidades de base de datos
│   └── team-member.entity.ts
├── modules/                # Módulos de la aplicación
│   └── team-members/       # Módulo de miembros del equipo
│       ├── dto/            # Data Transfer Objects
│       ├── team-members.controller.ts
│       ├── team-members.service.ts
│       └── team-members.module.ts
├── app.controller.ts       # Controlador principal
├── app.module.ts          # Módulo principal
├── app.service.ts         # Servicio principal
└── main.ts                # Punto de entrada
```

## API Endpoints

### Team Members

- `GET /team-members` - Obtener todos los miembros del equipo
- `GET /team-members/:id` - Obtener un miembro específico
- `POST /team-members` - Crear un nuevo miembro
- `PATCH /team-members/:id` - Actualizar un miembro
- `DELETE /team-members/:id` - Eliminar un miembro (soft delete)

### Articles

- `GET /articles` - Obtener todos los artículos
- `GET /articles/:id` - Obtener un artículo específico
- `POST /articles` - Crear un nuevo artículo
- `PATCH /articles/:id` - Actualizar un artículo
- `DELETE /articles/:id` - Eliminar un artículo (soft delete)

**Categorías disponibles:** Comprar, Arrendar, Inversión, Decoración, Mercado

### Testimonials

- `GET /testimonials` - Obtener todos los testimonios
- `GET /testimonials/:id` - Obtener un testimonio específico
- `POST /testimonials` - Crear un nuevo testimonio
- `PATCH /testimonials/:id` - Actualizar un testimonio
- `DELETE /testimonials/:id` - Eliminar un testimonio (soft delete)

### Identities

- `GET /identities` - Obtener todas las identidades corporativas
- `GET /identities/:id` - Obtener una identidad específica
- `POST /identities` - Crear una nueva identidad corporativa
- `PATCH /identities/:id` - Actualizar una identidad
- `DELETE /identities/:id` - Eliminar una identidad (soft delete)

### About Us

- `GET /about-us` - Obtener toda la información corporativa
- `GET /about-us/:id` - Obtener información corporativa específica
- `POST /about-us` - Crear nueva información corporativa
- `PATCH /about-us/:id` - Actualizar información corporativa
- `DELETE /about-us/:id` - Eliminar información corporativa (soft delete)

### Users

- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener un usuario específico
- `GET /users/:id/profile` - Obtener perfil extendido del usuario
- `POST /users` - Crear un nuevo usuario
- `POST /users/login` - Autenticar usuario
- `PATCH /users/:id` - Actualizar un usuario
- `PATCH /users/:id/status` - Cambiar estado del usuario
- `PATCH /users/:id/role` - Asignar rol al usuario
- `PATCH /users/:id/permissions` - Modificar permisos del usuario
- `PATCH /users/:id/change-password` - Cambiar contraseña
- `DELETE /users/:id` - Eliminar un usuario (soft delete)

**Roles disponibles:** SUPERADMIN, ADMIN, AGENT, COMMUNITY
**Estados disponibles:** ACTIVE, INACTIVE, VACATION, LEAVE

### Properties

- `GET /properties` - Obtener todas las propiedades
- `GET /properties/:id` - Obtener una propiedad específica
- `GET /properties/creator/:creatorUserId` - Obtener propiedades por creador
- `GET /properties/agent/:agentId` - Obtener propiedades por agente asignado
- `POST /properties` - Crear una nueva propiedad
- `PATCH /properties/:id` - Actualizar una propiedad
- `PATCH /properties/:id/assign-agent` - Asignar agente a propiedad
- `DELETE /properties/:id` - Eliminar una propiedad (soft delete)

**Estados disponibles:** REQUEST, PRE-APPROVED, PUBLISHED, INACTIVE, SOLD, RENTED
**Operaciones disponibles:** VENTA, ARRIENDO

## Scripts Disponibles

- `npm run build` - Compilar el proyecto
- `npm run format` - Formatear código con Prettier
- `npm run start` - Iniciar en modo producción
- `npm run start:dev` - Iniciar en modo desarrollo con hot reload
- `npm run start:debug` - Iniciar en modo debug
- `npm run test` - Ejecutar tests
- `npm run test:cov` - Ejecutar tests con cobertura
- `npm run test:debug` - Ejecutar tests en modo debug
- `npm run test:e2e` - Ejecutar tests end-to-end

## Desarrollo

### Agregar nuevas entidades

1. Crear la entidad en `src/entities/`
2. Crear DTOs en `src/modules/[entity]/dto/`
3. Crear servicio en `src/modules/[entity]/[entity].service.ts`
4. Crear controlador en `src/modules/[entity]/[entity].controller.ts`
5. Crear módulo en `src/modules/[entity]/[entity].module.ts`
6. Importar el módulo en `app.module.ts`

### Migraciones

Para crear migraciones cuando cambies las entidades:

```bash
npm run typeorm:generate-migration -- --name=NombreDeLaMigracion
npm run typeorm:run-migrations
```

## Licencia

Este proyecto está bajo la Licencia MIT.
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
