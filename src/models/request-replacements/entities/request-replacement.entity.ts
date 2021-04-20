import { IsNotEmpty } from 'class-validator';
import { Replacement } from 'src/models/replacements/entities/replacement.entity';
import { Request } from 'src/models/requests/entities/request.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('request_replacements')
export class RequestReplacement {
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

  @ManyToOne(() => Request, (request) => request.requestReplacements)
  request: Request;

  @OneToOne(
    () => Replacement,
    (replacement) => replacement.requestReplacement,
    {
      cascade: true,
    },
  )
  @JoinColumn()
  replacement: Replacement;
}
