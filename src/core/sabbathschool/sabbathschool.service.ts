import { Injectable } from '@nestjs/common';
import { CreateSabbathschoolDto } from './dto/create-sabbathschool.dto';
import { UpdateSabbathschoolDto } from './dto/update-sabbathschool.dto';

@Injectable()
export class SabbathschoolService {
  create(createSabbathschoolDto: CreateSabbathschoolDto) {
    return 'This action adds a new sabbathschool';
  }

  findAll() {
    return `This action returns all sabbathschool`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sabbathschool`;
  }

  update(id: number, updateSabbathschoolDto: UpdateSabbathschoolDto) {
    return `This action updates a #${id} sabbathschool`;
  }

  remove(id: number) {
    return `This action removes a #${id} sabbathschool`;
  }
}
