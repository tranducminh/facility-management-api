import { IsNotEmpty } from 'class-validator';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { RequestReplacement } from 'src/models/request-replacements/entities/request-replacement.entity';
import { Request } from 'src/models/requests/entities/request.entity';
import { Specialize } from 'src/models/specializes/entities/specialize.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('repairman')
export class Repairman {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

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

  @OneToMany(() => Request, (request) => request.repairman, {
    cascade: true,
  })
  requests: Request[];

  @OneToMany(() => Specialize, (specialize) => specialize.repairman, {
    cascade: true,
  })
  specializes: Specialize[];
}
