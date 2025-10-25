import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';
import { Slider } from '../../entities/slider.entity';
import { MultimediaModule } from '../multimedia/multimedia.module';

@Module({
  imports: [TypeOrmModule.forFeature([Slider]), MultimediaModule],
  controllers: [SlidersController],
  providers: [SlidersService],
})
export class SlidersModule {}