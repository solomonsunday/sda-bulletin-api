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
} from '@nestjs/common';
import { BulletinService } from './bulletin.service';
import { CreateBulletinDto, UpdateBulletinDto } from './dto/bulletin.dto';
import { Response } from 'express';

@Controller('bulletin')
export class BulletinController {
  constructor(private readonly bulletinService: BulletinService) {}

  @Post('create')
  async create(
    @Res() res: Response,
    @Body() createBulletinDto: CreateBulletinDto,
  ) {
    const data = await this.bulletinService.createBulletin(createBulletinDto);
    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const bulletinItem = await this.bulletinService.findAllBulletin();
    return res.status(200).json({
      statue: 'OK',
      data: bulletinItem,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bulletinService.getBulletinById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBulletinDto: UpdateBulletinDto,
  ) {
    return this.bulletinService.updateBulletin(id, updateBulletinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bulletinService.deleteBulletin(id);
  }
}
