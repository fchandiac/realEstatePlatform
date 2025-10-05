import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { TeamMembersModule } from './modules/team-members/team-members.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { IdentitiesModule } from './modules/identities/identities.module';
import { AboutUsModule } from './modules/about-us/about-us.module';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    TeamMembersModule,
    ArticlesModule,
    TestimonialsModule,
    IdentitiesModule,
    AboutUsModule,
    UsersModule,
    PropertiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
