import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import {
  CreatePersonDto,
  UpdatePersonDto,
  LinkUserDto,
} from './dto/person.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.peopleService.update(id, updatePersonDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.peopleService.softDelete(id);
  }

  @Post(':id/verify')
  verify(@Param('id') id: string) {
    return this.peopleService.verify(id);
  }

  @Post(':id/unverify')
  unverify(@Param('id') id: string) {
    return this.peopleService.unverify(id);
  }

  @Post(':id/request-verification')
  requestVerification(@Param('id') id: string) {
    return this.peopleService.requestVerification(id);
  }

  @Post(':id/link-user')
  linkUser(@Param('id') id: string, @Body() linkUserDto: LinkUserDto) {
    return this.peopleService.linkUser(id, linkUserDto);
  }

  @Post(':id/unlink-user')
  unlinkUser(@Param('id') id: string) {
    return this.peopleService.unlinkUser(id);
  }
}
