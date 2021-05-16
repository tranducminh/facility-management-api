import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import Pusher from 'pusher';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import {
  AfterInsert,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false, type: 'longtext' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @Column({ nullable: false, name: 'receiver_channel' })
  @IsNotEmpty()
  @IsString()
  receiverChannel: string;

  @Column({ nullable: false, name: 'receiver_id' })
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @Column({ nullable: false, name: 'receiver_type' })
  @IsNotEmpty()
  @IsEnum(UserRole)
  receiverType: UserRole;

  @Column({ nullable: false, name: 'sender_id' })
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @Column({ nullable: false, name: 'sender_type' })
  @IsNotEmpty()
  @IsEnum(UserRole)
  senderType: UserRole;

  @Column({ nullable: false, default: false })
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }
}
