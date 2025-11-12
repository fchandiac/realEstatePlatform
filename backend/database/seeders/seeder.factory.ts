import { faker } from '@faker-js/faker';
import { UserRole, UserStatus, Permission } from '../../src/entities/user.entity';
import { ContractOperationType, ContractStatus } from '../../src/entities/contract.entity';
import { PropertyStatus } from '../../src/common/enums/property-status.enum';
import { PropertyOperationType } from '../../src/common/enums/property-operation-type.enum';
import { CurrencyPriceEnum } from '../../src/entities/property.entity';
import { RegionEnum } from '../../src/common/regions/regions.enum';
import { ComunaEnum } from '../../src/common/regions/comunas.enum';
import { MultimediaFormat, MultimediaType } from '../../src/entities/multimedia.entity';
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
  IdentitySeed,
  SlideSeed
} from './seeder.types';
import { BlogArticle, BlogCategory } from '../../src/entities/blog-article.entity';

export class SeederFactory {
  private static latinFirstNames = [
    'Marco', 'Lucia', 'Antonio', 'Carmen', 'Diego', 'Rosa', 'Felipe', 'Isabella',
    'Ricardo', 'Gabriela', 'Fernando', 'Valentina', 'Alberto', 'Matilde', 'Carlos',
    'Francesca', 'Javier', 'Antonia', 'Manuel', 'Lorena', 'Enrique', 'Silvia',
    'Rodrigo', 'Catalina', 'Guillermo', 'Martina', 'Julio', 'Adriana', 'Salvador',
    'Emilia', 'Andrés', 'Beatriz', 'Pedro', 'Magdalena', 'Jorge', 'Constanza',
    'Raúl', 'Soledad', 'Víctor', 'Magdalena', 'Ernesto', 'Amparo'
  ];

  private static latinLastNames = [
    'Romano', 'Moretti', 'Rossini', 'Benedetti', 'Fontana', 'Toscani', 'Rinaldi',
    'Colombo', 'Giordano', 'Fabbri', 'Negri', 'Palmieri', 'Rossi', 'Lombardi',
    'Marino', 'Ferretti', 'Santoro', 'Marini', 'Conte', 'Rizzo', 'Bianchi',
    'Gatti', 'Neri', 'Marchetti', 'Taverna', 'Valentini', 'Paggi', 'Barbieri',
    'Conti', 'De Luca', 'Giulio', 'Leone', 'Vitale', 'Simone'
  ];

  private static companyNames = [
    'Inmobiliaria Real Estate',
    'Proyectos Inmobiliarios Chile',
    'Casa y Hogar SA',
    'Soluciones Habitacionales',
    'Grupo Inmobiliario Latino',
    'Propiedades Premium',
    'Asesoría Inmobiliaria Total',
    'Mercado Inmobiliario Nacional',
    'Expertos en Vivienda',
    'Desarrollo Urbano Latino'
  ];

  private static getRandomLatinName(): string {
    const firstName = faker.helpers.arrayElement(this.latinFirstNames);
    const lastName = faker.helpers.arrayElement(this.latinLastNames);
    return `${firstName} ${lastName}`;
  }

  private static getRandomCompanyName(): string {
    return faker.helpers.arrayElement(this.companyNames);
  }

  static createAdminUser(): UserSeed {
    return {
      username: 'admin',
      email: 'admin@re.cl',
      password: bcrypt.hashSync('7890', 10),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      permissions: Object.values(Permission),
      personalInfo: {
        firstName: 'Administrador',
        lastName: 'Sistema',
        phone: '',
        avatarUrl: undefined
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
      name: this.getRandomLatinName(),
      dni: faker.string.numeric(8),
      address: faker.location.streetAddress(),
      phone: '+56 9 ' + faker.string.numeric(8),
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
    const nameParts = this.getRandomLatinName().split(' ');

    return {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('password123', 10),
      role: faker.helpers.arrayElement(roles),
      status: faker.helpers.arrayElement(statuses),
      permissions: faker.helpers.arrayElements(permissions, faker.number.int({ min: 1, max: 5 })),
      personalInfo: {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        phone: '+56 9 ' + faker.string.numeric(8),
        avatarUrl: undefined
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
        contactName: this.getRandomLatinName(),
        contactEmail: faker.internet.email(),
        contactPhone: '+56 9 ' + faker.string.numeric(8),
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
      format: faker.helpers.arrayElement(Object.values(MultimediaFormat)),
      type: faker.helpers.arrayElement(Object.values(MultimediaType)),
      filename: faker.system.fileName(),
      fileSize: faker.number.int({ min: 1000, max: 5000000 }),
      seoTitle: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomDocumentType() {
    const possibleTypes = [
      'Cédula de Identidad',
      'Pasaporte',
      'Licencia de Conducir',
      'Título de Propiedad',
      'Contrato',
      'Póliza de Seguros',
      'Declaración de Impuestos'
    ].filter(type => !this.usedDocumentTypes.has(type));

    if (possibleTypes.length === 0) {
      throw new Error('No hay más tipos de documentos únicos disponibles');
    }

    const selectedType = faker.helpers.arrayElement(possibleTypes);
    this.usedDocumentTypes.add(selectedType);

    return {
      name: selectedType,
      description: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomPropertyType() {
    const possibleTypes = [
      'Casa',
      'Apartamento',
      'Condominio',
      'Terreno',
      'Comercial',
      'Oficina',
      'Industrial',
      'Retail',
      'Bodega',
      'Uso Mixto',
      'Multi-Familiar',
      'Unifamiliar',
      'Townhouse',
      'Villa',
      'Estudio'
    ].filter(type => !this.usedPropertyTypes.has(type));

    if (possibleTypes.length === 0) {
      throw new Error('No hay más tipos de propiedades únicos disponibles');
    }

    const selectedType = faker.helpers.arrayElement(possibleTypes);
    this.usedPropertyTypes.add(selectedType);

    return {
      name: selectedType,
      description: faker.lorem.sentence(),
      hasBedrooms: faker.datatype.boolean(),
      hasBathrooms: faker.datatype.boolean(),
      hasBuiltSquareMeters: faker.datatype.boolean(),
      hasLandSquareMeters: faker.datatype.boolean(),
      hasParkingSpaces: faker.datatype.boolean(),
      hasFloors: faker.datatype.boolean(),
      hasConstructionYear: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomTeamMember() {
    const positions = [
      'Agente Inmobiliario',
      'Gestor de Propiedades',
      'Especialista en Ventas',
      'Asesor Inmobiliario',
      'Coordinador de Contratos',
      'Evaluador de Propiedades',
      'Director de Ventas',
      'Agente Senior'
    ];

    return {
      name: this.getRandomLatinName(),
      position: faker.helpers.arrayElement(positions),
      bio: faker.lorem.paragraph(),
      email: faker.internet.email(),
      phone: `+56 9 ${faker.string.numeric(4)} ${faker.string.numeric(4)}`,
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createRandomTestimonial(): TestimonialSeed {
    return {
      content: faker.lorem.paragraph(),
      name: this.getRandomLatinName(),
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
      updatedAt: new Date()
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
      updatedAt: new Date()
    };
  }

  static createRandomBlogArticle() {
    return {
      title: faker.lorem.sentence(),
      subtitle: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(5),
      category: faker.helpers.arrayElement(Object.values(BlogCategory)),
      imageUrl: faker.helpers.maybe(() => `/uploads/blog/${faker.system.fileName()}.jpg`, { probability: 0.8 }),
      publishedAt: faker.date.past(),
      isActive: faker.helpers.weightedArrayElement([
        { weight: 0.9, value: true },
        { weight: 0.1, value: false }
      ]),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      deletedAt: undefined
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
      name: this.getRandomCompanyName(),
      description: faker.lorem.paragraph(),
      logoUrl: faker.helpers.maybe(() => `uploads/web/partnerships/${faker.system.fileName()}.png`, { probability: 0.8 })
    }));

    return {
      name: this.getRandomCompanyName(),
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

  static createRandomSlide(): SlideSeed {
    const slideTemplates = [
      {
        title: '¡Vende tu Propiedad con Nosotros!',
        description: 'Obtén la mejor valorización y vende rápido con nuestro equipo de expertos.',
        linkUrl: '/properties/sale'
      },
      {
        title: 'Encuentra tu Hogar Ideal',
        description: 'Miles de propiedades disponibles en las mejores ubicaciones de la ciudad.',
        linkUrl: '/properties/search'
      },
      {
        title: 'Arriendo Seguro y Confiable',
        description: 'Propiedades verificadas con contratos seguros y asesoría legal completa.',
        linkUrl: '/properties/rent'
      },
      {
        title: 'Asesoría Inmobiliaria Premium',
        description: 'Expertos en el mercado inmobiliario te guían en cada paso de tu inversión.',
        linkUrl: '/services/advisory'
      },
      {
        title: 'Inversión Inmobiliaria Inteligente',
        description: 'Descubre las mejores oportunidades de inversión en el sector inmobiliario.',
        linkUrl: '/investment'
      }
    ];

    const template = faker.helpers.arrayElement(slideTemplates);
    
    return {
      title: template.title,
      description: template.description,
      multimediaUrl: faker.helpers.maybe(() => `/uploads/slides/slide-${faker.string.alphanumeric(8)}.jpg`, { probability: 0.8 }),
      linkUrl: template.linkUrl,
      duration: faker.number.int({ min: 3, max: 7 }),
      startDate: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.7 }),
      endDate: faker.helpers.maybe(() => faker.date.future(), { probability: 0.7 }),
      order: faker.number.int({ min: 1, max: 10 }),
      isActive: faker.helpers.weightedArrayElement([
        { weight: 0.8, value: true },
        { weight: 0.2, value: false }
      ]),
      createdAt: faker.date.past(),
      updatedAt: new Date()
    };
  }

  static createExampleSlides(): SlideSeed[] {
    return [
      {
        title: '¡Vende tu Propiedad con Nosotros!',
        description: 'Obtén la mejor valorización y vende rápido con nuestro equipo de expertos.',
        multimediaUrl: '/uploads/slides/slide-venta.jpg',
        linkUrl: '/properties/sale',
        duration: 5,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Encuentra tu Hogar Ideal',
        description: 'Miles de propiedades disponibles en las mejores ubicaciones de la ciudad.',
        multimediaUrl: '/uploads/slides/slide-hogar.jpg',
        linkUrl: '/properties/search',
        duration: 4,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Arriendo Seguro y Confiable',
        description: 'Propiedades verificadas con contratos seguros y asesoría legal completa.',
        multimediaUrl: '/uploads/slides/slide-arriendo.jpg',
        linkUrl: '/properties/rent',
        duration: 3,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 días
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}