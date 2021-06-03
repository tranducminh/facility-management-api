import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialize } from './entities/specialize.entity';
import { JwtModule } from '@nestjs/jwt';
import { SpecializesController } from './specializes.controller';
import { SpecializesService } from './specializes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialize]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  controllers: [SpecializesController],
  providers: [SpecializesService],
})
export class SpecializesModule {}
