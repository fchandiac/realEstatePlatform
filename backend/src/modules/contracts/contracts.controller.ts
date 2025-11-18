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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
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
import type { Express } from 'express';

@ApiTags('Contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  /**
   * Create a new contract
   */
  @Post()
  @ApiOperation({ summary: 'Create new contract' })
  @ApiResponse({
    status: 201,
    description: 'Contract created successfully',
  })
  @ApiBody({ type: CreateContractDto })
  create(@Body(ValidationPipe) createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  /**
   * Get all contracts
   */
  @Get()
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiResponse({
    status: 200,
    description: 'List of all contracts',
  })
  findAll() {
    return this.contractsService.findAll();
  }

  /**
   * Get contract by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get contract by ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract details',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  /**
   * Update contract
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update contract' })
  @ApiResponse({
    status: 200,
    description: 'Contract updated successfully',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateContractDto })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, updateContractDto);
  }

  /**
   * Delete contract (soft delete)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete contract' })
  @ApiResponse({
    status: 200,
    description: 'Contract deleted successfully',
  })
  @ApiParam({ name: 'id', type: String })
  softDelete(@Param('id') id: string) {
    return this.contractsService.softDelete(id);
  }

  /**
   * Close a contract with settlement details
   */
  @Post(':id/close')
  @ApiOperation({ summary: 'Close contract' })
  @ApiResponse({
    status: 200,
    description: 'Contract closed successfully',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: CloseContractDto })
  close(@Param('id') id: string, @Body() closeContractDto: CloseContractDto) {
    return this.contractsService.close(id, closeContractDto);
  }

  /**
   * Mark contract as failed
   */
  @Post(':id/fail')
  @ApiOperation({ summary: 'Mark contract as failed' })
  @ApiResponse({
    status: 200,
    description: 'Contract marked as failed',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      example: { endDate: '2024-01-01' },
    },
  })
  fail(@Param('id') id: string, @Body('endDate') endDate: Date) {
    return this.contractsService.fail(id, endDate);
  }

  /**
   * Add payment to contract
   */
  @Post(':id/payments')
  @ApiOperation({ summary: 'Add payment to contract' })
  @ApiResponse({
    status: 201,
    description: 'Payment added successfully',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddPaymentDto })
  addPayment(
    @Param('id') id: string,
    @Body(ValidationPipe) addPaymentDto: AddPaymentDto,
  ) {
    return this.contractsService.addPayment(id, addPaymentDto);
  }

  /**
   * Add person to contract with role
   */
  @Post(':id/people')
  @ApiOperation({ summary: 'Add person to contract' })
  @ApiResponse({
    status: 201,
    description: 'Person added to contract',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddPersonDto })
  addPerson(
    @Param('id') id: string,
    @Body(ValidationPipe) addPersonDto: AddPersonDto,
  ) {
    return this.contractsService.addPerson(id, addPersonDto);
  }

  /**
   * Get people in contract by role
   */
  @Get(':id/people')
  @ApiOperation({ summary: 'Get contract people by role' })
  @ApiResponse({
    status: 200,
    description: 'List of people in contract',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'role', required: false })
  getPeopleByRole(@Param('id') id: string, @Query('role') role: ContractRole) {
    return this.contractsService.getPeopleByRole(id, role);
  }

  /**
   * Validate required roles in contract
   */
  @Post(':id/validate-roles')
  @ApiOperation({ summary: 'Validate contract required roles' })
  @ApiResponse({
    status: 200,
    description: 'Validation result',
  })
  @ApiParam({ name: 'id', type: String })
  async validateRequiredRoles(@Param('id') id: string) {
    const contract = await this.contractsService.findOne(id);
    return this.contractsService.validateRequiredRoles(contract);
  }

  /**
   * Upload contract document
   */
  @Post('upload-document')
  @ApiOperation({ summary: 'Upload contract document' })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
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

  /**
   * Associate document to payment
   */
  @Post('payments/:paymentId/documents/:documentId/associate')
  @ApiOperation({ summary: 'Associate document to payment' })
  @ApiResponse({
    status: 200,
    description: 'Document associated successfully',
  })
  @ApiParam({ name: 'paymentId', type: String })
  @ApiParam({ name: 'documentId', type: String })
  associateDocumentToPayment(
    @Param('paymentId') paymentId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.contractsService.associateDocumentToPayment(paymentId, documentId);
  }

  /**
   * Get payment documents
   */
  @Get('payments/:paymentId/documents')
  @ApiOperation({ summary: 'Get payment documents' })
  @ApiResponse({
    status: 200,
    description: 'List of payment documents',
  })
  @ApiParam({ name: 'paymentId', type: String })
  getPaymentDocuments(@Param('paymentId') paymentId: string) {
    return this.contractsService.getPaymentDocuments(paymentId);
  }

  /**
   * Validate payment with documents
   */
  @Get('payments/:paymentId/validate')
  @ApiOperation({ summary: 'Validate payment with documents' })
  @ApiResponse({
    status: 200,
    description: 'Payment validation result',
  })
  @ApiParam({ name: 'paymentId', type: String })
  validatePaymentWithDocuments(@Param('paymentId') paymentId: string) {
    return this.contractsService.validatePaymentWithDocuments(paymentId);
  }
}
