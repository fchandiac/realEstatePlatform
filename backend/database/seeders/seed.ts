import { AppDataSource, initializeDataSource } from './seeder.config';
import { SeederFactory } from './seeder.factory';
import { faker } from '@faker-js/faker';
import { Person } from '../../src/entities/person.entity';
import { User, UserRole, UserStatus, Permission } from '../../src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Property } from '../../src/entities/property.entity';
import { Contract, ContractRole } from '../../src/entities/contract.entity';
import { DocumentType } from '../../src/entities/document-type.entity';
import { PropertyType } from '../../src/entities/property-type.entity';
import { TeamMember } from '../../src/entities/team-member.entity';
import { Testimonial } from '../../src/entities/testimonial.entity';
import { AboutUs } from '../../src/entities/about-us.entity';
import { Article, ArticleCategory } from '../../src/entities/article.entity';
import { Multimedia, MultimediaFormat, MultimediaType } from '../../src/entities/multimedia.entity';
import { Identity } from '../../src/entities/identity.entity';
import { Slide } from '../../src/entities/slide.entity';
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
  SlideSeed,
  BlogArticleSeed
} from './seeder.types';

async function seedDatabase() {
  try {
    await initializeDataSource();
    
    // Clear existing data
    console.log('Cleaning existing data...');
    await AppDataSource.synchronize(true);
    
    // Seed People
    console.log('Seeding people...');
    const personRepository = AppDataSource.getRepository(Person);
    const people = await personRepository.save(
      Array.from({ length: 50 }, () => personRepository.create(SeederFactory.createRandomPerson()))
    );
    
    // Seed Users (some linked to people)
    console.log('Seeding users...');
    const userRepository = AppDataSource.getRepository(User);

    // Create admin user first
    console.log('Creating admin user...');
    const adminUser = await userRepository.save(
      userRepository.create(SeederFactory.createAdminUser())
    );
    console.log('Admin user created:', adminUser);

    // Create at least one agent user
    const agentUser = await userRepository.save(
      userRepository.create({
        username: 'agent1',
        email: 'agent@realestate.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        personalInfo: {
          firstName: 'Agent',
          lastName: 'User',
          phone: '+56 9 9876 5432',
          avatarUrl: undefined
        },
        permissions: [Permission.MANAGE_PROPERTIES, Permission.ASSIGN_PROPERTY_AGENT],
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    );

    // Then seed random users
    const users = await userRepository.save(
      Array.from({ length: 20 }, (_, i) => {
        const user = userRepository.create(SeederFactory.createRandomUser());
        if (i < people.length) {
          // Update the person with the user relation after the user is created
          people[i].user = user;
        }
        return user;
      })
    );

    // Add the admin and agent users to the users array
    users.push(adminUser, agentUser);
    
        // Seed Property Types
    console.log('Seeding property types...');
    const propertyTypeRepository = AppDataSource.getRepository(PropertyType);
    const propertyTypes = await propertyTypeRepository.save(
      Array.from({ length: 7 }, () => {
        const data = SeederFactory.createRandomPropertyType();
        return propertyTypeRepository.create({
          ...data,
          deletedAt: undefined
        });
      })
    );
    
    // Seed Properties
    console.log('Seeding properties...');
    const propertyRepository = AppDataSource.getRepository(Property);
    const agentUsers = users.filter(user => user.role === UserRole.AGENT);
    const properties = await propertyRepository.save(
      Array.from({ length: 30 }, () => {
        const propertyData = SeederFactory.createRandomProperty();
        const randomAgent = agentUsers[Math.floor(Math.random() * agentUsers.length)];
        const randomPropertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        
        return propertyRepository.create({
          ...propertyData,
          creatorUser: randomAgent,
          assignedAgent: faker.helpers.maybe(() => randomAgent, { probability: 0.8 }), // Some properties have no assigned agent
          propertyType: randomPropertyType
        });
      }));
      
    // Seed Contracts
    console.log('Seeding contracts...');
    const contractRepository = AppDataSource.getRepository(Contract);
    const contracts = await contractRepository.save(
      Array.from({ length: 15 }, () => {
        const contractData = SeederFactory.createRandomContract();
        const property = properties[Math.floor(Math.random() * properties.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const person = people[Math.floor(Math.random() * people.length)];
        
        return contractRepository.create({
          ...contractData,
          property: property,
          user: user,
          people: [{
            personId: person.id,
            role: ContractRole.TENANT
          }]
        });
      })
    );
    
    // Seed Document Types
    console.log('Seeding document types...');
    const documentTypeRepository = AppDataSource.getRepository(DocumentType);
    const documentTypes = await documentTypeRepository.save(
      Array.from({ length: 7 }, () => {
        const data = SeederFactory.createRandomDocumentType();
        return documentTypeRepository.create({
          ...data,
          deletedAt: undefined
        });
      })
    );
    
    // Seed Team Members
    console.log('Seeding team members...');
    const teamMemberRepository = AppDataSource.getRepository(TeamMember);
    const teamMembers = await teamMemberRepository.save(
      Array.from({ length: 10 }, () => {
        const data = SeederFactory.createRandomTeamMember();
        return teamMemberRepository.create({
          ...data,
          deletedAt: undefined
        });
      })
    );
    
    // Seed Testimonials
    console.log('Seeding testimonials...');
    const testimonialRepository = AppDataSource.getRepository(Testimonial);
    const testimonials = await testimonialRepository.save(
      Array.from({ length: 20 }, () => testimonialRepository.create(SeederFactory.createRandomTestimonial()))
    );
    
    // Seed About Us
    console.log('Seeding about us...');
    const aboutUsRepository = AppDataSource.getRepository(AboutUs);
    const aboutUsData = SeederFactory.createRandomAboutUs();
    const aboutUs = await aboutUsRepository.save(
      aboutUsRepository.create({
        ...aboutUsData,
        deletedAt: undefined
      })
    );
    
    // Seed Identity
    console.log('Seeding identity...');
    const identityRepository = AppDataSource.getRepository(Identity);
    const identityData = SeederFactory.createRandomIdentity();
    const identity = await identityRepository.save(
      identityRepository.create({
        ...identityData,
        deletedAt: undefined
      })
    );
    
        // Seed Articles
    console.log('Seeding articles for blog...');
    const articleRepository = AppDataSource.getRepository(Article);
    const articles = await articleRepository.save(
      Array.from({ length: 10 }, () => {
        const articleData = SeederFactory.createArticleForBlog();
        return articleRepository.create(articleData);
      })
    );
    
    // Seed Multimedia
    console.log('Seeding multimedia...');
    const multimediaRepository = AppDataSource.getRepository(Multimedia);
    const multimedia = await multimediaRepository.save(
      Array.from({ length: 50 }, () => {
        const mediaData = SeederFactory.createRandomMultimedia();
        return multimediaRepository.create({
          format: mediaData.format,
          type: mediaData.type,
          url: mediaData.url,
          seoTitle: mediaData.seoTitle,
          filename: mediaData.filename,
          fileSize: mediaData.fileSize
        });
      })
    );
    
    // Seed slides
    console.log('Seeding slides...');
    const slideRepository = AppDataSource.getRepository(Slide);
    
    // Create example slides
    const exampleSlides = SeederFactory.createExampleSlides();
    const savedExampleSlides = await slideRepository.save(
      exampleSlides.map(slideData => slideRepository.create(slideData))
    );
    
    // Create random slides
    const randomSlides = Array.from({ length: 15 }, () => {
      const slideData = SeederFactory.createRandomSlide();
      return slideRepository.create(slideData);
    });
    const savedRandomSlides = await slideRepository.save(randomSlides);
    
    console.log(`Created ${savedExampleSlides.length + savedRandomSlides.length} slides`);
    
    console.log('Seeding completed successfully!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the seeder
seedDatabase().then(() => {
  console.log('Database seeding completed');
  process.exit(0);
}).catch((error) => {
  console.error('Database seeding failed:', error);
  process.exit(1);
});