import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { User } from './user.entity';
import { Multimedia, MultimediaFormat, MultimediaType } from './multimedia.entity';

describe('Person Entity', () => {
  let repository: Repository<Person>;
  let userRepository: Repository<User>;
  let multimediaRepository: Repository<Multimedia>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [Person, User, Multimedia],
          synchronize: false,
        }),
  TypeOrmModule.forFeature([Person, User, Multimedia]),
      ],
    }).compile();

    repository = module.get<Repository<Person>>(getRepositoryToken(Person));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    multimediaRepository = module.get<Repository<Multimedia>>(getRepositoryToken(Multimedia));
  });

  afterEach(async () => {
    // Clear in correct order to respect FK constraints
    try {
      await repository.clear(); // people
      await userRepository.clear();
      await multimediaRepository.clear();
    } catch (e) {
      // ignore cleanup errors
    }
  });

  it('should create a person instance', () => {
    const person = new Person();
    person.name = 'John Doe';
    person.dni = '12345678';
    expect(person.name).toBe('John Doe');
    expect(person.dni).toBe('12345678');
    expect(person.verified).toBe(false); // Default value
  });

  it('should handle relations', async () => {
    // Save related entities first to satisfy FK constraints
  const uniqueSuffix = Date.now().toString();
  const user: any = await userRepository.save(userRepository.create({ username: `u1_${uniqueSuffix}`, email: `u1_${uniqueSuffix}@example.com`, password: 'x' } as any));

  const multimedia: any = await multimediaRepository.save(multimediaRepository.create({ filename: 'f.jpg', url: '/tmp/f.jpg', fileSize: 123, format: MultimediaFormat.IMG, type: MultimediaType.DNI_FRONT } as any));

    const person = new Person();
    person.user = user;
    person.dniCardFront = multimedia;
    person.dniCardRear = multimedia;
    await repository.save(person);
    const saved = await repository.findOne({ where: { id: person.id }, relations: ['user', 'dniCardFront'] });
    expect(saved).toBeDefined();
    expect(saved!.user).toBeDefined();
    expect(saved!.dniCardFront).toBeDefined();
  });

  it('should enforce unique DNI', async () => {
    const person1 = new Person();
    person1.dni = 'unique-dni';
    await repository.save(person1);

    const person2 = new Person();
    person2.dni = 'unique-dni'; // Duplicate
    await expect(repository.save(person2)).rejects.toThrow(); // Should fail due to unique constraint
  });

  it('should allow null fields', () => {
    const person = new Person();
    expect(person.name).toBeUndefined();
    expect(person.verificationRequest).toBeUndefined();
    expect(person.verified).toBe(false);
  });
});