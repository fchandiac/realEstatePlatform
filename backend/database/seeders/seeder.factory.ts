import { faker } from '@faker-js/faker';
import { UserRole, UserStatus, Permission } from '../../src/entities/user.entity';
import { ContractOperationType, ContractStatus } from '../../src/entities/contract.entity';
import { PropertyStatus } from '../../src/common/enums/property-status.enum';
import { PropertyOperationType } from '../../src/common/enums/property-operation-type.enum';
import { CurrencyPriceEnum } from '../../src/entities/property.entity';
import { RegionEnum } from '../../src/common/regions/regions.enum';
import { ComunaEnum } from '../../src/common/regions/comunas.enum';
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
  MultimediaSeed,
  IdentitySeed
} from './seeder.types';

export class SeederFactory {
  static createAdminUser(): UserSeed {
    return {
      username: 'admin',
      email: 'admin@re.cl',
      password: bcrypt.hashSync('7890', 10),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      permissions: Object.values(Permission),
      personalInfo: {
        firstName: 'Admin',
        lastName: 'User',
        phone: '',
        avatarUrl: ''
      },
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  private static usedPropertyTypes = new Set<string>();
  private static usedDocumentTypes = new Set<string>();
  static createRandomPerson(): PersonSeed {
    return {
      name: faker.person.fullName(),
      dni: faker.string.numeric(8),
      address: faker.location.streetAddress(),
      phone: faker.string.numeric(9),
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
        avatarUrl: faker.image.avatar()
      },
      lastLogin: faker.date.past(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomProperty(): PropertySeed {
    const priceCLP = faker.number.int({ min: 50000000, max: 500000000 });
    const ufValue = 35000; // Valor aproximado de la UF
    const status = faker.helpers.arrayElement(Object.values(PropertyStatus));
    const isPreApproved = status === PropertyStatus.PRE_APPROVED;

    return {
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      internalNotes: faker.lorem.paragraph(),
      status: status,
      operationType: faker.helpers.arrayElement(Object.values(PropertyOperationType)),
      price: priceCLP,
      currencyPrice: CurrencyPriceEnum.CLP,
      seoTitle: faker.lorem.sentence(),
      seoDescription: faker.lorem.paragraph(),
      publicationDate: isPreApproved ? undefined : faker.date.recent(), // Pre-approved properties can't have publication date
      bathrooms: faker.number.int({ min: 1, max: 4 }),
      bedrooms: faker.number.int({ min: 1, max: 6 }),
      builtSquareMeters: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
      landSquareMeters: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
      parkingSpaces: faker.number.int({ min: 0, max: 3 }),
      floors: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10 }), { probability: 0.7 }), // Some null
      constructionYear: faker.helpers.maybe(() => faker.number.int({ min: 1950, max: 2025 }), { probability: 0.8 }), // Some null
      state: faker.helpers.arrayElement(Object.values(RegionEnum)),
      city: faker.helpers.arrayElement(Object.values(ComunaEnum)),
      latitude: faker.number.float({ min: -90, max: 90, fractionDigits: 6 }),
      longitude: faker.number.float({ min: -180, max: 180, fractionDigits: 6 }),
      // propertyType will be assigned in the seeder after property types are created
      postRequest: faker.helpers.maybe(() => ({
        message: faker.lorem.paragraph(),
        contactInfo: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number()
        },
        requestedAt: faker.date.recent()
      }), { probability: 0.3 }), // Some properties have post requests
      isFeatured: faker.helpers.maybe(() => true, { probability: 0.2 }), // Some properties are featured
      views: faker.helpers.maybe(() => 
        Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
          userId: faker.string.uuid(),
          viewedAt: faker.date.recent(),
          duration: faker.number.int({ min: 10, max: 300 }) // seconds
        })), { probability: 0.4 }
      ), // Some properties have view history
      deletedAt: undefined // Soft delete column initialized as undefined
    };
  }

  static createRandomContract(): ContractSeed {
    return {
      operation: faker.helpers.arrayElement(Object.values(ContractOperationType)),
      status: faker.helpers.arrayElement(Object.values(ContractStatus)),
      endDate: faker.date.future(),
      amount: faker.number.int({ min: 10000, max: 1000000 }),
      commissionPercent: faker.number.float({ min: 0.01, max: 0.1, fractionDigits: 2 }),
      commissionAmount: faker.number.int({ min: 1000, max: 50000 }),
      payments: [],
      documents: [],
      people: [],
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
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
    const possibleTypes = [
      'DNI',
      'Passport',
      'Driver License',
      'Property Title',
      'Contract',
      'Insurance Policy',
      'Tax Declaration'
    ].filter(type => !this.usedDocumentTypes.has(type));

    if (possibleTypes.length === 0) {
      throw new Error('No more unique document types available');
    }

    const selectedType = faker.helpers.arrayElement(possibleTypes);
    this.usedDocumentTypes.add(selectedType);

    return {
      name: selectedType,
      description: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }

  static createRandomPropertyType() {
    const possibleTypes = [
      'House',
      'Apartment',
      'Condo',
      'Land',
      'Commercial',
      'Office',
      'Industrial',
      'Retail',
      'Warehouse',
      'Mixed Use',
      'Multi-Family',
      'Single Family',
      'Townhouse',
      'Villa',
      'Studio'
    ].filter(type => !this.usedPropertyTypes.has(type));

    if (possibleTypes.length === 0) {
      throw new Error('No more unique property types available');
    }

    const selectedType = faker.helpers.arrayElement(possibleTypes);
    this.usedPropertyTypes.add(selectedType);

    return {
      name: selectedType,
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
      phone: `+56 9 ${faker.string.numeric(4)} ${faker.string.numeric(4)}`,
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: null
    };
  }

  static createRandomTestimonial(): TestimonialSeed {
    return {
      text: faker.lorem.paragraph(),
      name: faker.person.fullName(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomAboutUs() {
    return {
      bio: faker.company.catchPhrase() + '\n\n' + faker.lorem.paragraphs(3),
      mision: faker.lorem.paragraph(),
      vision: faker.lorem.paragraph(),
      multimediaUrl: faker.image.url(),
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

  static createRandomIdentity(): IdentitySeed {
    const socialMedia = {
      instagram: {
        url: faker.helpers.maybe(() => `https://instagram.com/${faker.internet.username()}`, { probability: 0.7 }),
        available: faker.datatype.boolean()
      },
      facebook: {
        url: faker.helpers.maybe(() => `https://facebook.com/${faker.internet.username()}`, { probability: 0.6 }),
        available: faker.datatype.boolean()
      },
      linkedin: {
        url: faker.helpers.maybe(() => `https://linkedin.com/in/${faker.internet.username()}`, { probability: 0.5 }),
        available: faker.datatype.boolean()
      },
      youtube: {
        url: faker.helpers.maybe(() => `https://youtube.com/channel/${faker.string.uuid()}`, { probability: 0.4 }),
        available: faker.datatype.boolean()
      }
    };

    const partnerships = Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      logoUrl: faker.helpers.maybe(() => `uploads/web/partnerships/${faker.system.fileName()}.png`, { probability: 0.8 })
    }));

    return {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      phone: `+56 9 ${faker.string.numeric(4)} ${faker.string.numeric(4)}`,
      mail: faker.internet.email(),
      businessHours: 'Lunes a Viernes: 9:00 - 18:00\nSábado: 9:00 - 13:00\nDomingo: Cerrado',
      urlLogo: faker.helpers.maybe(() => `uploads/web/logos/${faker.system.fileName()}.png`, { probability: 0.9 }),
      socialMedia: socialMedia,
      partnerships: partnerships.length > 0 ? partnerships : undefined,
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: undefined
    };
  }
}