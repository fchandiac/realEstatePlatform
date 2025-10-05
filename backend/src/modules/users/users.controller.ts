import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, LoginDto, ChangePasswordDto } from './dto/user.dto';
import { UserStatus, UserRole, Permission } from '../../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, setPassword, validatePassword, ...userResponse } = user as any;
    return userResponse;
  }

  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
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
  assignRole(
    @Param('id') id: string,
    @Body('role', ValidationPipe) role: UserRole,
  ) {
    return this.usersService.assignRole(id, role);
  }

  @Patch(':id/permissions')
  setPermissions(
    @Param('id') id: string,
    @Body('permissions', ValidationPipe) permissions: Permission[],
  ) {
    return this.usersService.setPermissions(id, permissions);
  }

  @Patch(':id/change-password')
  changePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }
}