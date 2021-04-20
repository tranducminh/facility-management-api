import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { Employee } from 'src/models/employees/entities/employee.entity';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { Repairman } from 'src/models/repairman/entities/repairman.entity';
import { RequestReplacement } from 'src/models/request-replacements/entities/request-replacement.entity';
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

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @Column({ nullable: false, type: 'longtext' })
  @IsNotEmpty()
  @IsString()
  problem: string;

  @Column({ nullable: false, type: 'longtext' })
  @IsNotEmpty()
  @IsString()
  solution: string;

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

  @OneToMany(
    () => RequestReplacement,
    (requestReplacement) => requestReplacement.request,
    { cascade: true },
  )
  requestReplacements: RequestReplacement[];

  @ManyToOne(() => Repairman, (repairman) => repairman.requests)
  repairman: Repairman;
}
