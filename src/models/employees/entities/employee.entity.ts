import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { BooleanStatus } from 'src/common/enums/boolean-status.enum';
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
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  @IsString()
  email?: string;

  @Column({ nullable: true })
  @IsString()
  avatar?: string;

  @Column({ nullable: true })
  @ValidateIf((o) => o.phone !== '')
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

  @Column({ default: BooleanStatus.FALSE, name: 'has_room' })
  @IsNotEmpty()
  @IsEnum(BooleanStatus)
  hasRoom: BooleanStatus;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  channel: string;

  @Column({ nullable: false, name: 'first_name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column({ nullable: false, name: 'is_active', default: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.channel = new Date().getTime().toString();
    this.firstName = this.name.split(' ').pop();
    if (this.room) {
      this.hasRoom = BooleanStatus.TRUE;
    }
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
    this.firstName = this.name.split(' ').pop();
    if (this.room) {
      this.hasRoom = BooleanStatus.TRUE;
    } else {
      this.hasRoom = BooleanStatus.FALSE;
    }
  }

  @ManyToOne(() => Room, (room) => room.employees)
  room: Room;

  @OneToMany(() => Request, (request) => request.employee, { cascade: true })
  requests: Request[];

  @OneToMany(() => Facility, (facility) => facility.employee, { cascade: true })
  facilities: Facility[];
}
