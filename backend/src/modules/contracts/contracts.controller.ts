import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto, UpdateContractDto, AddPaymentDto, AddPersonDto, CloseContractDto } from './dto/contract.dto';
import { ContractRole } from '../../entities/contract.entity';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(@Body() createContractDto: CreateContractDto) {
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
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
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
  addPayment(@Param('id') id: string, @Body() addPaymentDto: AddPaymentDto) {
    return this.contractsService.addPayment(id, addPaymentDto);
  }

  @Post(':id/people')
  addPerson(@Param('id') id: string, @Body() addPersonDto: AddPersonDto) {
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
}