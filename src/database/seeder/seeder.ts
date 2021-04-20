import { Injectable, Logger } from '@nestjs/common';
import { BuildingSeederService } from './building/building.seeder.service';
import { FloorSeederService } from './floor/floor.seeder.service';
import { RoomSeederService } from './room/room.seeder.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly roomSeederService: RoomSeederService,
    private readonly buildingSeederService: BuildingSeederService,
    private readonly floorSeederService: FloorSeederService,
  ) {}
  async seed() {
    await this.buildings()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding buildings...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding buildings...');
        Promise.reject(error);
      });

    await this.floors()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding buildings...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding buildings...');
        Promise.reject(error);
      });

    await this.rooms()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding rooms...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding rooms...');
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
}