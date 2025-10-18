import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/user.dto';
import {
  Audit,
  AuditInterceptor,
} from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('auth')
@UseInterceptors(AuditInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Audit(AuditAction.LOGIN, AuditEntityType.USER, 'User login attempt')
  async signIn(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('sign-out')
  @Audit(AuditAction.LOGOUT, AuditEntityType.USER, 'User logout request')
  async signOut(@Headers('authorization') authorization?: string) {
    return this.authService.signOut(authorization);
  }
}
