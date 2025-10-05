import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { JweService } from '../jwe/jwe.service';
import { LoginDto } from '../../modules/users/dto/user.dto';

export interface SignInResult {
  access_token: string;
  userId: string;
  email: string;
  role: string;
  name: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jweService: JweService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<SignInResult> {
    try {
      // Validate user credentials
      const user = await this.usersService.login(loginDto);

      // Create JWT payload
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      // Generate JWE token
      const access_token = await this.jweService.encrypt(payload, '15m');

      return {
        access_token,
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      };
    } catch (error) {
      // Re-throw with generic message for security
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}