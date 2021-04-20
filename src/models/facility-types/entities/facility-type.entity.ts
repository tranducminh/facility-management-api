import { IsNotEmpty, IsString } from 'class-validator';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { RoomFacility } from 'src/models/room-facilities/entities/room-facility.entity';
import { Specialize } from 'src/models/specializes/entities/specialize.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('facility_types')
export class FacilityType {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @OneToMany(() => RoomFacility, (roomFacility) => roomFacility.facilityType, {
    cascade: true,
  })
  roomFacilities: RoomFacility[];

  @OneToMany(() => Facility, (roomFacility) => roomFacility.facilityType, {
    cascade: true,
  })
  facilities: Facility[];

  @OneToMany(() => Specialize, (specialize) => specialize.facilityType, {
    cascade: true,
  })
  specializes: Specialize[];
}
