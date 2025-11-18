import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/user.dto';
import {
  Audit,
  AuditInterceptor,
} from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('auth')
@ApiTags('Authentication')
@UseInterceptors(AuditInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Sign in with email and password
   * Returns access token, user details, and other session info
   */
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in user with credentials' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token and user info',
    schema: {
      example: {
        access_token: 'eyJhbGci...',
        user: {
          id: 'uuid',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'USER',
        },
        expiresIn: 43200,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing or invalid email/password',
  })
  @ApiBody({ type: LoginDto })
  @Audit(AuditAction.LOGIN, AuditEntityType.USER, 'User login attempt')
  async signIn(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  /**
   * Sign out user
   * Invalidates current session token
   */
  @Post('sign-out')
  @ApiOperation({ summary: 'Sign out user and invalidate session' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: { message: 'User logged out successfully' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token from sign-in response',
    required: false,
  })
  @Audit(AuditAction.LOGOUT, AuditEntityType.USER, 'User logout request')
  async signOut(@Headers('authorization') authorization?: string) {
    return this.authService.signOut(authorization);
  }
}
