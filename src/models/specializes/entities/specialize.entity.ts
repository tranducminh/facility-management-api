import { IsNotEmpty, IsOptional } from 'class-validator';
import { FacilityType } from 'src/models/facility-types/entities/facility-type.entity';
import { Repairman } from 'src/models/repairman/entities/repairman.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('specializes')
export class Specialize {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: true })
  @IsOptional()
  description?: string;

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

  @ManyToOne(() => FacilityType, (facilityType) => facilityType.specializes)
  facilityType: FacilityType;

  @ManyToOne(() => Repairman, (repairman) => repairman.specializes)
  repairman: Repairman;
}
