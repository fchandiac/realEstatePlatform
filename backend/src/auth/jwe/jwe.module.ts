import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JweService } from './jwe.service';
import { JoseWrapperService } from './jose-wrapper.service';

@Module({
  imports: [ConfigModule],
  providers: [JweService, JoseWrapperService],
  exports: [JweService],
})
export class JweModule {}