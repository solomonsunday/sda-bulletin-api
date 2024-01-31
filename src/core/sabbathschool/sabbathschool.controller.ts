import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SabbathschoolService } from './sabbathschool.service';
import { CreateSabbathschoolDto } from './dto/create-sabbathschool.dto';
import { UpdateSabbathschoolDto } from './dto/update-sabbathschool.dto';

@Controller('sabbathschool')
export class SabbathschoolController {
  constructor(private readonly sabbathschoolService: SabbathschoolService) {}

  @Post()
  create(@Body() createSabbathschoolDto: CreateSabbathschoolDto) {
    return this.sabbathschoolService.create(createSabbathschoolDto);
  }

  @Get()
  findAll() {
    return this.sabbathschoolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sabbathschoolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSabbathschoolDto: UpdateSabbathschoolDto) {
    return this.sabbathschoolService.update(+id, updateSabbathschoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sabbathschoolService.remove(+id);
  }
}
