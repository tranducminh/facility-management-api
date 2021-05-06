import { IsNotEmpty, IsString } from 'class-validator';
import { Admin } from 'src/models/admins/entities/admin.entity';
import { Employee } from 'src/models/employees/entities/employee.entity';
import { Repairman } from 'src/models/repairman/entities/repairman.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
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

  // @ManyToOne(
  //   () => Repairman || Employee || Admin,
  //   (receiver) => receiver.sentNotifications,
  // )
  // receiver: Repairman | Employee | Admin;

  // @ManyToOne(
  //   () => Repairman || Employee || Admin,
  //   (sender) => sender.notifications,
  // )
  // sender: Repairman | Employee | Admin;
}
