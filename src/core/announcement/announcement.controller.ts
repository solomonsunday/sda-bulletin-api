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
import { CurrentUser } from '../auth/decorators/current-user-decorator';
import { IUser } from '../auth/entities/auth.interface';

@UseGuards(JwtAuthGuard)
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('create')
  async create(
    @Res() res: Response,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @CurrentUser() currentUser: IUser,
  ) {
    const data = await this.announcementService.createAnnouncement(
      currentUser,
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
  async findOne(@Param('id') id: string) {
    return this.announcementService.getAnnounceById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @CurrentUser() currentUser: IUser,
  ) {
    return this.announcementService.updateAnnouncement(
      id,
      currentUser,
      updateAnnouncementDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.announcementService.deleteAnnouncement(id);
  }
}
