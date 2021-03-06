import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Floor } from 'src/models/floors/entities/floor.entity';
import { Room } from 'src/models/rooms/entities/room.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('buildings')
export class Building {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: false, name: 'is_active', default: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsNumber()
  index: number;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.index = parseInt(this.name.substring(1));
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => Floor, (floor) => floor.building, { cascade: true })
  floors: Floor[];
}
