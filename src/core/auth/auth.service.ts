import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { scrypt as _scrypt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  async create(signUpDto: SignUpDto) {
    const client = new DynamoDBClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'AKIAU6GDWNX2DZ4WHU3I',
        secretAccessKey: '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',
      },
    });
    try {
      const command = new PutCommand({
        TableName: 'ogbachurchbulletin',
        // For more information about data types,
        // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes and
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors
        Item: {
          id: uuidv4(),
          entityName: 'user',
          createdDate: new Date().toISOString(),
          ...signUpDto,
        },
      });

      const response = await client.send(command);
      console.log(response);
      // if (foundUser) {
      //   throw new ForbiddenException('email is in use');
      // }

      // const salt = randomBytes(8).toString('hex');
      // const hashed = (await scrypt(signUpDto.password, salt, 32)) as Buffer;
      // const hashedPassword = salt + '.' + hashed.toString('hex');

      // const newUser = await this.user.create({
      //   data: { ...signUpDto, password: hashedPassword },
      // });

      // const token = await this.jwtService.signAsync({ userId: newUser.id });

      // return {
      //   message: 'user created successfully',
      //   data: {
      //     token,
      //     user: {
      //       id: newUser.id,
      //       firstName: newUser.firstName,
      //       lastName: newUser.lastName,
      //       userType: newUser.userType,
      //     },
      //   },
      // };
    } catch (error) {
      // this.errorService.catchError(error);
      console.log(error);
    }
  }

  async signin(signinDto: SignInDto) {
    try {
      const user = '';
      if (!user) {
        throw new NotFoundException('user not found!');
      }
      const [salt, storedHashedPassword] = user.password.split('.');
      const hash = (await scrypt(signinDto.password, salt, 32)) as Buffer;

      if (storedHashedPassword !== hash.toString('hex')) {
        throw new BadRequestException('incorrect password');
      }

      const token = await this.jwtService.signAsync({ userId: user.id });

      return {
        message: 'login successfully',
        data: {
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
          },
        },
      };
    } catch (error) {
      // this.errorService.catchError(error);
    }
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
