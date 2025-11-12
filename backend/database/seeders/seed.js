"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seeder_config_1 = require("./seeder.config");
const seeder_factory_1 = require("./seeder.factory");
const faker_1 = require("@faker-js/faker");
const person_entity_1 = require("../../src/entities/person.entity");
const user_entity_1 = require("../../src/entities/user.entity");
const bcrypt = require("bcrypt");
const property_entity_1 = require("../../src/entities/property.entity");
const contract_entity_1 = require("../../src/entities/contract.entity");
const document_type_entity_1 = require("../../src/entities/document-type.entity");
const property_type_entity_1 = require("../../src/entities/property-type.entity");
const team_member_entity_1 = require("../../src/entities/team-member.entity");
const testimonial_entity_1 = require("../../src/entities/testimonial.entity");
const about_us_entity_1 = require("../../src/entities/about-us.entity");
const article_entity_1 = require("../../src/entities/article.entity");
const multimedia_entity_1 = require("../../src/entities/multimedia.entity");
const identity_entity_1 = require("../../src/entities/identity.entity");
const slide_entity_1 = require("../../src/entities/slide.entity");
const blog_article_entity_1 = require("../../src/entities/blog-article.entity");
async function seedDatabase() {
    try {
        await (0, seeder_config_1.initializeDataSource)();
        // Clear existing data
        console.log('Cleaning existing data...');
        await seeder_config_1.AppDataSource.synchronize(true);
        // Seed People
        console.log('Seeding people...');
        const personRepository = seeder_config_1.AppDataSource.getRepository(person_entity_1.Person);
        const people = await personRepository.save(Array.from({ length: 50 }, () => personRepository.create(seeder_factory_1.SeederFactory.createRandomPerson())));
        // Seed Users (some linked to people)
        console.log('Seeding users...');
        const userRepository = seeder_config_1.AppDataSource.getRepository(user_entity_1.User);
        // Create admin user first
        console.log('Creating admin user...');
        const adminUser = await userRepository.save(userRepository.create(seeder_factory_1.SeederFactory.createAdminUser()));
        console.log('Admin user created:', adminUser);
        // Create at least one agent user
        const agentUser = await userRepository.save(userRepository.create({
            username: 'agent1',
            email: 'agent@realestate.com',
            password: await bcrypt.hash('password123', 10),
            role: user_entity_1.UserRole.AGENT,
            status: user_entity_1.UserStatus.ACTIVE,
            personalInfo: {
                firstName: 'Agent',
                lastName: 'User',
                phone: '+56 9 9876 5432',
                avatarUrl: undefined
            },
            permissions: [user_entity_1.Permission.MANAGE_PROPERTIES, user_entity_1.Permission.ASSIGN_PROPERTY_AGENT],
            lastLogin: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        // Then seed random users
        const users = await userRepository.save(Array.from({ length: 20 }, (_, i) => {
            const user = userRepository.create(seeder_factory_1.SeederFactory.createRandomUser());
            if (i < people.length) {
                // Update the person with the user relation after the user is created
                people[i].user = user;
            }
            return user;
        }));
        // Add the admin and agent users to the users array
        users.push(adminUser, agentUser);
        // Seed Property Types
        console.log('Seeding property types...');
        const propertyTypeRepository = seeder_config_1.AppDataSource.getRepository(property_type_entity_1.PropertyType);
        const propertyTypes = await propertyTypeRepository.save(Array.from({ length: 7 }, () => {
            const data = seeder_factory_1.SeederFactory.createRandomPropertyType();
            return propertyTypeRepository.create({
                ...data,
                deletedAt: undefined
            });
        }));
        // Seed Properties
        console.log('Seeding properties...');
        const propertyRepository = seeder_config_1.AppDataSource.getRepository(property_entity_1.Property);
        const agentUsers = users.filter(user => user.role === user_entity_1.UserRole.AGENT);
        const properties = await propertyRepository.save(Array.from({ length: 30 }, () => {
            const propertyData = seeder_factory_1.SeederFactory.createRandomProperty();
            const randomAgent = agentUsers[Math.floor(Math.random() * agentUsers.length)];
            const randomPropertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            return propertyRepository.create({
                ...propertyData,
                creatorUser: randomAgent,
                assignedAgent: faker_1.faker.helpers.maybe(() => randomAgent, { probability: 0.8 }), // Some properties have no assigned agent
                propertyType: randomPropertyType
            });
        }));
        // Seed Contracts
        console.log('Seeding contracts...');
        const contractRepository = seeder_config_1.AppDataSource.getRepository(contract_entity_1.Contract);
        const contracts = await contractRepository.save(Array.from({ length: 15 }, () => {
            const contractData = seeder_factory_1.SeederFactory.createRandomContract();
            const property = properties[Math.floor(Math.random() * properties.length)];
            const user = users[Math.floor(Math.random() * users.length)];
            const person = people[Math.floor(Math.random() * people.length)];
            return contractRepository.create({
                ...contractData,
                property: property,
                user: user,
                people: [{
                        personId: person.id,
                        role: contract_entity_1.ContractRole.TENANT
                    }]
            });
        }));
        // Seed Document Types
        console.log('Seeding document types...');
        const documentTypeRepository = seeder_config_1.AppDataSource.getRepository(document_type_entity_1.DocumentType);
        const documentTypes = await documentTypeRepository.save(Array.from({ length: 7 }, () => {
            const data = seeder_factory_1.SeederFactory.createRandomDocumentType();
            return documentTypeRepository.create({
                ...data,
                deletedAt: undefined
            });
        }));
        // Seed Team Members
        console.log('Seeding team members...');
        const teamMemberRepository = seeder_config_1.AppDataSource.getRepository(team_member_entity_1.TeamMember);
        const teamMembers = await teamMemberRepository.save(Array.from({ length: 10 }, () => {
            const data = seeder_factory_1.SeederFactory.createRandomTeamMember();
            return teamMemberRepository.create({
                ...data,
                deletedAt: undefined
            });
        }));
        // Seed Testimonials
        console.log('Seeding testimonials...');
        const testimonialRepository = seeder_config_1.AppDataSource.getRepository(testimonial_entity_1.Testimonial);
        const testimonials = await testimonialRepository.save(Array.from({ length: 20 }, () => testimonialRepository.create(seeder_factory_1.SeederFactory.createRandomTestimonial())));
        // Seed About Us
        console.log('Seeding about us...');
        const aboutUsRepository = seeder_config_1.AppDataSource.getRepository(about_us_entity_1.AboutUs);
        const aboutUsData = seeder_factory_1.SeederFactory.createRandomAboutUs();
        const aboutUs = await aboutUsRepository.save(aboutUsRepository.create({
            ...aboutUsData,
            deletedAt: undefined
        }));
        // Seed Identity
        console.log('Seeding identity...');
        const identityRepository = seeder_config_1.AppDataSource.getRepository(identity_entity_1.Identity);
        const identityData = seeder_factory_1.SeederFactory.createRandomIdentity();
        const identity = await identityRepository.save(identityRepository.create({
            ...identityData,
            deletedAt: undefined
        }));
        // Seed Articles
        console.log('Seeding articles...');
        const articleRepository = seeder_config_1.AppDataSource.getRepository(article_entity_1.Article);
        const articles = await articleRepository.save(Array.from({ length: 15 }, () => {
            const articleData = seeder_factory_1.SeederFactory.createRandomArticle();
            return articleRepository.create({
                title: articleData.title,
                subtitle: `Subtítulo para ${articleData.title}`,
                text: articleData.content,
                category: article_entity_1.ArticleCategory.MERCADO,
                multimediaUrl: 'https://example.com/articles/image.jpg'
            });
        }));
        // Seed Blog Articles
        console.log('Seeding blog articles...');
        const blogArticleRepository = seeder_config_1.AppDataSource.getRepository(blog_article_entity_1.BlogArticle);
        const blogArticles = await blogArticleRepository.save(Array.from({ length: 20 }, () => {
            const blogArticleData = seeder_factory_1.SeederFactory.createRandomBlogArticle();
            return blogArticleRepository.create(blogArticleData);
        }));
        // Seed Multimedia
        console.log('Seeding multimedia...');
        const multimediaRepository = seeder_config_1.AppDataSource.getRepository(multimedia_entity_1.Multimedia);
        const multimedia = await multimediaRepository.save(Array.from({ length: 50 }, () => {
            const mediaData = seeder_factory_1.SeederFactory.createRandomMultimedia();
            const multimediaFormat = mediaData.type === 'VIDEO' ? multimedia_entity_1.MultimediaFormat.VIDEO : multimedia_entity_1.MultimediaFormat.IMG;
            const multimediaType = multimediaFormat === multimedia_entity_1.MultimediaFormat.VIDEO
                ? multimedia_entity_1.MultimediaType.PROPERTY_VIDEO
                : multimedia_entity_1.MultimediaType.PROPERTY_IMG;
            return multimediaRepository.create({
                format: multimediaFormat,
                type: multimediaType,
                url: mediaData.url,
                seoTitle: mediaData.title,
                filename: `${mediaData.title.toLowerCase().replace(/\s+/g, '-')}.${multimediaFormat === multimedia_entity_1.MultimediaFormat.VIDEO ? 'mp4' : 'jpg'}`,
                fileSize: Math.floor(Math.random() * 10000000)
            });
        }));
        // Seed slides
        console.log('Seeding slides...');
        const slideRepository = seeder_config_1.AppDataSource.getRepository(slide_entity_1.Slide);
        // Create example slides
        const exampleSlides = seeder_factory_1.SeederFactory.createExampleSlides();
        const savedExampleSlides = await slideRepository.save(exampleSlides.map(slideData => slideRepository.create(slideData)));
        // Create random slides
        const randomSlides = Array.from({ length: 15 }, () => {
            const slideData = seeder_factory_1.SeederFactory.createRandomSlide();
            return slideRepository.create(slideData);
        });
        const savedRandomSlides = await slideRepository.save(randomSlides);
        console.log(`Created ${savedExampleSlides.length + savedRandomSlides.length} slides`);
        console.log('Seeding completed successfully!');
    }
    catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    }
    finally {
        await seeder_config_1.AppDataSource.destroy();
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
