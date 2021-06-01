import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/models/admins/entities/admin.entity';
import { AdminSeederService } from './admin.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminSeederService],
  exports: [AdminSeederService],
})
export class AdminSeederModule {}
