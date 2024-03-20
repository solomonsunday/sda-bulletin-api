import { IsBoolean, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  isVerified: boolean = false;
}

export class SignInDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;
}
