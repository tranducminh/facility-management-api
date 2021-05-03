import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { History } from 'src/models/histories/entities/history.entity';
import { Request } from 'src/models/requests/entities/request.entity';
import { Specialize } from 'src/models/specializes/entities/specialize.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from 'src/models/notifications/entities/notification.entity';

@Entity('repairman')
export class Repairman {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Index()
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  identity: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Column({
    nullable: false,
    type: 'longtext',
    name: 'hash_password',
  })
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

  @OneToMany(() => Request, (request) => request.repairman, {
    cascade: true,
  })
  requests: Request[];

  @OneToMany(() => Specialize, (specialize) => specialize.repairman, {
    cascade: true,
  })
  specializes: Specialize[];

  @OneToMany(() => History, (history) => history.repairman, {
    cascade: true,
  })
  histories: History[];

  @OneToMany(() => Notification, (notification) => notification.receiver, {
    cascade: true,
  })
  sentNotifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.sender, {
    cascade: true,
  })
  notifications: Notification[];
}
