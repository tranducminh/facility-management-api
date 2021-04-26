import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';
import { CommonStatus } from 'src/common/enums/common-status.enum';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { Request } from 'src/models/requests/entities/request.entity';
import { Room } from 'src/models/rooms/entities/room.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  identity: string;

  @Column({ nullable: false })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  name: string;

  @Column({ nullable: true, type: 'timestamp', name: 'date_of_birth' })
  dateOfBirth?: Date;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @Column({ nullable: true })
  @IsEmail()
  @IsString()
  email?: string;

  @Column({ nullable: true })
  @IsString()
  avatar?: string;

  @Column({ nullable: true })
  @IsString()
  @Matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)
  phone?: string;

  @Column({
    nullable: false,
    type: 'longtext',
    name: 'hash_password',
  })
  @IsNotEmpty()
  @IsString()
  hashPassword: string;

  @Column({ default: BooleanStatus.FALSE })
  @IsNotEmpty()
  @IsEnum(BooleanStatus)
  hasRoom: BooleanStatus;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    if (this.room) {
      this.hasRoom = BooleanStatus.TRUE;
    }
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => Room, (room) => room.employees)
  room: Room;

  @OneToMany(() => Request, (request) => request.employee, { cascade: true })
  requests: Request[];

  @OneToMany(() => Facility, (facility) => facility.employee, { cascade: true })
  facilities: Facility[];
}
