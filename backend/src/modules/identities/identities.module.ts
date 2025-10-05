import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from '../../entities/identity.entity';
import { IdentitiesService } from './identities.service';
import { IdentitiesController } from './identities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Identity])],
  controllers: [IdentitiesController],
  providers: [IdentitiesService],
  exports: [IdentitiesService],
})
export class IdentitiesModule {}