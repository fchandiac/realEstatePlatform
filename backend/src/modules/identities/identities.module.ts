import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from '../../entities/identity.entity';
import { IdentitiesService } from './identities.service';
import { IdentitiesController } from './identities.controller';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Identity]), AuthModule, AuditModule],
  controllers: [IdentitiesController],
  providers: [IdentitiesService],
  exports: [IdentitiesService],
})
export class IdentitiesModule {}
