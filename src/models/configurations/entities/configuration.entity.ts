import { IsNotEmpty } from 'class-validator';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configurations')
export class Configuration {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @OneToOne(() => Facility, (facility) => facility.configuration)
  facility: Facility;
}
