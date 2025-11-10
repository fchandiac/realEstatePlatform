import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestimonialsService } from './testimonials.service';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(ValidationPipe) createTestimonialDto: CreateTestimonialDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.testimonialsService.create(createTestimonialDto, image);
  }

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTestimonialDto: UpdateTestimonialDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.testimonialsService.update(id, updateTestimonialDto, image);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.testimonialsService.softDelete(id);
  }
}
