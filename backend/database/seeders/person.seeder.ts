import { AppDataSource, initializeDataSource } from './seeder.config';
import { SeederFactory } from './seeder.factory';
import { Person } from '../../src/entities/person.entity';

async function seedPersons(count: number = 50) {
  try {
    await initializeDataSource();
    const personRepository = AppDataSource.getRepository(Person);
    
    console.log(`Starting to seed ${count} persons...`);
    
    const personSeeds = Array.from({ length: count }, () => 
      personRepository.create(SeederFactory.createRandomPerson())
    );
    
    await personRepository.save(personSeeds);
    console.log(`Successfully seeded ${count} persons`);
    
  } catch (error) {
    console.error('Error seeding persons:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the seeder
seedPersons().then(() => {
  console.log('Person seeding completed');
}).catch((error) => {
  console.error('Person seeding failed:', error);
  process.exit(1);
});