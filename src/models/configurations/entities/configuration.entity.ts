import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Facility } from 'src/models/facilities/entities/facility.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configurations')
export class Configuration {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  //computer
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  cpu?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  mainboard?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  psu?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  ram?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  vga?: string;

  @Column({ nullable: true, name: 'hard_drive' })
  @IsOptional()
  @IsString()
  hardDrive?: string;

  @Column({ nullable: true, name: 'optical_drive' })
  @IsOptional()
  @IsString()
  opticalDrive?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  monitor?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  mouse?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  keyboard?: string;

  @Column({ nullable: true, name: 'head-phone' })
  @IsOptional()
  @IsString()
  headPhone?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  webcam?: string;

  @Column({ nullable: true, name: 'card_reader' })
  @IsOptional()
  @IsString()
  cardReader?: string;

  @Column({ nullable: true, name: 'fan_case' })
  @IsOptional()
  @IsString()
  fanCase?: string;

  // printers
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  resolution?: string;

  @Column({ nullable: true, name: 'printer_speed' })
  @IsOptional()
  @IsString()
  printSpeed?: string;

  @Column({ nullable: true, name: 'paper_size' })
  @IsOptional()
  @IsString()
  paperSize?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  model?: string;

  @Column({ nullable: true, name: 'duplex_print' })
  @IsOptional()
  @IsString()
  duplexPrint?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  communication?: string;

  @Column({ nullable: true, name: 'print_ink' })
  @IsOptional()
  @IsString()
  printInk?: string;

  //fax
  @Column({ nullable: true, name: 'fax_speed' })
  @IsOptional()
  @IsString()
  faxSpeed?: string;

  //node
  @Column({ nullable: true, name: 'node_name' })
  @IsOptional()
  @IsString()
  nodeName?: string;

  @OneToOne(() => Facility, (facility) => facility.configuration)
  facility: Facility;
}
