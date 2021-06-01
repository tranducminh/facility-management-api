import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/models/admins/entities/admin.entity';
import { Repository } from 'typeorm';
import * as admins from './admin.data.json';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeederService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(): Promise<Promise<Admin>[]> {
    try {
      return admins.map(async (admin) => {
        const hashPassword = await bcrypt.hash(admin.password, 10);
        const newAdmin = this.adminRepository.create({
          email: admin.email,
          name: admin.name,
          hashPassword,
        });
        return await this.adminRepository.save(newAdmin);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
