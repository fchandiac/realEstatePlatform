import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTestimonialDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  multimediaId?: string;
}

export class UpdateTestimonialDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  multimediaId?: string;
}
