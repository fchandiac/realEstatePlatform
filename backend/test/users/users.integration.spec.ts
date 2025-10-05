import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../src/modules/users/users.module';
import { AuthModule } from '../../src/auth/auth/auth.module';
import { User, UserRole, UserStatus } from '../../src/entities/user.entity';
import { AuditLog } from '../../src/entities/audit-log.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditModule } from '../../src/audit/audit.module';

describe('UsersController (integration)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let adminToken: string;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [User, AuditLog],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
        AuthModule,
        AuditModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Crear un usuario admin para las pruebas
    // Limpiar cualquier dato previo
    await userRepository.delete({ email: 'admin.test@example.com' });

    // Crear usuario admin
    const adminUser = userRepository.create({
      username: 'admin.test',
      email: 'admin.test@example.com',
      role: 'ADMIN',
      status: 'ACTIVE'
    } as Partial<User>);
    await adminUser.setPassword('Admin123!');
    await userRepository.save(adminUser);

    // Obtener token de admin
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'admin.test@example.com',
        password: 'Admin123!'
      });

    adminToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await userRepository.delete({ email: 'admin.test@example.com' });
    await userRepository.delete({ email: 'test.user@example.com' });
    await app.close();
  });

  describe('POST /users', () => {
    it('debe crear un nuevo usuario', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test.user@example.com',
        password: 'Test123!',
        role: UserRole.COMMUNITY,
        permissions: []
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.role).toBe(UserRole.COMMUNITY);
      expect(response.body).not.toHaveProperty('password');

      testUserId = response.body.id;
    });

    it('debe fallar al crear un usuario con email duplicado', async () => {
      const duplicateUser = {
        username: 'testuser2',
        email: 'test.user@example.com', // Email duplicado
        password: 'Test123!',
        role: 'USER',
        status: 'ACTIVE'
      };

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateUser)
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('debe obtener la lista de usuarios', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('debe obtener un usuario por ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(testUserId);
    });

    it('debe fallar al buscar un ID que no existe', async () => {
      await request(app.getHttpServer())
        .get('/users/99999999-9999-9999-9999-999999999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('debe actualizar un usuario existente', async () => {
      const updateData = {
        username: 'updateduser',
        status: 'INACTIVE'
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.username).toBe(updateData.username);
      expect(response.body.status).toBe(updateData.status);
    });
  });

  describe('DELETE /users/:id', () => {
    it('debe eliminar un usuario existente', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verificar que el usuario fue eliminado
      await request(app.getHttpServer())
        .get(`/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});