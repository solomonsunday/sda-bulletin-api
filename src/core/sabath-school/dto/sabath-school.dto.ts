import { IsString } from 'class-validator';

export class CreateSabathSchoolDto {
  @IsString()
  singspirationTime: string;
}
