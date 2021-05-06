import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from 'src/models/notifications/entities/notification.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: false, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ nullable: false, type: 'longtext', name: 'hash_password' })
  @IsNotEmpty()
  @IsString()
  hashPassword: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  channel: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.channel = new Date().getTime().toString();
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }

  // @OneToMany(() => Notification, (notification) => notification.receiver, {
  //   cascade: true,
  // })
  // sentNotifications: Notification[];

  // @OneToMany(() => Notification, (notification) => notification.sender, {
  //   cascade: true,
  // })
  // notifications: Notification[];
}
