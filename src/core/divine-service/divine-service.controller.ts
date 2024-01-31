import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DivineServiceService } from './divine-service.service';
import { CreateDivineServiceDto } from './dto/create-divine-service.dto';
import { UpdateDivineServiceDto } from './dto/update-divine-service.dto';

@Controller('divine-service')
export class DivineServiceController {
  constructor(private readonly divineServiceService: DivineServiceService) {}

  @Post()
  create(@Body() createDivineServiceDto: CreateDivineServiceDto) {
    return this.divineServiceService.create(createDivineServiceDto);
  }

  @Get()
  findAll() {
    return this.divineServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.divineServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDivineServiceDto: UpdateDivineServiceDto) {
    return this.divineServiceService.update(+id, updateDivineServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.divineServiceService.remove(+id);
  }
}
