import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SabathSchoolService } from './sabath-school.service';
import { CreateSabathSchoolDto } from './dto/sabath-school.dto';

@Controller('sabath-school')
export class SabathSchoolController {
  constructor(private readonly sabathSchoolService: SabathSchoolService) {}

  @Post()
  create(@Body() createSabathSchoolDto: CreateSabathSchoolDto) {
    return this.sabathSchoolService.create(createSabathSchoolDto);
  }

  @Get()
  findAll() {
    return this.sabathSchoolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sabathSchoolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSabathSchoolDto: any) {
    return this.sabathSchoolService.update(+id, updateSabathSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sabathSchoolService.remove(+id);
  }
}
