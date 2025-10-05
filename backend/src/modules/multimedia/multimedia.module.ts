import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultimediaService } from './multimedia.service';
import { MultimediaController } from './multimedia.controller';
import { Multimedia } from '../../entities/multimedia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Multimedia])],
  controllers: [MultimediaController],
  providers: [MultimediaService],
  exports: [MultimediaService],
})
export class MultimediaModule {}