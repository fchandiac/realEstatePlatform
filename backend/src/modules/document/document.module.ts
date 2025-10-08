import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../entities/document.entity';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MultimediaModule } from '../multimedia/multimedia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    MultimediaModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}