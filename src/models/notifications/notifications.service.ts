import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { catchError } from 'src/common/helpers/catch-error';
import { Repository } from 'typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Facility } from '../facilities/entities/facility.entity';
import { Repairman } from '../repairman/entities/repairman.entity';
import { Request } from '../requests/entities/request.entity';
import { Room } from '../rooms/entities/room.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}
  async create({
    receiver,
    sender,
    type,
    request,
    room,
    facility,
  }: {
    receiver?: Admin | Employee | Repairman;
    sender?: Admin | Employee | Repairman;
    type: NotificationType;
    request?: Request;
    room?: Room;
    facility?: Facility;
  }) {
    try {
      const notification = this.notificationRepository.create({
        type: type,
        receiverId: receiver ? receiver.id : 1,
        receiverChannel: receiver ? receiver.channel : 'admin',
        receiverType: !receiver
          ? UserRole.ADMIN
          : receiver instanceof Employee
          ? UserRole.EMPLOYEE
          : receiver instanceof Repairman
          ? UserRole.REPAIRMAN
          : null,
        senderId: sender ? sender.id : 1,
        senderType: !sender
          ? UserRole.ADMIN
          : sender instanceof Employee
          ? UserRole.EMPLOYEE
          : sender instanceof Repairman
          ? UserRole.REPAIRMAN
          : null,
        content:
          type === NotificationType.NEW_REQUEST
            ? `${sender.name} đã tạo một yêu cầu mới #${request.id}`
            : type === NotificationType.APPROVED_REQUEST
            ? `Admin đã chấp thuận yêu cầu #${request.id}`
            : type === NotificationType.REJECTED_REQUEST
            ? `Admin đã từ chối yêu cầu #${request.id}`
            : type === NotificationType.INPROCESS_REQUEST
            ? `Yêu cầu #${request.id} đang được thực hiện`
            : type === NotificationType.COMPLETED_REQUEST
            ? `Yêu cầu #${request.id} đã được hoàn thành`
            : type === NotificationType.UNCOMPLETED_REQUEST
            ? `Yêu cầu #${request.id} không được hoàn thành`
            : type === NotificationType.ASSIGNED_TASK
            ? `Bạn đã được giao nhiệm vụ #${request.id}`
            : type === NotificationType.STARTED_TASK
            ? `${sender.name} đã bắt đầu nhiệm vụ #${request.id}`
            : type === NotificationType.REJECTED_TASK
            ? `${sender.name} đã từ chối nhiệm vụ #${request.id}`
            : type === NotificationType.COMPLETED_TASK
            ? `${sender.name} đã hoàn thành nhiệm vụ #${request.id}`
            : type === NotificationType.UNCOMPLETED_TASK
            ? `${sender.name} đã không thể hoàn thành nhiệm vụ #${request.id}`
            : type === NotificationType.CANCELED_TASK
            ? `Nhiệm vụ #${request.id} đã bị hủy bỏ`
            : type === NotificationType.NEW_ROOM
            ? `Bạn đã được thêm vào phòng ${room.floor.building.name}/${room.name}`
            : type === NotificationType.PENDING_ROOM
            ? `Bạn đã được chuyển vào phòng chờ`
            : type === NotificationType.NEW_FACILITY_OWNER
            ? `Bạn đã được bàn giao ${facility.name}`
            : type === NotificationType.REMOVED_FACILITY_OWNER
            ? `Bạn không còn quyền sử dụng ${facility.name}`
            : type === NotificationType.UPDATED_FACILITY_INFO
            ? `Thông tin ${facility.name} đã được cập nhật`
            : type === NotificationType.UPDATED_PROFILE
            ? `Thông tin cá nhân của bạn đã được cập nhật`
            : null,
      });

      const newNotification = await this.notificationRepository.save(
        notification,
      );
      console.log(newNotification);
      if (process.env.ENABLED_NOTIFICATION === 'true') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Pusher = require('pusher');
        const pusher = new Pusher({
          appId: process.env.PUSHER_APP_ID,
          key: process.env.PUSHER_KEY,
          secret: process.env.PUSHER_SECRET,
          cluster: process.env.PUSHER_CLUSTER,
          useTLS: true,
        });
        await pusher.trigger(newNotification.receiverChannel, 'common', {
          notification: newNotification,
        });
      }
      return newNotification;
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async findAll(receiverChannel: string): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: { receiverChannel },
        take: 20,
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async countUnReadNotification(receiverChannel: string): Promise<number> {
    try {
      return await this.notificationRepository.count({
        where: { receiverChannel, isRead: false },
      });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }

  async readNotification(id: number) {
    try {
      return await this.notificationRepository.update(id, { isRead: true });
    } catch (error) {
      console.log(error);
      catchError(error);
    }
  }
}
