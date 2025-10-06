import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultimediaService } from './multimedia.service';
import { MultimediaController } from './multimedia.controller';
import { Multimedia } from '../../entities/multimedia.entity';
import { MultimediaController as UploadMultimediaController } from './controllers/multimedia.controller';
import { MultimediaService as UploadMultimediaService } from './services/multimedia.service';
import { StaticFilesService } from './services/static-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Multimedia])],
  controllers: [MultimediaController, UploadMultimediaController],
  providers: [MultimediaService, UploadMultimediaService, StaticFilesService],
  exports: [MultimediaService, UploadMultimediaService],
})
export class MultimediaModule {}