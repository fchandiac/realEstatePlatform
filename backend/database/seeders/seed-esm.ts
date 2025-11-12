import 'reflect-metadata';
import { AppDataSource, initializeDataSource } from './seeder.config';
import { SeederFactory } from './seeder.factory';
import { Person } from '../../src/entities/person.entity';
import { User, UserRole, UserStatus, Permission } from '../../src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Property } from '../../src/entities/property.entity';
import { Contract } from '../../src/entities/contract.entity';
import { DocumentType } from '../../src/entities/document-type.entity';
import { PropertyType } from '../../src/entities/property-type.entity';
import { TeamMember } from '../../src/entities/team-member.entity';
import { Testimonial } from '../../src/entities/testimonial.entity';
import { AboutUs } from '../../src/entities/about-us.entity';
import { Article } from '../../src/entities/article.entity';
import { Multimedia } from '../../src/entities/multimedia.entity';
import { Identity } from '../../src/entities/identity.entity';
import { Slide } from '../../src/entities/slide.entity';

async function seedDatabase() {
  try {
    console.log('Initializing database connection...');
    await initializeDataSource();
    
    console.log('Synchronizing database schema...');
    await AppDataSource.synchronize(true);
    
    // Seed Identity (single record)
    console.log('Seeding identity...');
    const identityRepository = AppDataSource.getRepository(Identity);
    const identity = identityRepository.create(SeederFactory.createRandomIdentity());
    await identityRepository.save(identity);
    
    // Seed Property Types
    console.log('Seeding property types...');
    const propertyTypeRepository = AppDataSource.getRepository(PropertyType);
    const propertyTypes = await propertyTypeRepository.save(
      Array.from({ length: 8 }, () => propertyTypeRepository.create(SeederFactory.createRandomPropertyType()))
    );
    
    // Seed Document Types
    console.log('Seeding document types...');
    const documentTypeRepository = AppDataSource.getRepository(DocumentType);
    const documentTypes = await documentTypeRepository.save(
      Array.from({ length: 5 }, () => documentTypeRepository.create(SeederFactory.createRandomDocumentType()))
    );
    
    // Seed People
    console.log('Seeding people...');
    const personRepository = AppDataSource.getRepository(Person);
    const people = await personRepository.save(
      Array.from({ length: 30 }, () => personRepository.create(SeederFactory.createRandomPerson()))
    );
    
    // Seed Users
    console.log('Seeding users...');
    const userRepository = AppDataSource.getRepository(User);
    
    // Admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = userRepository.create({
      username: 'admin',
      email: 'admin@realestate.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      permissions: [Permission.MANAGE_USERS, Permission.MANAGE_PROPERTIES, Permission.MANAGE_CONTRACTS],
      person: people[0],
    });
    
    // Agent users
    const agents = [];
    for (let i = 1; i < 6; i++) {
      const password = await bcrypt.hash('agent123', 10);
      const agent = userRepository.create({
        username: `agent${i}`,
        email: `agent${i}@realstate.com`,
        password,
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        permissions: [Permission.MANAGE_PROPERTIES, Permission.MANAGE_CONTRACTS],
        person: people[i],
      });
      agents.push(agent);
    }
    
    // Regular users
    const regularUsers = [];
    for (let i = 6; i < 15; i++) {
      const password = await bcrypt.hash('user123', 10);
      const user = userRepository.create({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password,
        role: UserRole.COMMUNITY,
        status: UserStatus.ACTIVE,
        permissions: [],
        person: people[i],
      });
      regularUsers.push(user);
    }
    
    const allUsers = await userRepository.save([admin, ...agents, ...regularUsers]);
    console.log(`Created ${allUsers.length} users`);
    
    // Seed Properties
    console.log('Seeding properties...');
    const propertyRepository = AppDataSource.getRepository(Property);
    const properties = [];
    for (let i = 0; i < 15; i++) {
      const property = propertyRepository.create({
        ...SeederFactory.createRandomProperty(),
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        creatorUser: agents[Math.floor(Math.random() * agents.length)],
      });
      properties.push(property);
    }
    await propertyRepository.save(properties);
    console.log(`Created ${properties.length} properties`);
    
    // Seed Contracts
    console.log('Seeding contracts...');
    const contractRepository = AppDataSource.getRepository(Contract);
    const contracts = [];
    for (let i = 0; i < 8; i++) {
      const contract = contractRepository.create({
        ...SeederFactory.createRandomContract(),
        property: properties[Math.floor(Math.random() * properties.length)],
      });
      contracts.push(contract);
    }
    await contractRepository.save(contracts);
    console.log(`Created ${contracts.length} contracts`);
    
    // Seed Multimedia
    console.log('Seeding multimedia...');
    const multimediaRepository = AppDataSource.getRepository(Multimedia);
    const multimedias = [];
    for (let i = 0; i < 20; i++) {
      const multimedia = multimediaRepository.create(SeederFactory.createRandomMultimedia());
      multimedias.push(multimedia);
    }
    await multimediaRepository.save(multimedias);
    console.log(`Created ${multimedias.length} multimedia items`);
    
    // Seed Team Members
    console.log('Seeding team members...');
    const teamMemberRepository = AppDataSource.getRepository(TeamMember);
    const teamMembers = [];
    for (let i = 0; i < 10; i++) {
      const member = teamMemberRepository.create(SeederFactory.createRandomTeamMember());
      teamMembers.push(member);
    }
    await teamMemberRepository.save(teamMembers);
    console.log(`Created ${teamMembers.length} team members`);
    
    // Seed Testimonials
    console.log('Seeding testimonials...');
    const testimonialRepository = AppDataSource.getRepository(Testimonial);
    const testimonials = [];
    for (let i = 0; i < 8; i++) {
      const testimonial = testimonialRepository.create(SeederFactory.createRandomTestimonial());
      testimonials.push(testimonial);
    }
    await testimonialRepository.save(testimonials);
    console.log(`Created ${testimonials.length} testimonials`);
    
    // Seed About Us
    console.log('Seeding about us...');
    const aboutUsRepository = AppDataSource.getRepository(AboutUs);
    const aboutUs = aboutUsRepository.create(SeederFactory.createRandomAboutUs());
    await aboutUsRepository.save(aboutUs);
    
    // Seed Articles
    console.log('Seeding articles...');
    const articleRepository = AppDataSource.getRepository(Article);
    const articles = [];
    for (let i = 0; i < 6; i++) {
      const article = articleRepository.create(SeederFactory.createRandomArticle());
      articles.push(article);
    }
    await articleRepository.save(articles);
    console.log(`Created ${articles.length} articles`);
    
    // Seed Slides
    console.log('Seeding slides...');
    const slideRepository = AppDataSource.getRepository(Slide);
    const slides = [];
    for (let i = 0; i < 5; i++) {
      const slide = slideRepository.create(SeederFactory.createRandomSlide());
      slides.push(slide);
    }
    await slideRepository.save(slides);
    console.log(`Created ${slides.length} slides`);
    
    console.log('✅ Database seeding completed successfully!');
    await AppDataSource.destroy();
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seedDatabase();
