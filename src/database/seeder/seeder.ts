import { Injectable, Logger } from '@nestjs/common';
import { BuildingSeederService } from './building/building.seeder.service';
import { FacilityTypeSeederService } from './facility-type/facility-type.seeder.service';
import { FacilitySeederService } from './facility/facility.seeder.service';
import { FloorSeederService } from './floor/floor.seeder.service';
import { RoomSeederService } from './room/room.seeder.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly roomSeederService: RoomSeederService,
    private readonly buildingSeederService: BuildingSeederService,
    private readonly floorSeederService: FloorSeederService,
    private readonly facilityTypeSeederService: FacilityTypeSeederService,
    private readonly facilitySeederService: FacilitySeederService,
  ) {}
  async seed() {
    // await this.buildings()
    //   .then((completed) => {
    //     this.logger.debug('Successfuly completed seeding buildings...');
    //     Promise.resolve(completed);
    //   })
    //   .catch((error) => {
    //     this.logger.error('Failed seeding buildings...');
    //     Promise.reject(error);
    //   });
    // await this.floors()
    //   .then((completed) => {
    //     this.logger.debug('Successfuly completed seeding buildings...');
    //     Promise.resolve(completed);
    //   })
    //   .catch((error) => {
    //     this.logger.error('Failed seeding buildings...');
    //     Promise.reject(error);
    //   });
    // await this.rooms()
    //   .then((completed) => {
    //     this.logger.debug('Successfuly completed seeding rooms...');
    //     Promise.resolve(completed);
    //   })
    //   .catch((error) => {
    //     this.logger.error('Failed seeding rooms...');
    //     Promise.reject(error);
    //   });
    // await this.facilityTypes()
    //   .then((completed) => {
    //     this.logger.debug('Successfuly completed seeding facility types...');
    //     Promise.resolve(completed);
    //   })
    //   .catch((error) => {
    //     this.logger.error('Failed seeding facility types...');
    //     Promise.reject(error);
    //   });
    await this.facilities()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding facilities...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding facilities...');
        Promise.reject(error);
      });
  }
  async rooms() {
    return await Promise.all(await this.roomSeederService.create())
      .then((createdRooms) => {
        this.logger.debug(
          'No. of rooms created : ' +
            createdRooms.filter(
              (nullValueOrCreatedRoom) => nullValueOrCreatedRoom,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
  async buildings() {
    return await Promise.all(await this.buildingSeederService.create())
      .then((createdBuildings) => {
        this.logger.debug(
          'No. of rooms created : ' +
            createdBuildings.filter(
              (nullValueOrCreatedBuilding) => nullValueOrCreatedBuilding,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
  async floors() {
    return await Promise.all(await this.floorSeederService.create())
      .then((createdFloors) => {
        this.logger.debug(
          'No. of rooms created : ' +
            createdFloors.filter(
              (nullValueOrCreatedFloor) => nullValueOrCreatedFloor,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
  async facilityTypes() {
    return await Promise.all(await this.facilityTypeSeederService.create())
      .then((createdFacilityTypes) => {
        this.logger.debug(
          'No. of rooms created : ' +
            createdFacilityTypes.filter(
              (nullValueOrCreatedFacilityType) =>
                nullValueOrCreatedFacilityType,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
  async facilities() {
    return await Promise.all(await this.facilitySeederService.create())
      .then((createdFacilities) => {
        this.logger.debug(
          'No. of facility created : ' +
            createdFacilities.filter(
              (nullValueOrCreatedFacility) => nullValueOrCreatedFacility,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
}
