import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { scrypt as _scrypt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';
import { EnvironmentConfig } from 'src/common';
import bcrypt, { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private awsRepositoryService: AwsRepositoryService,
    private jwtService: JwtService,
  ) {}

  async registerUser(signUpDto: SignUpDto) {
    const { Items: users } = await this.awsRepositoryService.runQueryCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      IndexName: 'entityName-createdDate-index',
      KeyConditionExpression: 'entityName = :entityName',
      FilterExpression: 'userName = :userName',
      ExpressionAttributeValues: {
        ':entityName': 'user',
        ':userName': signUpDto.userName,
      },
    });
    const user = users.at(0);
    if (user) {
      throw new UnprocessableEntityException('Username already registered!!!');
    }

    const salt = await bcrypt.genSalt();
    signUpDto.password = await bcrypt.hash(signUpDto.password, salt);

    const { Result: newUser } = await this.awsRepositoryService.runPutCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      Item: {
        id: uuidv4(),
        entityName: 'user',
        createdDate: new Date().toISOString(),
        ...signUpDto,
      },
    });

    // const token = await this.jwtService.signAsync({ userId: newUser.id });

    return {
      message: 'user created successfully',
      data: {
        token: '',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          userName: newUser.userName,
        },
      },
    };
  }

  async signin(signinDto: SignInDto) {
    const { Items: users } = await this.awsRepositoryService.runQueryCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      IndexName: 'entityName-createdDate-index',
      KeyConditionExpression: 'entityName = :entityName',
      FilterExpression: 'userName = :userName',
      ExpressionAttributeValues: {
        ':entityName': 'user',
        ':userName': signinDto.userName,
      },
    });
    const user = users.at(0);
    if (!user) {
      throw new NotFoundException('Username does not exist!');
    }

    const isValidPassword = await compare(signinDto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const token = await this.jwtService.signAsync({ userId: user.userId });

    return {
      message: 'login successfully',
      data: {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
        },
      },
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
