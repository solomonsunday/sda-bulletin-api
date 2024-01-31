import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class SignInDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;
}
