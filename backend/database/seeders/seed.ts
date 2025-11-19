import { AppDataSource, initializeDataSource } from './seeder.config';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus, Permission } from '../../src/entities/user.entity';
import { Property } from '../../src/entities/property.entity';
import { PropertyStatus } from '../../src/common/enums/property-status.enum';
import { PropertyOperationType } from '../../src/common/enums/property-operation-type.enum';
import { CurrencyPriceEnum } from '../../src/entities/property.entity';
import { PropertyType } from '../../src/entities/property-type.entity';
import { Slide } from '../../src/entities/slide.entity';
import { Article, ArticleCategory } from '../../src/entities/article.entity';
import { Testimonial } from '../../src/entities/testimonial.entity';
import { Identity } from '../../src/entities/identity.entity';
import { AboutUs } from '../../src/entities/about-us.entity';
import { RegionEnum } from '../../src/common/regions/regions.enum';
import { ComunaEnum } from '../../src/common/regions/comunas.enum';

async function seedDatabase() {
  try {
    await initializeDataSource();
    
    // Clear existing data
    console.log('Cleaning existing data...');
    await AppDataSource.synchronize(true);
    
    // ===== STEP 1: CREATE ADMIN USER =====
    console.log('Creating admin user...');
    const userRepository = AppDataSource.getRepository(User);
    const adminUser = await userRepository.save(
      userRepository.create({
        username: 'admin',
        email: 'admin@re.cl',
        password: await bcrypt.hash('7890', 10),
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        permissions: Object.values(Permission),
        personalInfo: {
          firstName: 'Administrador',
          lastName: 'Sistema',
          phone: '+56 9 1234 5678',
          avatarUrl: undefined
        },
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    );
    console.log(`✓ Admin user created: ${adminUser.email}`);
    
    // ===== STEP 2: SEED PROPERTY TYPES =====
    console.log('Seeding property types...');
    const propertyTypeRepository = AppDataSource.getRepository(PropertyType);
    const propertyTypes = await propertyTypeRepository.save([
      propertyTypeRepository.create({
        name: 'Casa',
        description: 'Vivienda unifamiliar independiente',
        hasBedrooms: true,
        hasBathrooms: true,
        hasBuiltSquareMeters: true,
        hasLandSquareMeters: true,
        hasParkingSpaces: true,
        hasFloors: false,
        hasConstructionYear: true,
        deletedAt: undefined
      }),
      propertyTypeRepository.create({
        name: 'Apartamento',
        description: 'Departamento en condominio',
        hasBedrooms: true,
        hasBathrooms: true,
        hasBuiltSquareMeters: true,
        hasLandSquareMeters: false,
        hasParkingSpaces: true,
        hasFloors: true,
        hasConstructionYear: true,
        deletedAt: undefined
      }),
      propertyTypeRepository.create({
        name: 'Terreno',
        description: 'Lote de terreno para construcción',
        hasBedrooms: false,
        hasBathrooms: false,
        hasBuiltSquareMeters: false,
        hasLandSquareMeters: true,
        hasParkingSpaces: false,
        hasFloors: false,
        hasConstructionYear: false,
        deletedAt: undefined
      }),
      propertyTypeRepository.create({
        name: 'Comercial',
        description: 'Espacio comercial o retail',
        hasBedrooms: false,
        hasBathrooms: true,
        hasBuiltSquareMeters: true,
        hasLandSquareMeters: false,
        hasParkingSpaces: true,
        hasFloors: true,
        hasConstructionYear: true,
        deletedAt: undefined
      }),
      propertyTypeRepository.create({
        name: 'Oficina',
        description: 'Oficina en centro de negocios',
        hasBedrooms: false,
        hasBathrooms: true,
        hasBuiltSquareMeters: true,
        hasLandSquareMeters: false,
        hasParkingSpaces: true,
        hasFloors: true,
        hasConstructionYear: true,
        deletedAt: undefined
      })
    ]);
    console.log(`✓ Created ${propertyTypes.length} property types`);
    
    // ===== STEP 3: SEED 20 PUBLISHED PROPERTIES (12 FEATURED) =====
    console.log('Seeding 20 published properties...');
    const propertyRepository = AppDataSource.getRepository(Property);
    
    const propertiesData = [
      // 12 FEATURED properties
      {
        title: 'Casa moderna en Las Condes',
        description: 'Hermosa casa moderna con piscina y jardín, ubicada en la exclusiva comuna de Las Condes.',
        bedrooms: 4,
        bathrooms: 3,
        builtSquareMeters: 280,
        landSquareMeters: 450,
        parkingSpaces: 2,
        price: 1200000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.LAS_CONDES,
        latitude: -33.3882,
        longitude: -70.5683,
        isFeatured: true
      },
      {
        title: 'Apartamento lujoso en Providencia',
        description: 'Departamento de lujo con vista al río, acabados premium, ubicado en Providencia.',
        bedrooms: 3,
        bathrooms: 2,
        builtSquareMeters: 150,
        landSquareMeters: 0,
        parkingSpaces: 1,
        price: 850000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.PROVIDENCIA,
        latitude: -33.4201,
        longitude: -70.6044,
        isFeatured: true
      },
      {
        title: 'Casa familiar en Ñuñoa',
        description: 'Amplia casa familiar perfecta para vivir en familia, sector residencial tranquilo.',
        bedrooms: 5,
        bathrooms: 2,
        builtSquareMeters: 320,
        landSquareMeters: 500,
        parkingSpaces: 3,
        price: 950000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.NUNOA,
        latitude: -33.4274,
        longitude: -70.5740,
        isFeatured: true
      },
      {
        title: 'Departamento céntrico en Santiago',
        description: 'Apartamento en pleno centro de Santiago, ideal para inversión o uso propio.',
        bedrooms: 2,
        bathrooms: 1,
        builtSquareMeters: 85,
        landSquareMeters: 0,
        parkingSpaces: 1,
        price: 450000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.RENCA,
        latitude: -33.4372,
        longitude: -70.6689,
        isFeatured: true
      },
      {
        title: 'Casa con vista a la cordillera en San Isidro',
        description: 'Casa amplia con vistas panorámicas a la cordillera, sector premium de San Isidro.',
        bedrooms: 4,
        bathrooms: 3,
        builtSquareMeters: 250,
        landSquareMeters: 400,
        parkingSpaces: 2,
        price: 1050000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.VITACURA,
        latitude: -33.3943,
        longitude: -70.5348,
        isFeatured: true
      },
      {
        title: 'Oficina moderna en Sanhattan',
        description: 'Oficina con acabados modernos, ubicada en zona de negocios, excelente para empresas.',
        bedrooms: 0,
        bathrooms: 2,
        builtSquareMeters: 120,
        landSquareMeters: 0,
        parkingSpaces: 2,
        price: 750000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.MACUL,
        latitude: -33.3944,
        longitude: -70.5340,
        isFeatured: true
      },
      {
        title: 'Terreno para proyectos en Peñalolén',
        description: 'Gran terreno con potencial de desarrollo inmobiliario, ubicado en Peñalolén.',
        bedrooms: 0,
        bathrooms: 0,
        builtSquareMeters: 0,
        landSquareMeters: 1000,
        parkingSpaces: 0,
        price: 350000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.PENALOLEN,
        latitude: -33.4896,
        longitude: -70.4968,
        isFeatured: true
      },
      {
        title: 'Casa en barrio Bellavista',
        description: 'Hermosa casa en el pintoresco barrio Bellavista, cercana a gastronomía y cultura.',
        bedrooms: 3,
        bathrooms: 2,
        builtSquareMeters: 180,
        landSquareMeters: 300,
        parkingSpaces: 1,
        price: 680000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.RECOLETA,
        latitude: -33.4291,
        longitude: -70.6636,
        isFeatured: true
      },
      {
        title: 'Departamento en San Bernardo',
        description: 'Cómodo departamento en San Bernardo, cerca de servicios y transporte.',
        bedrooms: 2,
        bathrooms: 1,
        builtSquareMeters: 95,
        landSquareMeters: 0,
        parkingSpaces: 1,
        price: 280000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.SAN_BERNARDO,
        latitude: -33.6063,
        longitude: -70.7120,
        isFeatured: true
      },
      {
        title: 'Casa con patio grande en Maipú',
        description: 'Vivienda unifamiliar con amplio patio, ideal para familias con niños.',
        bedrooms: 3,
        bathrooms: 2,
        builtSquareMeters: 160,
        landSquareMeters: 350,
        parkingSpaces: 1,
        price: 420000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.MAIPU,
        latitude: -33.5261,
        longitude: -70.7620,
        isFeatured: true
      },
      {
        title: 'Comercial en sector Apoquindo',
        description: 'Local comercial en importante avenida, perfecto para retail o servicios.',
        bedrooms: 0,
        bathrooms: 1,
        builtSquareMeters: 200,
        landSquareMeters: 0,
        parkingSpaces: 4,
        price: 600000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.LAS_CONDES,
        latitude: -33.3890,
        longitude: -70.5700,
        isFeatured: true
      },
      {
        title: 'Apartamento frente al río en Vitacura',
        description: 'Lujo y confort en Vitacura, con vistas privilegiadas al río Mapocho.',
        bedrooms: 3,
        bathrooms: 2,
        builtSquareMeters: 140,
        landSquareMeters: 0,
        parkingSpaces: 2,
        price: 950000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.VITACURA,
        latitude: -33.3807,
        longitude: -70.6044,
        isFeatured: true
      },
      
      // 8 NON-FEATURED properties
      {
        title: 'Casa en Quinta Normal',
        description: 'Propiedad lista para vivir en zona consolidada.',
        bedrooms: 2,
        bathrooms: 1,
        builtSquareMeters: 120,
        landSquareMeters: 250,
        parkingSpaces: 1,
        price: 350000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.QUINTA_NORMAL,
        latitude: -33.4514,
        longitude: -70.6910,
        isFeatured: false
      },
      {
        title: 'Departamento en Estación Central',
        description: 'Vivienda accesible con buen transporte público.',
        bedrooms: 2,
        bathrooms: 1,
        builtSquareMeters: 80,
        landSquareMeters: 0,
        parkingSpaces: 0,
        price: 220000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.ESTACION_CENTRAL,
        latitude: -33.4442,
        longitude: -70.6848,
        isFeatured: false
      },
      {
        title: 'Casa en Pudahuel',
        description: 'Vivienda económica en zona de crecimiento.',
        bedrooms: 3,
        bathrooms: 1,
        builtSquareMeters: 140,
        landSquareMeters: 280,
        parkingSpaces: 1,
        price: 310000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.PUDAHUEL,
        latitude: -33.4081,
        longitude: -70.8168,
        isFeatured: false
      },
      {
        title: 'Oficina pequeña en Independencia',
        description: 'Espacio para pequeños negocios, sector accesible.',
        bedrooms: 0,
        bathrooms: 1,
        builtSquareMeters: 60,
        landSquareMeters: 0,
        parkingSpaces: 1,
        price: 180000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.INDEPENDENCIA,
        latitude: -33.4130,
        longitude: -70.6661,
        isFeatured: false
      },
      {
        title: 'Departamento en Colina',
        description: 'Nuevo proyecto residencial en zona norte metropolitana.',
        bedrooms: 2,
        bathrooms: 2,
        builtSquareMeters: 110,
        landSquareMeters: 0,
        parkingSpaces: 1,
        price: 380000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.COLINA,
        latitude: -33.2161,
        longitude: -70.7298,
        isFeatured: false
      },
      {
        title: 'Casa en Lampa',
        description: 'Propiedad con espacio verde, zona segura y familiar.',
        bedrooms: 4,
        bathrooms: 2,
        builtSquareMeters: 200,
        landSquareMeters: 450,
        parkingSpaces: 2,
        price: 520000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.LAMPA,
        latitude: -33.3288,
        longitude: -70.8676,
        isFeatured: false
      },
      {
        title: 'Terreno agrícola en Paine',
        description: 'Terreno rural con potencial para agronegocios.',
        bedrooms: 0,
        bathrooms: 0,
        builtSquareMeters: 0,
        landSquareMeters: 5000,
        parkingSpaces: 0,
        price: 150000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.PAINE,
        latitude: -33.8097,
        longitude: -70.6361,
        isFeatured: false
      },
      {
        title: 'Casa en Buin',
        description: 'Vivienda tranquila en zona rural periurbana.',
        bedrooms: 3,
        bathrooms: 2,
        builtSquareMeters: 130,
        landSquareMeters: 600,
        parkingSpaces: 1,
        price: 290000000,
        state: RegionEnum.METROPOLITANA,
        city: ComunaEnum.BUIN,
        latitude: -33.7305,
        longitude: -70.7546,
        isFeatured: false
      }
    ];

    const properties = await propertyRepository.save(
      propertiesData.map((data) => {
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        return propertyRepository.create({
          title: data.title,
          description: data.description,
          status: PropertyStatus.PUBLISHED,
          operationType: PropertyOperationType.SALE,
          price: data.price,
          currencyPrice: CurrencyPriceEnum.CLP,
          bathrooms: data.bathrooms,
          bedrooms: data.bedrooms,
          builtSquareMeters: data.builtSquareMeters,
          landSquareMeters: data.landSquareMeters,
          parkingSpaces: data.parkingSpaces,
          state: data.state,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          isFeatured: data.isFeatured,
          creatorUser: adminUser,
          propertyType: propertyType,
          publicationDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      })
    );
    console.log(`✓ Created ${properties.length} properties (${properties.filter(p => p.isFeatured).length} featured)`);
    
    // ===== STEP 4: SEED 3 SLIDES IN SPANISH =====
    console.log('Seeding 3 slides in Spanish...');
    const slideRepository = AppDataSource.getRepository(Slide);
    
    const slides = await slideRepository.save([
      slideRepository.create({
        title: '¡Vende tu Propiedad con Nosotros!',
        description: 'Obtén la mejor valorización y vende rápido con nuestro equipo de expertos inmobiliarios.',
        linkUrl: '/portal/properties?operationType=SALE',
        duration: 5,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      slideRepository.create({
        title: 'Encuentra tu Hogar Ideal',
        description: 'Explora miles de propiedades disponibles en las mejores ubicaciones de Santiago.',
        linkUrl: '/portal/properties',
        duration: 4,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      slideRepository.create({
        title: 'Arriendo Seguro y Confiable',
        description: 'Propiedades verificadas con contratos seguros y asesoría legal completa.',
        linkUrl: '/portal/properties?operationType=RENT',
        duration: 3,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ]);
    console.log(`✓ Created ${slides.length} slides`);
    
    // ===== STEP 5: SEED BLOG ARTICLES BY CATEGORY =====
    console.log('Seeding blog articles by category...');
    const articleRepository = AppDataSource.getRepository(Article);
    
    const articles = await articleRepository.save([
      // CONSEJOS category
      articleRepository.create({
        title: '5 Consejos para Comprar tu Primera Casa',
        subtitle: 'Guía práctica para compradores primerizos',
        text: 'Comprar una casa es una de las decisiones más importantes de tu vida. En este artículo te compartimos 5 consejos fundamentales para hacer una compra inteligente y segura. Desde evaluar tu presupuesto, revisar la ubicación, inspeccionar el estado de la propiedad, revisar documentos legales, y negociar el precio. Sigue estos pasos para tomar la mejor decisión.',
        category: ArticleCategory.COMPRAR,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      articleRepository.create({
        title: 'Cómo Preparar tu Casa para la Venta',
        subtitle: 'Estrategias para obtener el mejor precio',
        text: 'Si estás pensando en vender tu propiedad, preparación es la clave. Desde mejorar la presentación exterior, pintar las paredes, reparar detalles, limpiar profundamente, hasta organizar los espacios. Todas estas acciones pueden incrementar significativamente el valor percibido de tu propiedad y atraer compradores de calidad. Descubre cómo maximizar el potencial de venta de tu casa.',
        category: ArticleCategory.COMPRAR,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      
      // MERCADO category
      articleRepository.create({
        title: 'Análisis del Mercado Inmobiliario 2024',
        subtitle: 'Tendencias y proyecciones para el sector',
        text: 'El mercado inmobiliario chileno ha mostrado importante dinamismo en los últimos meses. Los precios han experimentado variaciones según zona y tipo de propiedad. Santiago concentra la mayor demanda, con zonas premium manteniendo estabilidad. El sector de departamentos pequeños ha visto crecimiento debido a la demanda de profesionales jóvenes. Analiza las oportunidades de inversión según tus objetivos.',
        category: ArticleCategory.MERCADO,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      articleRepository.create({
        title: 'Zonas con Mayor Potencial de Crecimiento en Santiago',
        subtitle: 'Dónde invertir en 2024 y 2025',
        text: 'Identificar zonas de crecimiento es crucial para inversiones inmobiliarias. Comunas como Colina, Lampa y Puente Alto muestran fuerte expansión residencial. Las nuevas conexiones viales y proyectos de transporte están impulsando valores. Analiza la infraestructura disponible, proyectos futuros y tendencias demográficas. La mejor inversión es aquella bien informada.',
        category: ArticleCategory.MERCADO,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      
      // DECORACION category
      articleRepository.create({
        title: 'Decoración Minimalista: Espacio Limpio y Moderno',
        subtitle: 'Cómo crear ambientes acogedores con menos',
        text: 'El minimalismo no significa vivir sin comodidad. Se trata de elegir cuidadosamente cada elemento, dejando de lado lo innecesario. Los colores neutros amplían visualmente los espacios. La iluminación natural es tu mejor aliada. Muebles funcionales y atemporales son inversiones inteligentes. Descubre cómo crear un hogar moderno, limpio y acogedor.',
        category: ArticleCategory.DECORACION,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      articleRepository.create({
        title: 'Colores que Transforman tus Ambientes',
        subtitle: 'Psicología del color en diseño de interiores',
        text: 'Cada color tiene un impacto psicológico diferente. Los azules transmiten calma, ideales para dormitorios. Los verdes conectan con la naturaleza. Los tonos cálidos crean intimidad. El blanco amplía espacios. La combinación correcta de colores puede transformar completamente la atmósfera de tu hogar. Aprende a usar el color a tu favor.',
        category: ArticleCategory.DECORACION,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      
      // INVERSION category
      articleRepository.create({
        title: 'Inversión Inmobiliaria: Rentabilidad a Largo Plazo',
        subtitle: 'Por qué el inmueble sigue siendo la mejor inversión',
        text: 'La inversión inmobiliaria ofrece múltiples ventajas: genera flujo de caja a través de arriendos, se aprecia con el tiempo, permite apalancamiento con hipotecas, y es tangible. Diferente a acciones o criptomonedas, la propiedad es un activo sólido. Analiza la ubicación, proyecciones de crecimiento, y potencial de arriendo.',
        category: ArticleCategory.INVERSION,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      articleRepository.create({
        title: 'Estrategias de Arriendo: Maximiza tus Ingresos',
        subtitle: 'Cómo arrendar inteligentemente y con seguridad',
        text: 'Si inviertes en propiedad para arriendo, la estrategia es fundamental. Evalúa el potencial de arrendamiento de la zona. Fija precios competitivos pero rentables. Selecciona arrendatarios cuidadosamente. Mantén la propiedad en excelente condición. Los gastos deben controlarse para maximizar ganancias. Un buen arrendamiento es un negocio ganador.',
        category: ArticleCategory.INVERSION,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ]);
    console.log(`✓ Created ${articles.length} blog articles`);
    
    // ===== STEP 6: SEED 8 TESTIMONIES IN SPANISH =====
    console.log('Seeding 8 testimonies...');
    const testimonialRepository = AppDataSource.getRepository(Testimonial);
    
    const testimonials = await testimonialRepository.save([
      testimonialRepository.create({
        name: 'María García',
        content: 'Excelente servicio, profesionales de verdad. Encontré la casa de mis sueños en un tiempo récord. Muy recomendados.',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      testimonialRepository.create({
        name: 'Carlos López',
        content: 'Vender mi propiedad fue fácil y sin estrés gracias al equipo. Obtuve el mejor precio del mercado. Confiable 100%.',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      testimonialRepository.create({
        name: 'Ana Martínez',
        content: 'Asesoría profesional desde el inicio hasta el final. Me ayudaron a encontrar la mejor inversión inmobiliaria.',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      testimonialRepository.create({
        name: 'Roberto Sánchez',
        content: 'Tremenda experiencia. El equipo es atento, puntual y muy conocedor del mercado inmobiliario.',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      testimonialRepository.create({
        name: 'Laura Rodríguez',
        content: 'Arrendé mi propiedad sin problemas. Buena gestión y transparencia en todo el proceso. Recomendado.',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      testimonialRepository.create({
        name: 'Diego Flores',
        content: 'Servicio de calidad a un precio justo. Se nota la experiencia del equipo en cada interacción.',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      testimonialRepository.create({
        name: 'Patricia Alvarez',
        content: 'Hace 5 años que trabajo con ellos en mis inversiones inmobiliarias. Resultados consistentes y profesionales.',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      testimonialRepository.create({
        name: 'Fernando González',
        content: 'El mejor equipo inmobiliario que he conocido. Honestidad y transparencia en cada operación. Muy satisfecho.',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ]);
    console.log(`✓ Created ${testimonials.length} testimonies`);
    
    // ===== STEP 7: CREATE BASIC IDENTITY =====
    console.log('Seeding identity...');
    const identityRepository = AppDataSource.getRepository(Identity);
    const identity = await identityRepository.save(
      identityRepository.create({
        name: 'Real Estate Platform Chile',
        address: 'Avenida Apoquindo 6000, Las Condes, Santiago',
        phone: '+56 9 1234 5678',
        mail: 'contacto@realestate.cl',
        businessHours: 'Lunes a Viernes: 9:00 - 18:00\nSábado: 10:00 - 14:00\nDomingo: Cerrado',
        urlLogo: undefined,
        socialMedia: {
          instagram: {
            url: 'https://instagram.com/realestatchile',
            available: true
          },
          facebook: {
            url: 'https://facebook.com/realestatchile',
            available: true
          },
          linkedin: {
            url: 'https://linkedin.com/company/realestatchile',
            available: true
          },
          youtube: {
            url: 'https://youtube.com/@realestatchile',
            available: true
          }
        },
        partnerships: [
          {
            name: 'Banco Santander',
            description: 'Soluciones de financiamiento hipotecario',
            logoUrl: 'https://example.com/logos/banco-santander.png'
          },
          {
            name: 'BancoEstado',
            description: 'Créditos hipotecarios y seguros de propiedad',
            logoUrl: 'https://example.com/logos/bancoestado.png'
          },
          {
            name: 'Seguros Generales de Chile',
            description: 'Seguros de propiedad y responsabilidad civil',
            logoUrl: 'https://example.com/logos/seguros-generales.png'
          },
          {
            name: 'NotariaPública',
            description: 'Servicios notariales y trámites legales',
            logoUrl: 'https://example.com/logos/notaria.png'
          }
        ],
        faqs: [
          {
            question: '¿Cuál es el proceso para vender una propiedad?',
            answer: 'El proceso comienza con la evaluación de tu propiedad, luego publicamos en nuestro portal, organizamos visitas, y manejamos todas las negociaciones hasta la firma de escrituras con asesoría legal.'
          },
          {
            question: '¿Cuánto cuesta publicar una propiedad?',
            answer: 'Publicar una propiedad es totalmente gratuito. Ganamos comisión solo cuando se concreta la venta o arriendo.'
          },
          {
            question: '¿Qué documentos necesito para comprar una propiedad?',
            answer: 'Necesitarás: Cédula de identidad, comprobante de ingresos, aprobación de hipoteca (si aplica), y asesoría legal. Nuestro equipo te guía en cada paso.'
          },
          {
            question: '¿Ofrecen servicios de arriendo?',
            answer: 'Sí, ofrecemos servicios completos de arriendo: publicación, búsqueda de arrendatarios, revisión de antecedentes, contratos y administración de la propiedad.'
          },
          {
            question: '¿Cómo puedo contactarlos fuera de horario?',
            answer: 'Puedes escribirnos por WhatsApp en cualquier momento y nos contactaremos dentro de 24 horas hábiles.'
          },
          {
            question: '¿Hacen tasaciones de propiedades?',
            answer: 'Sí, realizamos tasaciones de mercado gratuitas para determinar el valor justo de tu propiedad basado en comparables del mercado actual.'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined
      })
    );
    console.log(`✓ Identity created: Real Estate Platform Chile`);
    
    // ===== STEP 8: CREATE BASIC ABOUT US =====
    console.log('Seeding about us...');
    const aboutUsRepository = AppDataSource.getRepository(AboutUs);
    const aboutUs = await aboutUsRepository.save(
      aboutUsRepository.create({
        bio: 'Somos una plataforma inmobiliaria líder en Chile con más de 15 años de experiencia conectando compradores, vendedores e inversores. Nuestro equipo de profesionales se dedica a hacer del proceso inmobiliario algo transparente, seguro y eficiente.',
        mision: 'Facilitar transacciones inmobiliarias seguras, transparentes y accesibles para todos los chilenos, proporcionando información de calidad y asesoría profesional.',
        vision: 'Ser la plataforma inmobiliaria de referencia en Chile, transformando la manera en que las personas compran, venden y arriendan propiedades.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined
      })
    );
    console.log(`✓ About us created`);
    
    console.log('\n✅ Seeding completed successfully!');
    console.log(`\nResumen:`);
    console.log(`  • 1 admin user (${adminUser.email})`);
    console.log(`  • 20 published properties (12 featured)`);
    console.log(`  • 3 slides in Spanish`);
    console.log(`  • ${articles.length} blog articles by category`);
    console.log(`  • ${testimonials.length} testimonies`);
    
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the seeder
seedDatabase().then(() => {
  console.log('\nDatabase seeding completed');
  process.exit(0);
}).catch((error) => {
  console.error('Database seeding failed:', error);
  process.exit(1);
});