import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  content: string;
}

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
