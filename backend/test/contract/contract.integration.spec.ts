import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { Property } from '../../src/entities/property.entity';
import { Contract } from '../../src/entities/contract.entity';

describe('ContractController (integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let testContractId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    // Login as admin to get token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: 'admin@realestate.com', password: '7890' });

    adminToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /contracts - debe crear un nuevo contrato', async () => {
    // Obtener un usuario y propiedad existentes de la base de datos
    const userRepository = dataSource.getRepository(User);
    const propertyRepository = dataSource.getRepository(Property);

    const user = await userRepository.findOne({ where: {} });
    const property = await propertyRepository.findOne({ where: {} });

    expect(user).toBeDefined();
    expect(property).toBeDefined();

    const contractData = {
      userId: user!.id,
      propertyId: property!.id,
      operation: 'COMPRAVENTA',
      status: 'IN_PROCESS',
      amount: 100000,
      commissionPercent: 5.0,
      commissionAmount: 5000,
      people: [{ personId: 'person-1', role: 'BUYER' }],
      description: 'Contrato de prueba para integración',
    };

    const response = await request(app.getHttpServer())
      .post('/contracts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(contractData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.operation).toBe(contractData.operation);
    expect(response.body.status).toBe(contractData.status);
    expect(response.body.amount).toBe(contractData.amount);

    testContractId = response.body.id;
  });

  it('GET /contracts - debe obtener la lista de contratos', async () => {
    const response = await request(app.getHttpServer())
      .get('/contracts')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /contracts/:id - debe obtener un contrato por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/contracts/${testContractId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.id).toBe(testContractId);
    expect(response.body.operation).toBe('COMPRAVENTA');
    expect(response.body.status).toBe('IN_PROCESS');
    expect(response.body.amount).toBe(100000);
  });

  it('PATCH /contracts/:id - debe actualizar un contrato existente', async () => {
    const updateData = {
      status: 'CLOSED',
      description: 'Contrato actualizado para pruebas',
    };

    const response = await request(app.getHttpServer())
      .patch(`/contracts/${testContractId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.status).toBe(updateData.status);
    expect(response.body.description).toBe(updateData.description);
  });

  it('DELETE /contracts/:id - debe eliminar un contrato existente', async () => {
    await request(app.getHttpServer())
      .delete(`/contracts/${testContractId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Verificar que ya no existe
    await request(app.getHttpServer())
      .get(`/contracts/${testContractId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('GET /contracts/:id - debe fallar al buscar un ID que no existe', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';

    await request(app.getHttpServer())
      .get(`/contracts/${nonExistentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
