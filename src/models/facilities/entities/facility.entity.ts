import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FacilityStatus } from 'src/common/enums/facility-status.enum';
import { Configuration } from 'src/models/configurations/entities/configuration.entity';
import { Employee } from 'src/models/employees/entities/employee.entity';
import { FacilityType } from 'src/models/facility-types/entities/facility-type.entity';
import { Replacement } from 'src/models/replacements/entities/replacement.entity';
import { Request } from 'src/models/requests/entities/request.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('facilities')
export class Facility {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  @IsString()
  origin?: string;

  @Column({ nullable: true })
  @IsNumber()
  price?: number;

  @Column({ nullable: false, default: FacilityStatus.READY })
  @IsNotEmpty()
  @IsEnum(FacilityStatus)
  status: FacilityStatus;

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

  @ManyToOne(() => Employee, (employee) => employee.facilities)
  employee: Employee;

  @OneToMany(() => Request, (request) => request.facility, { cascade: true })
  requests: Request[];

  @OneToOne(() => Configuration, (configuration) => configuration.facility, {
    cascade: true,
  })
  @JoinColumn()
  configuration: Configuration;

  @OneToMany(() => Replacement, (replacement) => replacement.facility, {
    cascade: true,
  })
  replacements: Replacement[];

  @ManyToOne(() => FacilityType, (facilityType) => facilityType.facilities)
  facilityType: FacilityType;
}
