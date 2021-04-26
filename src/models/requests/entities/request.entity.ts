import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { Employee } from 'src/models/employees/entities/employee.entity';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { History } from 'src/models/histories/entities/history.entity';
import { Repairman } from 'src/models/repairman/entities/repairman.entity';
import { Replacement } from 'src/models/replacements/entities/replacement.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false, default: RequestStatus.PENDING })
  @IsNotEmpty()
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @Column({ nullable: false, type: 'longtext' })
  @IsNotEmpty()
  @IsString()
  problem: string;

  @Column({ nullable: true, type: 'longtext' })
  @IsOptional()
  @IsString()
  solution?: string;

  @Column({ nullable: true, type: 'longtext', name: 'rejected_reason' })
  @IsOptional()
  @IsString()
  rejectedReason?: string;

  @Column({ nullable: true, type: 'longtext', name: 'uncompleted_reason' })
  @IsOptional()
  @IsString()
  uncompletedReason?: string;

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

  @ManyToOne(() => Employee, (employee) => employee.requests)
  employee: Employee;

  @ManyToOne(() => Facility, (facility) => facility.requests)
  facility: Facility;

  @OneToMany(() => Replacement, (replacement) => replacement.request, {
    cascade: true,
  })
  replacements: Replacement[];

  @ManyToOne(() => Repairman, (repairman) => repairman.requests)
  repairman: Repairman;

  @OneToMany(() => History, (history) => history.request, {
    cascade: true,
  })
  histories: History[];
}
