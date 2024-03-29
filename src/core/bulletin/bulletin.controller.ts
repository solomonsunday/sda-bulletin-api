import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
  HttpStatus,
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
import { CurrentUser } from '../auth/decorators/current-user-decorator';
import { IUser } from '../auth/entities/auth.interface';
// import { AuthGuard } from '@nestjs/passport';

@UseGuards(JwtAuthGuard)
@Controller('bulletin')
export class BulletinController {
  constructor(private readonly bulletinService: BulletinService) {}

  @Post('create')
  async create(
    @Res() res: Response,
    @Body() createBulletinDto: CreateBulletinDto,
    @CurrentUser() user: IUser,
  ) {
    const data = await this.bulletinService.createBulletin(
      user,
      createBulletinDto,
    );
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
    @CurrentUser() user: IUser,
  ) {
    return this.bulletinService.updateBulletin(id, user, updateBulletinDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: { status: BulletinStatusType },
    @CurrentUser() currentUser: IUser,
  ) {
    const data = await this.bulletinService.updateStatus({
      bulletinId: id,
      status: query.status,
      currentUser,
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
