import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './config/ormconfig';
import { TeamMembersModule } from './modules/team-members/team-members.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { IdentitiesModule } from './modules/identities/identities.module';
import { AboutUsModule } from './modules/about-us/about-us.module';
import { UsersModule } from './modules/users/users.module';
import { PropertyModule } from './modules/property/property.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { PeopleModule } from './modules/people/people.module';
import { MultimediaModule } from './modules/multimedia/multimedia.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DocumentTypesModule } from './modules/document-types/document-types.module';
import { PropertyTypesModule } from './modules/property-types/property-types.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { DocumentModule } from './modules/document/document.module';
import { SlidersModule } from './modules/sliders/sliders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: ormConfig,
      inject: [ConfigService],
    }),
    TeamMembersModule,
    ArticlesModule,
    TestimonialsModule,
    IdentitiesModule,
    AboutUsModule,
    UsersModule,
    PropertyModule,
    ContractsModule,
    PeopleModule,
    MultimediaModule,
    NotificationsModule,
    DocumentTypesModule,
    PropertyTypesModule,
    AuthModule,
    AuditModule,
    DocumentModule,
    AnalyticsModule,
    SlidersModule,
    // CustomConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
