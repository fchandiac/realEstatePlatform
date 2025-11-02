import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { User } from '../../entities/user.entity';
import { PropertyType } from '../../entities/property-type.entity';
import { Multimedia } from '../../entities/multimedia.entity';
import { AuditModule } from '../../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MultimediaModule } from '../multimedia/multimedia.module';

@Module({
  imports: [TypeOrmModule.forFeature([Property, User, Multimedia, PropertyType]), AuditModule, NotificationsModule, MultimediaModule],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
