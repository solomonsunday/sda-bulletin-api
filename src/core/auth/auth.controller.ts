import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user-decorator';
import { IUser } from './entities/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() signUpDto: SignUpDto) {
    return this.authService.registerUser(signUpDto);
  }

  @Post('login')
  async signin(@Res() res: Response, @Body() signinDto: SignInDto) {
    const data = await this.authService.signin(signinDto);
    return res.status(HttpStatus.OK).json(data);
  }

  @Patch(':id/verify-user')
  async verifyUser(
    @Res() res: Response,
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateAuthDto,
    @CurrentUser() currentUser: IUser,
  ) {
    const data = await this.authService.update(
      userId,
      currentUser,
      updateUserDto,
    );
    console.log(data);
    if (!data) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: 'User not found' });
    } else {
      return res.status(HttpStatus.OK).json(data);
    }
  }

  @Get('users')
  async findAll(@Res() res: Response) {
    const users = await this.authService.findAllUsers();
    return res.status(HttpStatus.OK).json({
      data: users,
    });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(id, updateAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
