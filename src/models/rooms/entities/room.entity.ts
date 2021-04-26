import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Building } from 'src/models/buildings/entities/building.entity';
import { Employee } from 'src/models/employees/entities/employee.entity';
import { Floor } from 'src/models/floors/entities/floor.entity';
import { RoomFacility } from 'src/models/room-facilities/entities/room-facility.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
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

  @OneToMany(() => Employee, (employee) => employee.room, { cascade: true })
  employees: Employee[];

  @OneToMany(() => RoomFacility, (roomFacility) => roomFacility.room, {
    cascade: true,
  })
  roomFacilities: RoomFacility[];

  @ManyToOne(() => Floor, (floor) => floor.rooms)
  floor: Floor;
}
