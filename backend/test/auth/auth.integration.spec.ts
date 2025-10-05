import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../src/auth/auth/auth.module';
import { UsersModule } from '../../src/modules/users/users.module';
import { User } from '../../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Utiliza variables de entorno reales para la conexión

describe('AuthController (integration)', () => {
  jest.setTimeout(20000); // Aumenta el timeout global para conexiones lentas
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [User],
          synchronize: true, // Solo para pruebas, no usar en producción
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    // Limpia los usuarios de prueba
    await userRepository.delete({ email: 'test.integration@example.com' });
    await app.close();
  });

  it('debe registrar y loguear un usuario real', async () => {
    // 1. Crear usuario directamente en la base de datos
    const password = 'Test1234!';
    const user = userRepository.create({
      username: 'testintegration',
      email: 'test.integration@example.com',
      password: '', // será seteado por setPassword
      status: 'ACTIVE',
      role: 'COMMUNITY',
    } as Partial<User>);
    await user.setPassword(password);
    await userRepository.save(user);

    // 2. Hacer login vía API
    const res = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: 'test.integration@example.com', password })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user.email).toBe('test.integration@example.com');
  });
});
