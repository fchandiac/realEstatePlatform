import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { JweService } from '../../../auth/jwe/jwe.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly jweService: JweService) {
    super();
  }

  async validate(request: any) {
    console.log('JWT Strategy validate called');
    const token = this.extractTokenFromHeader(request);
    console.log('Extracted token:', token ? 'present' : 'null');

    if (!token) {
      console.log('No token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      console.log('Attempting to decrypt token');
      // Decrypt the JWE token
      const decryptedPayload = await this.jweService.decrypt(token);
      console.log('Decrypted payload:', decryptedPayload);

      if (!decryptedPayload) {
        console.log('No decrypted payload');
        throw new UnauthorizedException('Invalid token');
      }

      // Check if token is expired
      if (decryptedPayload.exp && decryptedPayload.exp * 1000 < Date.now()) {
        console.log('Token expired');
        throw new UnauthorizedException('Token expired');
      }

      // Return user information
      const user = {
        id: decryptedPayload.sub,
        email: decryptedPayload.email,
        role: decryptedPayload.role,
      };
      console.log('Returning user:', user);
      return user;
    } catch (error) {
      console.log('Error in JWT strategy:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
