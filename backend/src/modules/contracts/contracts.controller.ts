import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractsService } from './contracts.service';
import {
  CreateContractDto,
  UpdateContractDto,
  AddPaymentDto,
  AddPersonDto,
  CloseContractDto,
  UploadContractDocumentDto,
} from './dto/contract.dto';
import { ContractRole } from '../../entities/contract.entity';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Express } from 'express';

@ApiTags('contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(@Body(ValidationPipe) createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  @Get()
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.contractsService.softDelete(id);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() closeContractDto: CloseContractDto) {
    return this.contractsService.close(id, closeContractDto);
  }

  @Post(':id/fail')
  fail(@Param('id') id: string, @Body('endDate') endDate: Date) {
    return this.contractsService.fail(id, endDate);
  }

  @Post(':id/payments')
  addPayment(
    @Param('id') id: string,
    @Body(ValidationPipe) addPaymentDto: AddPaymentDto,
  ) {
    return this.contractsService.addPayment(id, addPaymentDto);
  }

  @Post(':id/people')
  addPerson(
    @Param('id') id: string,
    @Body(ValidationPipe) addPersonDto: AddPersonDto,
  ) {
    return this.contractsService.addPerson(id, addPersonDto);
  }

  @Get(':id/people')
  getPeopleByRole(@Param('id') id: string, @Query('role') role: ContractRole) {
    return this.contractsService.getPeopleByRole(id, role);
  }

  @Post(':id/validate-roles')
  async validateRequiredRoles(@Param('id') id: string) {
    const contract = await this.contractsService.findOne(id);
    return this.contractsService.validateRequiredRoles(contract);
  }

  @Post('upload-document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
        },
        documentTypeId: {
          type: 'string',
          format: 'uuid',
        },
        contractId: {
          type: 'string',
          format: 'uuid',
        },
        uploadedById: {
          type: 'string',
          format: 'uuid',
        },
        notes: {
          type: 'string',
        },
        seoTitle: {
          type: 'string',
        },
      },
    },
  })
  uploadContractDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadContractDocumentDto: UploadContractDocumentDto,
  ) {
    return this.contractsService.uploadContractDocument(
      file,
      uploadContractDocumentDto,
    );
  }

  @Post('payments/:paymentId/documents/:documentId/associate')
  associateDocumentToPayment(
    @Param('paymentId') paymentId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.contractsService.associateDocumentToPayment(paymentId, documentId);
  }

  @Get('payments/:paymentId/documents')
  getPaymentDocuments(@Param('paymentId') paymentId: string) {
    return this.contractsService.getPaymentDocuments(paymentId);
  }

  @Get('payments/:paymentId/validate')
  validatePaymentWithDocuments(@Param('paymentId') paymentId: string) {
    return this.contractsService.validatePaymentWithDocuments(paymentId);
  }
}
