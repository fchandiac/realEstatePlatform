import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../entities/document.entity';
import { DocumentType } from '../../entities/document-type.entity';
import { User } from '../../entities/user.entity';
import { Multimedia } from '../../entities/multimedia.entity';
import { Payment } from '../../entities/payment.entity';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MultimediaModule } from '../multimedia/multimedia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, DocumentType, User, Multimedia, Payment]),
    MultimediaModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
