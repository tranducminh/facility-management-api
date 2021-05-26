import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('notifications')
@UseGuards(AuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
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

  @Put(':id/read')
  readOne(@Param('id') id: string) {
    return this.notificationsService.readNotification(+id);
  }
}
