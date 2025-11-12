"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederFactory = void 0;
const faker_1 = require("@faker-js/faker");
const user_entity_1 = require("../../src/entities/user.entity");
const contract_entity_1 = require("../../src/entities/contract.entity");
const property_status_enum_1 = require("../../src/common/enums/property-status.enum");
const property_operation_type_enum_1 = require("../../src/common/enums/property-operation-type.enum");
const property_entity_1 = require("../../src/entities/property.entity");
const regions_enum_1 = require("../../src/common/regions/regions.enum");
const comunas_enum_1 = require("../../src/common/regions/comunas.enum");
const bcrypt = require("bcrypt");
const blog_article_entity_1 = require("../../src/entities/blog-article.entity");
class SeederFactory {
    static getRandomLatinName() {
        const firstName = faker_1.faker.helpers.arrayElement(this.latinFirstNames);
        const lastName = faker_1.faker.helpers.arrayElement(this.latinLastNames);
        return `${firstName} ${lastName}`;
    }
    static getRandomCompanyName() {
        return faker_1.faker.helpers.arrayElement(this.companyNames);
    }
    static createAdminUser() {
        return {
            username: 'admin',
            email: 'admin@re.cl',
            password: bcrypt.hashSync('7890', 10),
            role: user_entity_1.UserRole.ADMIN,
            status: user_entity_1.UserStatus.ACTIVE,
            permissions: Object.values(user_entity_1.Permission),
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
    static createRandomPerson() {
        return {
            name: this.getRandomLatinName(),
            dni: faker_1.faker.string.numeric(8),
            address: faker_1.faker.location.streetAddress(),
            phone: '+56 9 ' + faker_1.faker.string.numeric(8),
            email: faker_1.faker.internet.email(),
            verified: faker_1.faker.datatype.boolean(),
            verificationRequest: faker_1.faker.helpers.arrayElement([undefined, faker_1.faker.date.past()]),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date()
        };
    }
    static createRandomUser() {
        const roles = Object.values(user_entity_1.UserRole);
        const statuses = Object.values(user_entity_1.UserStatus);
        const permissions = Object.values(user_entity_1.Permission);
        const nameParts = this.getRandomLatinName().split(' ');
        return {
            username: faker_1.faker.internet.username(),
            email: faker_1.faker.internet.email(),
            password: bcrypt.hashSync('password123', 10),
            role: faker_1.faker.helpers.arrayElement(roles),
            status: faker_1.faker.helpers.arrayElement(statuses),
            permissions: faker_1.faker.helpers.arrayElements(permissions, faker_1.faker.number.int({ min: 1, max: 5 })),
            personalInfo: {
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(' '),
                phone: '+56 9 ' + faker_1.faker.string.numeric(8),
                avatarUrl: undefined
            },
            lastLogin: faker_1.faker.date.past(),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date()
        };
    }
    static createRandomProperty() {
        const priceCLP = faker_1.faker.number.int({ min: 50000000, max: 500000000 });
        const ufValue = 35000; // Valor aproximado de la UF
        const status = faker_1.faker.helpers.arrayElement(Object.values(property_status_enum_1.PropertyStatus));
        const isPreApproved = status === property_status_enum_1.PropertyStatus.PRE_APPROVED;
        return {
            title: faker_1.faker.lorem.words(3),
            description: faker_1.faker.lorem.paragraph(),
            internalNotes: faker_1.faker.lorem.paragraph(),
            status: status,
            operationType: faker_1.faker.helpers.arrayElement(Object.values(property_operation_type_enum_1.PropertyOperationType)),
            price: priceCLP,
            currencyPrice: property_entity_1.CurrencyPriceEnum.CLP,
            seoTitle: faker_1.faker.lorem.sentence(),
            seoDescription: faker_1.faker.lorem.paragraph(),
            publicationDate: isPreApproved ? undefined : faker_1.faker.date.recent(), // Pre-approved properties can't have publication date
            bathrooms: faker_1.faker.number.int({ min: 1, max: 4 }),
            bedrooms: faker_1.faker.number.int({ min: 1, max: 6 }),
            builtSquareMeters: faker_1.faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
            landSquareMeters: faker_1.faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
            parkingSpaces: faker_1.faker.number.int({ min: 0, max: 3 }),
            floors: faker_1.faker.helpers.maybe(() => faker_1.faker.number.int({ min: 1, max: 10 }), { probability: 0.7 }), // Some null
            constructionYear: faker_1.faker.helpers.maybe(() => faker_1.faker.number.int({ min: 1950, max: 2025 }), { probability: 0.8 }), // Some null
            state: faker_1.faker.helpers.arrayElement(Object.values(regions_enum_1.RegionEnum)),
            city: faker_1.faker.helpers.arrayElement(Object.values(comunas_enum_1.ComunaEnum)),
            latitude: faker_1.faker.number.float({ min: -90, max: 90, fractionDigits: 6 }),
            longitude: faker_1.faker.number.float({ min: -180, max: 180, fractionDigits: 6 }),
            // propertyType will be assigned in the seeder after property types are created
            postRequest: faker_1.faker.helpers.maybe(() => ({
                message: faker_1.faker.lorem.paragraph(),
                contactName: this.getRandomLatinName(),
                contactEmail: faker_1.faker.internet.email(),
                contactPhone: '+56 9 ' + faker_1.faker.string.numeric(8),
                requestedAt: faker_1.faker.date.recent()
            }), { probability: 0.3 }), // Some properties have post requests
            isFeatured: faker_1.faker.helpers.maybe(() => true, { probability: 0.2 }), // Some properties are featured
            views: faker_1.faker.helpers.maybe(() => Array.from({ length: faker_1.faker.number.int({ min: 1, max: 10 }) }, () => ({
                userId: faker_1.faker.string.uuid(),
                viewedAt: faker_1.faker.date.recent(),
                duration: faker_1.faker.number.int({ min: 10, max: 300 }) // seconds
            })), { probability: 0.4 }), // Some properties have view history
            deletedAt: undefined // Soft delete column initialized as undefined
        };
    }
    static createRandomContract() {
        return {
            operation: faker_1.faker.helpers.arrayElement(Object.values(contract_entity_1.ContractOperationType)),
            status: faker_1.faker.helpers.arrayElement(Object.values(contract_entity_1.ContractStatus)),
            endDate: faker_1.faker.date.future(),
            amount: faker_1.faker.number.int({ min: 10000, max: 1000000 }),
            commissionPercent: faker_1.faker.number.float({ min: 0.01, max: 0.1, fractionDigits: 2 }),
            commissionAmount: faker_1.faker.number.int({ min: 1000, max: 50000 }),
            payments: [],
            documents: [],
            people: [],
            description: faker_1.faker.lorem.paragraph(),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
        };
    }
    static createRandomMultimedia() {
        return {
            url: faker_1.faker.image.url(),
            type: faker_1.faker.helpers.arrayElement(['IMAGE', 'VIDEO', 'DOCUMENT']),
            title: faker_1.faker.lorem.words(2),
            description: faker_1.faker.lorem.sentence(),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
            deletedAt: null
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
        const selectedType = faker_1.faker.helpers.arrayElement(possibleTypes);
        this.usedDocumentTypes.add(selectedType);
        return {
            name: selectedType,
            description: faker_1.faker.lorem.sentence(),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
            deletedAt: null
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
        const selectedType = faker_1.faker.helpers.arrayElement(possibleTypes);
        this.usedPropertyTypes.add(selectedType);
        return {
            name: selectedType,
            description: faker_1.faker.lorem.sentence(),
            hasBedrooms: faker_1.faker.datatype.boolean(),
            hasBathrooms: faker_1.faker.datatype.boolean(),
            hasBuiltSquareMeters: faker_1.faker.datatype.boolean(),
            hasLandSquareMeters: faker_1.faker.datatype.boolean(),
            hasParkingSpaces: faker_1.faker.datatype.boolean(),
            hasFloors: faker_1.faker.datatype.boolean(),
            hasConstructionYear: faker_1.faker.datatype.boolean(),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
            deletedAt: null
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
            position: faker_1.faker.helpers.arrayElement(positions),
            bio: faker_1.faker.lorem.paragraph(),
            email: faker_1.faker.internet.email(),
            phone: `+56 9 ${faker_1.faker.string.numeric(4)} ${faker_1.faker.string.numeric(4)}`,
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
            deletedAt: null
        };
    }
    static createRandomTestimonial() {
        return {
            content: faker_1.faker.lorem.paragraph(),
            name: this.getRandomLatinName(),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date()
        };
    }
    static createRandomAboutUs() {
        return {
            bio: faker_1.faker.company.catchPhrase() + '\n\n' + faker_1.faker.lorem.paragraphs(3),
            mision: faker_1.faker.lorem.paragraph(),
            vision: faker_1.faker.lorem.paragraph(),
            multimediaUrl: faker_1.faker.image.url(),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
            deletedAt: null
        };
    }
    static createRandomArticle() {
        return {
            title: faker_1.faker.lorem.sentence(),
            content: faker_1.faker.lorem.paragraphs(5),
            excerpt: faker_1.faker.lorem.paragraph(),
            isPublished: faker_1.faker.datatype.boolean(),
            publishDate: faker_1.faker.date.past(),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
            deletedAt: null
        };
    }
    static createRandomBlogArticle() {
        return {
            title: faker_1.faker.lorem.sentence(),
            subtitle: faker_1.faker.lorem.sentence(),
            content: faker_1.faker.lorem.paragraphs(5),
            category: faker_1.faker.helpers.arrayElement(Object.values(blog_article_entity_1.BlogCategory)),
            imageUrl: faker_1.faker.helpers.maybe(() => `/uploads/blog/${faker_1.faker.system.fileName()}.jpg`, { probability: 0.8 }),
            publishedAt: faker_1.faker.date.past(),
            isActive: faker_1.faker.helpers.weightedArrayElement([
                { weight: 0.9, value: true },
                { weight: 0.1, value: false }
            ]),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
            deletedAt: undefined
        };
    }
    static createRandomIdentity() {
        const socialMedia = {
            instagram: {
                url: faker_1.faker.helpers.maybe(() => `https://instagram.com/${faker_1.faker.internet.username()}`, { probability: 0.7 }),
                available: faker_1.faker.datatype.boolean()
            },
            facebook: {
                url: faker_1.faker.helpers.maybe(() => `https://facebook.com/${faker_1.faker.internet.username()}`, { probability: 0.6 }),
                available: faker_1.faker.datatype.boolean()
            },
            linkedin: {
                url: faker_1.faker.helpers.maybe(() => `https://linkedin.com/in/${faker_1.faker.internet.username()}`, { probability: 0.5 }),
                available: faker_1.faker.datatype.boolean()
            },
            youtube: {
                url: faker_1.faker.helpers.maybe(() => `https://youtube.com/channel/${faker_1.faker.string.uuid()}`, { probability: 0.4 }),
                available: faker_1.faker.datatype.boolean()
            }
        };
        const partnerships = Array.from({ length: faker_1.faker.number.int({ min: 0, max: 3 }) }, () => ({
            name: this.getRandomCompanyName(),
            description: faker_1.faker.lorem.paragraph(),
            logoUrl: faker_1.faker.helpers.maybe(() => `uploads/web/partnerships/${faker_1.faker.system.fileName()}.png`, { probability: 0.8 })
        }));
        return {
            name: this.getRandomCompanyName(),
            address: faker_1.faker.location.streetAddress(),
            phone: `+56 9 ${faker_1.faker.string.numeric(4)} ${faker_1.faker.string.numeric(4)}`,
            mail: faker_1.faker.internet.email(),
            businessHours: 'Lunes a Viernes: 9:00 - 18:00\nSábado: 9:00 - 13:00\nDomingo: Cerrado',
            urlLogo: faker_1.faker.helpers.maybe(() => `uploads/web/logos/${faker_1.faker.system.fileName()}.png`, { probability: 0.9 }),
            socialMedia: socialMedia,
            partnerships: partnerships.length > 0 ? partnerships : undefined,
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date(),
            deletedAt: undefined
        };
    }
    static createRandomSlide() {
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
        const template = faker_1.faker.helpers.arrayElement(slideTemplates);
        return {
            title: template.title,
            description: template.description,
            multimediaUrl: faker_1.faker.helpers.maybe(() => `/uploads/slides/slide-${faker_1.faker.string.alphanumeric(8)}.jpg`, { probability: 0.8 }),
            linkUrl: template.linkUrl,
            duration: faker_1.faker.number.int({ min: 3, max: 7 }),
            startDate: faker_1.faker.helpers.maybe(() => faker_1.faker.date.recent(), { probability: 0.7 }),
            endDate: faker_1.faker.helpers.maybe(() => faker_1.faker.date.future(), { probability: 0.7 }),
            order: faker_1.faker.number.int({ min: 1, max: 10 }),
            isActive: faker_1.faker.helpers.weightedArrayElement([
                { weight: 0.8, value: true },
                { weight: 0.2, value: false }
            ]),
            createdAt: faker_1.faker.date.past(),
            updatedAt: new Date()
        };
    }
    static createExampleSlides() {
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
exports.SeederFactory = SeederFactory;
SeederFactory.latinFirstNames = [
    'Marco', 'Lucia', 'Antonio', 'Carmen', 'Diego', 'Rosa', 'Felipe', 'Isabella',
    'Ricardo', 'Gabriela', 'Fernando', 'Valentina', 'Alberto', 'Matilde', 'Carlos',
    'Francesca', 'Javier', 'Antonia', 'Manuel', 'Lorena', 'Enrique', 'Silvia',
    'Rodrigo', 'Catalina', 'Guillermo', 'Martina', 'Julio', 'Adriana', 'Salvador',
    'Emilia', 'Andrés', 'Beatriz', 'Pedro', 'Magdalena', 'Jorge', 'Constanza',
    'Raúl', 'Soledad', 'Víctor', 'Magdalena', 'Ernesto', 'Amparo'
];
SeederFactory.latinLastNames = [
    'Romano', 'Moretti', 'Rossini', 'Benedetti', 'Fontana', 'Toscani', 'Rinaldi',
    'Colombo', 'Giordano', 'Fabbri', 'Negri', 'Palmieri', 'Rossi', 'Lombardi',
    'Marino', 'Ferretti', 'Santoro', 'Marini', 'Conte', 'Rizzo', 'Bianchi',
    'Gatti', 'Neri', 'Marchetti', 'Taverna', 'Valentini', 'Paggi', 'Barbieri',
    'Conti', 'De Luca', 'Giulio', 'Leone', 'Vitale', 'Simone'
];
SeederFactory.companyNames = [
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
SeederFactory.usedPropertyTypes = new Set();
SeederFactory.usedDocumentTypes = new Set();
