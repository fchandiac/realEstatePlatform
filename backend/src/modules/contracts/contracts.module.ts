import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Contract } from '../../entities/contract.entity';
import { DocumentTypesModule } from '../document-types/document-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    DocumentTypesModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
