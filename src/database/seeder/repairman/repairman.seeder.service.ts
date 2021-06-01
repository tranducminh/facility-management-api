import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as repairman from './repairman.data.json';
import * as bcrypt from 'bcrypt';
import { Repairman } from 'src/models/repairman/entities/repairman.entity';
import { Specialize } from 'src/models/specializes/entities/specialize.entity';
import { FacilityType } from 'src/models/facility-types/entities/facility-type.entity';

@Injectable()
export class RepairmanSeederService {
  constructor(
    @InjectRepository(Repairman)
    private readonly repairmanRepository: Repository<Repairman>,
    @InjectRepository(Specialize)
    private readonly specializeRepository: Repository<Specialize>,
    @InjectRepository(FacilityType)
    private readonly facilityTypeRepository: Repository<FacilityType>,
  ) {}

  async create(): Promise<Promise<Repairman>[]> {
    try {
      return repairman.map(async (item) => {
        const hashPassword = await bcrypt.hash(item.identity, 10);
        const newRepairman = this.repairmanRepository.create({
          identity: item.identity,
          hashPassword,
          name: item.name,
          unit: item.unit,
          email: item.email,
        });
        const saveRepairman = await this.repairmanRepository.save(newRepairman);

        const types = await this.facilityTypeRepository.find();
        const specializes = types.map(async (type) => {
          const typeName = type.name;
          const active = item.specializes.includes(typeName);
          const newSpecialize = this.specializeRepository.create({
            active,
            repairman: saveRepairman,
            facilityType: await this.facilityTypeRepository.findOne({
              name: typeName,
            }),
          });
          return await this.specializeRepository.save(newSpecialize);
        });

        await Promise.all(await specializes)
          .then(() => Promise.resolve(true))
          .catch((error) => Promise.reject(error));

        return saveRepairman;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
