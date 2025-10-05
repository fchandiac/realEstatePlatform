import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../modules/users/dto/user.dto';
import { Audit, AuditInterceptor } from '../../common/interceptors/audit.interceptor';

@Controller('auth')
@UseInterceptors(AuditInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Audit('LOGIN', 'USER', 'Intento de login')
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }
}