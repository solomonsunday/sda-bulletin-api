import { Injectable } from '@nestjs/common';
import { CreateSabathSchoolDto } from './dto/sabath-school.dto';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SabathSchoolService {
  constructor(private awsRepositoryService: AwsRepositoryService) {}

  async create(createSabathSchoolDto: CreateSabathSchoolDto) {
    const { Result: newUser } = await this.awsRepositoryService.runPutCommand({
      Item: {
        id: uuidv4(),
        entityName: 'user',
        createdDate: new Date().toISOString(),
        ...createSabathSchoolDto,
      },
    });
    console.log(newUser);
  }

  findAll() {
    return `This action returns all sabathSchool`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sabathSchool`;
  }

  update(id: number, updateSabathSchoolDto: any) {
    return `This action updates a #${id} sabathSchool`;
  }

  remove(id: number) {
    return `This action removes a #${id} sabathSchool`;
  }
}
