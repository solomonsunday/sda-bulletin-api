import {
  ForbiddenException,
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
import { EntityName } from 'src/common/enum';
import { IUser } from './entities/auth.interface';
import { CachingService } from 'src/common/caching/caching.service';

@Injectable()
export class AuthService {
  constructor(
    private awsRepositoryService: AwsRepositoryService,
    private cachingService: CachingService,
    private jwtService: JwtService,
  ) {}

  async registerUser(signUpDto: SignUpDto) {
    const { Items: users } = await this.awsRepositoryService.runQueryCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      IndexName: 'entityName-createdDate-index',
      KeyConditionExpression: 'entityName = :entityName',
      FilterExpression: 'userName = :userName',
      ExpressionAttributeValues: {
        ':entityName': EntityName.USER,
        ':userName': signUpDto.userName,
      },
    });
    const user = users.at(0);
    if (user) {
      throw new UnprocessableEntityException('Username already exist!!!');
    }

    const salt = await bcrypt.genSalt();
    signUpDto.password = await bcrypt.hash(signUpDto.password, salt);

    const { Result: newUser } = await this.awsRepositoryService.runPutCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      Item: {
        id: uuidv4(),
        entityName: EntityName.USER,
        createdDate: new Date().toISOString(),
        ...signUpDto,
      },
    });

    return {
      message: 'user created successfully',
      data: {
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          userName: newUser.userName,
          isVerified: newUser.isVerified,
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
        ':entityName': EntityName.USER,
        ':userName': signinDto.userName,
      },
    });
    const user = users.at(0);
    if (!user) {
      throw new NotFoundException('Username does not exist!');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('User not verified');
    }

    const isValidPassword = await compare(signinDto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'login successfully',
      data: {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          isVerified: user.isVerified,
        },
      },
    };
  }

  async findAllUsers() {
    const { Items: users } = await this.awsRepositoryService.runQueryCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      IndexName: 'entityName-createdDate-index',
      KeyConditionExpression: 'entityName = :entityName',
      ExpressionAttributeValues: {
        ':entityName': EntityName.USER,
      },
    });
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(
    userId: string,
    currentUser: IUser,
    updateUserDto: UpdateAuthDto,
  ) {
    console.log(userId, 'userId');
    const userData = await this.getUserById(userId);
    const verifyUser = Object.assign({}, userData, {
      updatedBy: currentUser.id,
      ...updateUserDto,
    });
    const { Result: user } = await this.awsRepositoryService.runPutCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      Item: { ...verifyUser },
    });
    await this.cachingService.setDataToCache(userId, userData);
    return {
      message: 'user successfully verified',
      data: user,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const { Items: users } = await this.awsRepositoryService.runQueryCommand({
        TableName: EnvironmentConfig.TABLE_NAME,
        IndexName: 'entityName-createdDate-index',
        KeyConditionExpression: 'entityName = :entityName',
        FilterExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':entityName': 'user',
          ':id': userId,
        },
      });
      const currentUser = users.at(0);
      return currentUser;
    } catch (error) {
      console.log(error);
    }
  }
}
