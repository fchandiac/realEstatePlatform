import { AppDataSource } from './data-source.js';
import { Slide } from './dist/entities/slide.entity.js';

async function verifySlides() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log('Database connection established');
    
    const slideRepository = AppDataSource.getRepository(Slide);
    
    // Count total slides
    const totalSlides = await slideRepository.count();
    console.log(`\nTotal slides in database: ${totalSlides}`);
    
    // Get active slides ordered by order
    const activeSlides = await slideRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' }
    });
    
    console.log(`\nActive slides (${activeSlides.length}):`);
    activeSlides.forEach((slide, index) => {
      console.log(`${index + 1}. [Order: ${slide.order}] ${slide.title}`);
      console.log(`   Description: ${slide.description}`);
      console.log(`   URL: ${slide.multimediaUrl || 'No image'}`);
      console.log(`   Link: ${slide.linkUrl || 'No link'}`);
      console.log(`   Duration: ${slide.duration}s`);
      console.log('');
    });
    
    // Get example slides (first 3)
    const exampleSlides = await slideRepository.find({
      take: 3,
      order: { order: 'ASC' }
    });
    
    console.log(`Example slides (first 3):`);
    exampleSlides.forEach((slide, index) => {
      console.log(`${index + 1}. ${slide.title} (Active: ${slide.isActive})`);
    });
    
  } catch (error) {
    console.error('Error verifying slides:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

verifySlides();