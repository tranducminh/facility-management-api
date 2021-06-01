import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialize } from './entities/specialize.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialize]),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
})
export class SpecializesModule {}
