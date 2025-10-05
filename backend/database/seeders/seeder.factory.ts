import { faker } from '@faker-js/faker';
import { UserRole, UserStatus, Permission } from '../../src/entities/user.entity';
import { ContractOperationType, ContractStatus } from '../../src/entities/contract.entity';
import { PropertyStatus, PropertyOperationType } from '../../src/entities/property.entity';
import * as bcrypt from 'bcrypt';
import {
  PersonSeed,
  UserSeed,
  PropertySeed,
  ContractSeed,
  DocumentTypeSeed,
  PropertyTypeSeed,
  TeamMemberSeed,
  TestimonialSeed,
  AboutUsSeed,
  ArticleSeed,
  MultimediaSeed
} from './seeder.types';

export class SeederFactory {
  static createRandomPerson(): PersonSeed {
    return {
      name: faker.person.fullName(),
      dni: faker.string.numeric(8),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      verified: faker.datatype.boolean(),
      verificationRequest: faker.helpers.arrayElement([undefined, faker.date.past()]),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomUser(): UserSeed {
    const roles = Object.values(UserRole);
    const statuses = Object.values(UserStatus);
    const permissions = Object.values(Permission);

    return {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('password123', 10),
      role: faker.helpers.arrayElement(roles),
      status: faker.helpers.arrayElement(statuses),
      permissions: faker.helpers.arrayElements(permissions, faker.number.int({ min: 1, max: 5 })),
      personalInfo: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        avatar: faker.image.avatar()
      },
      lastLogin: faker.date.past(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomProperty(): PropertySeed {
    const priceCLP = faker.number.int({ min: 50000000, max: 500000000 });
    const ufValue = 35000; // Valor aproximado de la UF
    
    return {
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(Object.values(PropertyStatus)),
      operation: faker.helpers.arrayElement(Object.values(PropertyOperationType)),
      priceCLP: priceCLP,
      priceUF: Math.round((priceCLP / ufValue) * 100) / 100,
      seoTitle: faker.lorem.sentence(),
      seoDescription: faker.lorem.paragraph(),
      publicationDate: faker.date.recent(),
      bathrooms: faker.number.int({ min: 1, max: 4 }),
      bedrooms: faker.number.int({ min: 1, max: 6 }),
      builtSquareMeters: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
      landSquareMeters: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
      parkingSpaces: faker.number.int({ min: 0, max: 3 }),
      regionCommune: {
        region: faker.location.state(),
        communes: [faker.location.city()]
      },
      latitude: faker.number.float({ min: -90, max: 90, fractionDigits: 6 }),
      longitude: faker.number.float({ min: -180, max: 180, fractionDigits: 6 }),
      multimedia: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        url: faker.image.url(),
        type: faker.helpers.arrayElement(['IMAGE', 'VIDEO']),
        description: faker.lorem.sentence()
      })),
      propertyRole: faker.helpers.arrayElement(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'])
    };
  }

  static createRandomContract(): ContractSeed {
    return {
      operation: faker.helpers.arrayElement(Object.values(ContractOperationType)),
      status: faker.helpers.arrayElement(Object.values(ContractStatus)),
      endDate: faker.date.future(),
      amount: faker.number.int({ min: 10000, max: 1000000 }),
      commissionPercent: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      commissionAmount: faker.number.int({ min: 1000, max: 50000 }),
      payments: [],
      documents: [],
      people: [],
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomMultimedia() {
    return {
      url: faker.image.url(),
      type: faker.helpers.arrayElement(['IMAGE', 'VIDEO', 'DOCUMENT']),
      title: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }

  static createRandomDocumentType() {
    return {
      name: faker.helpers.arrayElement([
        'DNI',
        'Passport',
        'Driver License',
        'Property Title',
        'Contract',
        'Insurance Policy',
        'Tax Declaration'
      ]),
      description: faker.lorem.sentence(),
      required: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }

  static createRandomPropertyType() {
    return {
      name: faker.helpers.arrayElement([
        'House',
        'Apartment',
        'Condo',
        'Land',
        'Commercial',
        'Office',
        'Industrial'
      ]),
      description: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }

  static createRandomTeamMember() {
    return {
      name: faker.person.fullName(),
      position: faker.person.jobTitle(),
      bio: faker.lorem.paragraph(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }

  static createRandomTestimonial() {
    return {
      author: faker.person.fullName(),
      content: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
      isApproved: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }

  static createRandomAboutUs() {
    return {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(3),
      mission: faker.lorem.paragraph(),
      vision: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }

  static createRandomArticle() {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(5),
      excerpt: faker.lorem.paragraph(),
      isPublished: faker.datatype.boolean(),
      publishDate: faker.date.past(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }
}