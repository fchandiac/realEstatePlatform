import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto/team-member.dto';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  create(@Body(ValidationPipe) createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamMembersService.create(createTeamMemberDto);
  }

  @Get()
  findAll() {
    return this.teamMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTeamMemberDto: UpdateTeamMemberDto,
  ) {
    return this.teamMembersService.update(id, updateTeamMemberDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.teamMembersService.softDelete(id);
  }
}