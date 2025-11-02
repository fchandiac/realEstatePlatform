import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideService } from './slide.service';
import { SlideController } from './slide.controller';
import { Slide } from '../../entities/slide.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Slide]),
    AuthModule
  ],
  controllers: [SlideController],
  providers: [SlideService],
  exports: [SlideService],
})
export class SlideModule {}