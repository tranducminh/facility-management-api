import { IsNotEmpty, IsString } from 'class-validator';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { RequestReplacement } from 'src/models/request-replacements/entities/request-replacement.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
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
  origin: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  target: string;

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

  @OneToOne(
    () => RequestReplacement,
    (requestReplacement) => requestReplacement.replacement,
  )
  requestReplacement: RequestReplacement;
}
