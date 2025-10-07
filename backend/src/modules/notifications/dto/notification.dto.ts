import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
  IsArray,
  IsString,
  IsEmail,
} from 'class-validator';
import { NotificationType } from '../../../entities/notification.entity';

export class CreateNotificationDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  targetUserIds: string[];

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsUUID('4')
  @IsOptional()
  multimediaId?: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  targetMails?: string[];
}

export class UpdateNotificationDto {
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsUUID('4')
  @IsOptional()
  multimediaId?: string;

  @IsUUID('4')
  @IsOptional()
  viewerId?: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  targetMails?: string[];
}
