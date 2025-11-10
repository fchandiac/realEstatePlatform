import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamMembersService } from './team-members.service';
import {
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
} from './dto/team-member.dto';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';
import { MultimediaService } from '../multimedia/services/multimedia.service';
import { StaticFilesService } from '../multimedia/services/static-files.service';

@Controller('team-members')
export class TeamMembersController {
  constructor(
    private readonly teamMembersService: TeamMembersService,
    private readonly multimediaService: MultimediaService,
    private readonly staticFilesService: StaticFilesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  @Audit(AuditAction.CREATE, AuditEntityType.TEAM_MEMBER, 'Team member created')
  async create(
    @Body(ValidationPipe) createTeamMemberDto: CreateTeamMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const photoPath = await this.multimediaService.uploadFileToPath(
        file,
        'web/team-members',
      );
      createTeamMemberDto.multimediaUrl = this.staticFilesService.getPublicUrl(
        photoPath,
      );
    }
    return this.teamMembersService.create(createTeamMemberDto);
  }

  @Get()
  @Audit(AuditAction.READ, AuditEntityType.TEAM_MEMBER, 'Team members listed')
  findAll(@Query('search') search?: string) {
    return this.teamMembersService.findAll(search);
  }

  @Get(':id')
  @Audit(AuditAction.READ, AuditEntityType.TEAM_MEMBER, 'Team member viewed')
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  @Audit(AuditAction.UPDATE, AuditEntityType.TEAM_MEMBER, 'Team member updated')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTeamMemberDto: UpdateTeamMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const photoPath = await this.multimediaService.uploadFileToPath(
        file,
        'web/team-members',
      );
      updateTeamMemberDto.multimediaUrl = this.staticFilesService.getPublicUrl(
        photoPath,
      );
    }
    return this.teamMembersService.update(id, updateTeamMemberDto);
  }

  @Delete(':id')
  @Audit(AuditAction.DELETE, AuditEntityType.TEAM_MEMBER, 'Team member deleted')
  softDelete(@Param('id') id: string) {
    return this.teamMembersService.softDelete(id);
  }
}
