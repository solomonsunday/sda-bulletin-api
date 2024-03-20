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
  Query,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { BulletinService } from './bulletin.service';
import { CreateBulletinDto, UpdateBulletinDto } from './dto/bulletin.dto';
import { Response } from 'express';
import {
  BulletinStatusType,
  QueryParamDto,
} from './entities/bulletin.interface';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
// import { AuthGuard } from '@nestjs/passport';

@UseGuards(JwtAuthGuard)
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
  async findAll(@Res() res: Response, @Query() query: QueryParamDto) {
    const bulletinItems = await this.bulletinService.findAllBulletin(query);
    return res.status(200).json({
      statue: 'OK',
      data: bulletinItems,
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

  @Patch(':id/status')
  async updateStatus(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: { status: BulletinStatusType },
  ) {
    const data = await this.bulletinService.updateStatus({
      bulletinId: id,
      status: query.status,
      currentUser: ' ',
    });
    return res.status(200).json({
      message: data,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bulletinService.deleteBulletin(id);
  }
}
