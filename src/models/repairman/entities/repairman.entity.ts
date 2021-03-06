import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { History } from 'src/models/histories/entities/history.entity';
import { Request } from 'src/models/requests/entities/request.entity';
import { Specialize } from 'src/models/specializes/entities/specialize.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('repairman')
export class Repairman {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Index()
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  identity: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @Column({ nullable: true })
  @ValidateIf((o) => o.email !== '')
  @IsOptional()
  @Matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)
  @IsString()
  phone?: string;

  @Column({ nullable: true, type: 'timestamp', name: 'date_of_birth' })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  @IsString()
  email?: string;

  @Column({ nullable: true })
  @IsString()
  avatar?: string;

  @Column({
    nullable: false,
    type: 'longtext',
    name: 'hash_password',
  })
  @IsNotEmpty()
  @IsString()
  hashPassword: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  channel: string;

  @Column({ nullable: false, name: 'is_active', default: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @Column({ nullable: false, name: 'first_name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.firstName = this.name.split(' ').pop();
    this.channel = new Date().getTime().toString();
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
    this.firstName = this.name.split(' ').pop();
  }

  @OneToMany(() => Request, (request) => request.repairman, {
    cascade: true,
  })
  requests: Request[];

  @OneToMany(() => Specialize, (specialize) => specialize.repairman, {
    cascade: true,
  })
  specializes: Specialize[];

  @OneToMany(() => History, (history) => history.repairman, {
    cascade: true,
  })
  histories: History[];
}
