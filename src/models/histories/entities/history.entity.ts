import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { HistoryStatus } from 'src/common/enums/history-status.enum';
import { Repairman } from 'src/models/repairman/entities/repairman.entity';
import { Request } from 'src/models/requests/entities/request.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('histories')
export class History {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ nullable: false, default: HistoryStatus.UNCOMPLETED })
  @IsEnum(HistoryStatus)
  status: HistoryStatus;

  @Column({ nullable: true, type: 'longtext', name: 'uncompleted_reason' })
  @IsOptional()
  @IsString()
  uncompletedReason?: string;

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

  @ManyToOne(() => Repairman, (repairman) => repairman.histories)
  repairman: Repairman;

  @ManyToOne(() => Request, (request) => request.histories)
  request: Request;
}
