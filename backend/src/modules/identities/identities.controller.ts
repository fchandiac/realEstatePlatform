import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { IdentitiesService } from './identities.service';
import { CreateIdentityDto, UpdateIdentityDto } from './dto/identity.dto';

@Controller('identities')
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) {}

  @Post()
  create(@Body(ValidationPipe) createIdentityDto: CreateIdentityDto) {
    return this.identitiesService.create(createIdentityDto);
  }

  @Get()
  findAll() {
    return this.identitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.identitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateIdentityDto: UpdateIdentityDto,
  ) {
    return this.identitiesService.update(id, updateIdentityDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.identitiesService.softDelete(id);
  }
}