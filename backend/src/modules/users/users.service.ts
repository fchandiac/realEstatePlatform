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
import { Person } from '../../entities/person.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  ChangePasswordDto,
  ListAdminUsersQueryDto,
} from './dto/user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { AuditService } from '../../audit/audit.service';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';
import { UserFavoriteData } from '../../common/interfaces/user-favorites.interface';
import * as fs from 'fs';
import * as path from 'path';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @Inject(AuditService)
    private readonly auditService: AuditService,
    private readonly configService: ConfigService,
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

    // Use transaction to ensure both user and person are created together
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create user
      const user = this.userRepository.create({
        ...createUserDto,
        status: UserStatus.ACTIVE,
        role: createUserDto.role || UserRole.COMMUNITY,
        permissions: createUserDto.permissions || [],
        personalInfo: createUserDto.personalInfo || {},
      });

      // Hash password using the entity method
      await user.setPassword(createUserDto.password);

      // Save user first to get the ID
      const savedUser = await queryRunner.manager.save(User, user);

      // Create associated person with blank data
      const person = this.personRepository.create({
        verified: false,
        user: savedUser, // Link the person to the user
      });

      await queryRunner.manager.save(Person, person);

      // Commit transaction
      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findAdminUsers(filters: ListAdminUsersQueryDto): Promise<User[]> {
    const { search, status } = filters;

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.ADMIN })
      .andWhere('user.deletedAt IS NULL')
      .orderBy('user.createdAt', 'DESC');

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    if (search) {
      const normalizedSearch = `%${search.toLowerCase()}%`;
      query.andWhere(
        `(
          LOWER(user.username) LIKE :search
          OR LOWER(user.email) LIKE :search
          OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(user.personalInfo, '$.firstName'))) LIKE :search
          OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(user.personalInfo, '$.lastName'))) LIKE :search
          OR LOWER(TRIM(CONCAT(
            COALESCE(JSON_UNQUOTE(JSON_EXTRACT(user.personalInfo, '$.firstName')), ''),
            ' ',
            COALESCE(JSON_UNQUOTE(JSON_EXTRACT(user.personalInfo, '$.lastName')), '')
          ))) LIKE :search
        )`,
        { search: normalizedSearch },
      );
    }

    const admins = await query.getMany();

    admins.forEach((admin) => {
      delete (admin as any).password;
    });

    return admins;
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

  async listAdminsAgents(params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 10 } = params;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .andWhere('user.role IN (:...roles)', { roles: [UserRole.ADMIN, UserRole.AGENT] })
      .orderBy('user.personalInfo->>"$.firstName"', 'ASC');

    if (search) {
      const normalizedSearch = `%${search.toLowerCase()}%`;
      queryBuilder.andWhere(
        `(
          LOWER(JSON_UNQUOTE(JSON_EXTRACT(user.personalInfo, '$.firstName'))) LIKE :search
          OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(user.personalInfo, '$.lastName'))) LIKE :search
          OR LOWER(user.username) LIKE :search
          OR LOWER(user.email) LIKE :search
        )`,
        { search: normalizedSearch }
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Remove password from results
    data.forEach((user) => {
      delete (user as any).password;
    });

    return { data, total, page, limit };
  }

  async listAgents(params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 10 } = params;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .andWhere('user.role = :role', { role: UserRole.AGENT })
      .orderBy('user.personalInfo->>"$.firstName"', 'ASC');

    if (search) {
      const normalizedSearch = `%${search.toLowerCase()}%`;
      queryBuilder.andWhere(
        `(
          LOWER(JSON_UNQUOTE(JSON_EXTRACT(user.personalInfo, '$.firstName'))) LIKE :search
          OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(user.personalInfo, '$.lastName'))) LIKE :search
          OR LOWER(user.username) LIKE :search
          OR LOWER(user.email) LIKE :search
        )`,
        { search: normalizedSearch }
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Remove password from results
    data.forEach((user) => {
      delete (user as any).password;
    });

    return { data, total, page, limit };
  }

  /**
   * Lista las propiedades favoritas de un usuario
   */
  async getUserFavorites(userId: string): Promise<UserFavoriteData[]> {
    const user = await this.findOne(userId);
    return user.favoriteProperties || [];
  }

  /**
   * Verifica si una propiedad es favorita para cualquier usuario y devuelve detalles
   */
  async checkPropertyFavorite(propertyId: string): Promise<{
    isFavorite: boolean;
    favorites: Array<{
      userId: string;
      userName: string;
      userEmail: string;
      favoriteData: UserFavoriteData;
    }>;
  }> {
    // Buscar todos los usuarios que tienen esta propiedad como favorita
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .andWhere('JSON_CONTAINS(user.favoriteProperties, :propertyId, "$.propertyId")', {
        propertyId: JSON.stringify(propertyId)
      })
      .getMany();

    const favorites = users.map(user => {
      // Encontrar el favorito específico para esta propiedad
      const favoriteData = user.favoriteProperties?.find(
        fav => fav.propertyId === propertyId
      );

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        favoriteData: favoriteData!
      };
    });

    return {
      isFavorite: favorites.length > 0,
      favorites
    };
  }

  async updateUserAvatar(id: string, file: Express.Multer.File): Promise<User> {
    console.log('Updating avatar for user:', id);
    console.log('File received:', { originalname: file.originalname, mimetype: file.mimetype, size: file.size, buffer: !!file.buffer });

    const user = await this.userRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!user) throw new NotFoundException('User not found');

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files (jpeg, png, webp) are allowed');
    }

    // Crear directorio absoluto (sin subcarpetas por usuario)
    const uploadDir = path.join(process.cwd(), 'public', 'users');
    console.log('Upload directory:', uploadDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created upload directory');
    }

    // Generar filename con ID del usuario y path
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `avatar-${id}${ext}`;
    const filePath = path.join(uploadDir, filename);
    
    // Generar URL absoluta completa usando BACKEND_PUBLIC_URL
    const backendUrl = this.configService.get<string>('BACKEND_PUBLIC_URL') || 'http://localhost:3000';
    const absoluteUrl = `${backendUrl}/public/users/${filename}`;

    console.log('Saving file to:', filePath);
    console.log('Absolute URL will be:', absoluteUrl);

    // Mover archivo
    fs.writeFileSync(filePath, file.buffer);
    console.log('File saved successfully');

    // Actualizar usuario con URL absoluta
    if (!user.personalInfo) user.personalInfo = {};
    user.personalInfo.avatarUrl = absoluteUrl;
    await this.userRepository.save(user);
    return user;
  }

  async getUserProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
      relations: ['person'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Las URLs ya están guardadas como absolutas en la base de datos
    const backendUrl = this.configService.get<string>('BACKEND_PUBLIC_URL') || 'http://localhost:3000';

    const profile: UserProfileResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      personalInfo: {
        ...user.personalInfo,
        // Las URLs del avatar ya son absolutas, no necesitamos reconstruirlas
        avatarUrl: user.personalInfo?.avatarUrl,
      },
      person: user.person ? {
        id: user.person.id,
        dni: user.person.dni,
        address: user.person.address,
        phone: user.person.phone,
        email: user.person.email,
        verified: user.person.verified,
        dniCardFrontUrl: user.person.dniCardFront ?
          `${backendUrl}/public/${user.person.dniCardFront.id}` : undefined,
        dniCardRearUrl: user.person.dniCardRear ?
          `${backendUrl}/public/${user.person.dniCardRear.id}` : undefined,
      } : undefined,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return plainToInstance(UserProfileResponseDto, profile, { excludeExtraneousValues: true });
  }
}
