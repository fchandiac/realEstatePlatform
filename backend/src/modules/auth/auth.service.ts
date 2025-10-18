import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/user.dto';
import { JweService } from '../../auth/jwe/jwe.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jweService: JweService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await this.usersService.login(loginDto);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    // Generar el token JWE usando JweService
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const access_token = await this.jweService.encrypt(payload, '1h');
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      access_token,
    };
  }

  async signOut(authorizationHeader?: string) {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Token requerido para cerrar sesión');
    }

    const token = authorizationHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      await this.jweService.decrypt(token);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error in signOut:', message);
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
  }
}
