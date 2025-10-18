import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  ChangePasswordDto,
  AssignRoleDto,
  UpdatePermissionsDto,
  ListAdminUsersQueryDto,
} from './dto/user.dto';
import { UserStatus, UserRole, Permission } from '../../entities/user.entity';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, setPassword, validatePassword, ...userResponse } =
      user as any;
    return userResponse;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('admins')
  listAdmins(@Query(ValidationPipe) filters: ListAdminUsersQueryDto) {
    return this.usersService.findAdminUsers(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/status')
  setStatus(
    @Param('id') id: string,
    @Body('status', ValidationPipe) status: UserStatus,
  ) {
    return this.usersService.setStatus(id, status);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard)
  assignRole(
    @Param('id') id: string,
    @Body(ValidationPipe) assignRoleDto: AssignRoleDto,
  ) {
    return this.usersService.assignRole(id, assignRoleDto.role);
  }

  @Patch(':id/permissions')
  @UseGuards(JwtAuthGuard)
  setPermissions(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePermissionsDto: UpdatePermissionsDto,
  ) {
    return this.usersService.setPermissions(
      id,
      updatePermissionsDto.permissions,
    );
  }

  @Patch(':id/change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }
}
