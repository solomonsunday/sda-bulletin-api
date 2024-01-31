import { Injectable } from '@nestjs/common';
import { CreateDivineServiceDto } from './dto/create-divine-service.dto';
import { UpdateDivineServiceDto } from './dto/update-divine-service.dto';

@Injectable()
export class DivineServiceService {
  create(createDivineServiceDto: CreateDivineServiceDto) {
    return 'This action adds a new divineService';
  }

  findAll() {
    return `This action returns all divineService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} divineService`;
  }

  update(id: number, updateDivineServiceDto: UpdateDivineServiceDto) {
    return `This action updates a #${id} divineService`;
  }

  remove(id: number) {
    return `This action removes a #${id} divineService`;
  }
}
