import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Req() req, @Res() res) {
    if (req.role === UserRole.ADMIN) {
      return res.status(HttpStatus.OK).json({
        notifications: await this.notificationsService.findAll(UserRole.ADMIN),
      });
    }
    return res.status(HttpStatus.OK).json({
      notifications: await this.notificationsService.findAll(req.channel),
    });
  }

  @Get('unread')
  @UseGuards(AuthGuard)
  async countUnReadNotification(@Req() req, @Res() res) {
    if (req.role === UserRole.ADMIN) {
      return res.status(HttpStatus.OK).json({
        total: await this.notificationsService.countUnReadNotification(
          UserRole.ADMIN,
        ),
      });
    }
    return res.status(HttpStatus.OK).json({
      total: await this.notificationsService.countUnReadNotification(
        req.channel,
      ),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Patch(':id/read')
  readOne(@Param('id') id: string) {
    return this.notificationsService.readNotification(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
