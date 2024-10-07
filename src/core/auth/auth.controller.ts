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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user-decorator';
import { IUser } from './entities/auth.interface';
import { JwtAuthGuard } from './guards/jwt.auth.guard';


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
  @UseGuards(JwtAuthGuard)
  @Patch('verify-user/:id')
  async verifyUser(
    @Res() res: Response,
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateAuthDto,
    @CurrentUser() currentUser: IUser,
  ) {
    const data = await this.authService.verifyUser(
      userId,
      currentUser,
      updateUserDto,
    );
    return res.status(HttpStatus.OK).json(data);
  }

  @Get('users')
  async findAll(@Res() res: Response) {
    const users = await this.authService.findAllUsers();
    return res.status(HttpStatus.OK).json({
      data: users,
    });
  }
  @Get('user/:id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const user = await this.authService.getUserById(id);
    return res.status(HttpStatus.OK).json({
      data: user,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
