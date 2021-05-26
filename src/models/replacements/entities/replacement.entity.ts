import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { Request } from 'src/models/requests/entities/request.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('replacements')
export class Replacement {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  component: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  source: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  target: string;

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
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => Facility, (facility) => facility.replacements)
  facility: Facility;

  @ManyToOne(() => Request, (request) => request.replacements)
  request: Request;
}
