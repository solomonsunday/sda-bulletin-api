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
  UseGuards,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/announcement.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('create')
  async create(
    @Res() res: Response,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ) {
    const data = await this.announcementService.createAnnouncement(
      createAnnouncementDto,
    );
    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const data = await this.announcementService.getAnnouncements();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched announcements',
      data,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementService.getAnnounceById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementService.updateAnnouncement(
      id,
      updateAnnouncementDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementService.deleteAnnouncement(id);
  }
}
