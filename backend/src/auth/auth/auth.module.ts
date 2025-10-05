import { Module } from '@nestjs/common';
import { UsersModule } from '../../modules/users/users.module';
import { JweModule } from '../jwe/jwe.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, JweModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}