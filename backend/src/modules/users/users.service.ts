import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  UserStatus,
  UserRole,
  Permission,
} from '../../entities/user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { AuditService } from '../../audit/audit.service';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(AuditService)
    private readonly auditService: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'El nombre de usuario o correo ya está registrado.',
      );
    }

    const user = this.userRepository.create({
      ...createUserDto,
      status: UserStatus.ACTIVE,
      role: createUserDto.role || UserRole.COMMUNITY,
      permissions: createUserDto.permissions || [],
      personalInfo: createUserDto.personalInfo || {},
    });

    // Hash password using the entity method
    await user.setPassword(createUserDto.password);

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check if username or email is being updated and already exists
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new ConflictException('El nombre de usuario ya está registrado.');
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('El correo ya está registrado.');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softDelete(id);
  }

  async login(loginDto: LoginDto): Promise<User> {
    console.log('Login attempt for email:', loginDto.email);
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email, deletedAt: IsNull() },
    });

    console.log('User found:', !!user);
    if (user) {
      console.log('User status:', user.status);
      console.log('Stored password hash:', user.password);
      console.log('Provided password:', loginDto.password);
      const isPasswordValid = await user.validatePassword(loginDto.password);
      console.log('Password valid:', isPasswordValid);
    }

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuario inactivo.');
    }

    return user;
  }

  async assignRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findOne(id);
    const oldRole = user.role;
    user.role = role;
    const updatedUser = await this.userRepository.save(user);

    // Audit logging
    await this.auditService.createAuditLog({
      userId: id,
      action: AuditAction.ROLE_CHANGED,
      entityType: AuditEntityType.USER,
      entityId: id,
      description: `Rol del usuario cambiado de ${oldRole} a ${role}`,
      oldValues: { role: oldRole },
      newValues: { role },
      success: true,
    });

    return updatedUser;
  }

  async setPermissions(id: string, permissions: Permission[]): Promise<User> {
    const user = await this.findOne(id);
    const oldPermissions = user.permissions;
    user.permissions = permissions;
    const updatedUser = await this.userRepository.save(user);

    // Audit logging
    await this.auditService.createAuditLog({
      userId: id,
      action: AuditAction.PERMISSIONS_CHANGED,
      entityType: AuditEntityType.USER,
      entityId: id,
      description: `Permisos del usuario actualizados`,
      oldValues: { permissions: oldPermissions },
      newValues: { permissions },
      success: true,
    });

    return updatedUser;
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      12,
    );
    await this.userRepository.update(id, { password: hashedNewPassword });

    // Audit log
    await this.auditService.createAuditLog({
      userId: id,
      action: AuditAction.PASSWORD_CHANGED,
      entityType: AuditEntityType.USER,
      entityId: id,
      description: `Contraseña cambiada para el usuario ${user.email}`,
      success: true,
    });
  }

  async setStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const oldStatus = user.status;
    user.status = status;
    const updatedUser = await this.userRepository.save(user);

    // Audit logging
    await this.auditService.createAuditLog({
      userId: id,
      action: AuditAction.STATUS_CHANGED,
      entityType: AuditEntityType.USER,
      entityId: id,
      description: `Estado del usuario cambiado de ${oldStatus} a ${status}`,
      oldValues: { status: oldStatus },
      newValues: { status },
      success: true,
    });

    return updatedUser;
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Audit logging
    await this.auditService.createAuditLog({
      userId: id,
      action: AuditAction.PROFILE_VIEWED,
      entityType: AuditEntityType.USER,
      entityId: id,
      description: `Perfil del usuario ${user.email} visualizado`,
      success: true,
    });

    return user;
  }
}
