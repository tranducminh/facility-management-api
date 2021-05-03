import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDatabase1620054939111 implements MigrationInterface {
  name = 'initDatabase1620054939111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `configurations` (`id` int NOT NULL AUTO_INCREMENT, `cpu` varchar(255) NULL, `mainboard` varchar(255) NULL, `psu` varchar(255) NULL, `ram` varchar(255) NULL, `vga` varchar(255) NULL, `hard_drive` varchar(255) NULL, `optical_drive` varchar(255) NULL, `monitor` varchar(255) NULL, `mouse` varchar(255) NULL, `keyboard` varchar(255) NULL, `head-phone` varchar(255) NULL, `webcam` varchar(255) NULL, `card_reader` varchar(255) NULL, `fan_case` varchar(255) NULL, `resolution` varchar(255) NULL, `printer_speed` varchar(255) NULL, `paper_size` varchar(255) NULL, `model` varchar(255) NULL, `duplex_print` varchar(255) NULL, `communication` varchar(255) NULL, `print_ink` varchar(255) NULL, `fax_speed` varchar(255) NULL, `node_name` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `floors` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `buildingId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `buildings` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `rooms` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `floorId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `room_facilities` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NULL, `updated_at` timestamp NULL, `roomId` int NULL, `facilityTypeId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `replacements` (`id` int NOT NULL AUTO_INCREMENT, `component` varchar(255) NOT NULL, `source` varchar(255) NOT NULL, `target` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `facilityId` int NULL, `requestId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `requests` (`id` int NOT NULL AUTO_INCREMENT, `status` varchar(255) NOT NULL DEFAULT 'pending', `problem` longtext NOT NULL, `solution` longtext NULL, `rejected_reason` longtext NULL, `uncompleted_reason` longtext NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `employeeId` int NULL, `facilityId` int NULL, `repairmanId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `histories` (`id` int NOT NULL AUTO_INCREMENT, `status` varchar(255) NOT NULL DEFAULT 'uncompleted', `uncompleted_reason` longtext NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `repairmanId` int NULL, `requestId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `repairman` (`id` int NOT NULL AUTO_INCREMENT, `identity` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `unit` varchar(255) NOT NULL, `phone` varchar(255) NULL, `hash_password` longtext NOT NULL, `channel` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, INDEX `IDX_1a186824d0c9350af0a57c1e03` (`identity`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `specializes` (`id` int NOT NULL AUTO_INCREMENT, `description` varchar(255) NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `facilityTypeId` int NULL, `repairmanId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `facility_types` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, UNIQUE INDEX `IDX_4cdf7a0eccd7ec4b71e25d42d5` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `facilities` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `origin` varchar(255) NULL, `price` int NULL, `status` varchar(255) NOT NULL DEFAULT 'ready', `created_at` timestamp NULL, `updated_at` timestamp NULL, `employeeId` int NULL, `configurationId` int NULL, `facilityTypeId` int NULL, UNIQUE INDEX `REL_fac08b6f18998bd0913b6ef62c` (`configurationId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `employees` (`id` int NOT NULL AUTO_INCREMENT, `identity` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `date_of_birth` timestamp NULL, `unit` varchar(255) NOT NULL, `email` varchar(255) NULL, `avatar` varchar(255) NULL, `phone` varchar(255) NULL, `hash_password` longtext NOT NULL, `has_room` varchar(255) NOT NULL DEFAULT 'false', `channel` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `roomId` int NULL, UNIQUE INDEX `IDX_ccf34273946f730daffa3a2d8d` (`identity`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `notifications` (`id` int NOT NULL AUTO_INCREMENT, `content` longtext NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `receiverId` int NULL, `senderId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `admins` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `hash_password` longtext NOT NULL, `channel` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, UNIQUE INDEX `IDX_051db7d37d478a69a7432df147` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `floors` ADD CONSTRAINT `FK_58ed6d6bd6268cdf83b7c72d1b5` FOREIGN KEY (`buildingId`) REFERENCES `buildings`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `rooms` ADD CONSTRAINT `FK_4d1c2078e85df4b86a6e80348e5` FOREIGN KEY (`floorId`) REFERENCES `floors`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `room_facilities` ADD CONSTRAINT `FK_d71e2d179153f54a2b070464eb9` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `room_facilities` ADD CONSTRAINT `FK_835afac6ffa590ad8095654223d` FOREIGN KEY (`facilityTypeId`) REFERENCES `facility_types`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `replacements` ADD CONSTRAINT `FK_5ad4f23894284355c8ae62907f9` FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `replacements` ADD CONSTRAINT `FK_68ae5c9e5a0217c0f46db5b495d` FOREIGN KEY (`requestId`) REFERENCES `requests`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `requests` ADD CONSTRAINT `FK_ae8400293ddacbbf2aa6e5f578f` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `requests` ADD CONSTRAINT `FK_53662ee34844cf4444660e6872f` FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `requests` ADD CONSTRAINT `FK_c5968347dba4c3580e1c699ca76` FOREIGN KEY (`repairmanId`) REFERENCES `repairman`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `histories` ADD CONSTRAINT `FK_15037aa7ba657df5f34eae14c78` FOREIGN KEY (`repairmanId`) REFERENCES `repairman`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `histories` ADD CONSTRAINT `FK_accaec34a33138051cfd3f00ee3` FOREIGN KEY (`requestId`) REFERENCES `requests`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `specializes` ADD CONSTRAINT `FK_39296d240885441b1bf0a202132` FOREIGN KEY (`facilityTypeId`) REFERENCES `facility_types`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `specializes` ADD CONSTRAINT `FK_c8dac3909e1b5ed665117cdc473` FOREIGN KEY (`repairmanId`) REFERENCES `repairman`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `facilities` ADD CONSTRAINT `FK_db6de9da0428222ba03b44cd51e` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `facilities` ADD CONSTRAINT `FK_fac08b6f18998bd0913b6ef62cc` FOREIGN KEY (`configurationId`) REFERENCES `configurations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `facilities` ADD CONSTRAINT `FK_20a54b1f404f9a4478499ceaaad` FOREIGN KEY (`facilityTypeId`) REFERENCES `facility_types`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `employees` ADD CONSTRAINT `FK_e8e5049cbbbd9c929c37ab0e190` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `notifications` ADD CONSTRAINT `FK_d1e9b2452666de3b9b4d271cca0` FOREIGN KEY (`receiverId`) REFERENCES `repairman`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `notifications` ADD CONSTRAINT `FK_ddb7981cf939fe620179bfea33a` FOREIGN KEY (`senderId`) REFERENCES `repairman`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `notifications` DROP FOREIGN KEY `FK_ddb7981cf939fe620179bfea33a`',
    );
    await queryRunner.query(
      'ALTER TABLE `notifications` DROP FOREIGN KEY `FK_d1e9b2452666de3b9b4d271cca0`',
    );
    await queryRunner.query(
      'ALTER TABLE `employees` DROP FOREIGN KEY `FK_e8e5049cbbbd9c929c37ab0e190`',
    );
    await queryRunner.query(
      'ALTER TABLE `facilities` DROP FOREIGN KEY `FK_20a54b1f404f9a4478499ceaaad`',
    );
    await queryRunner.query(
      'ALTER TABLE `facilities` DROP FOREIGN KEY `FK_fac08b6f18998bd0913b6ef62cc`',
    );
    await queryRunner.query(
      'ALTER TABLE `facilities` DROP FOREIGN KEY `FK_db6de9da0428222ba03b44cd51e`',
    );
    await queryRunner.query(
      'ALTER TABLE `specializes` DROP FOREIGN KEY `FK_c8dac3909e1b5ed665117cdc473`',
    );
    await queryRunner.query(
      'ALTER TABLE `specializes` DROP FOREIGN KEY `FK_39296d240885441b1bf0a202132`',
    );
    await queryRunner.query(
      'ALTER TABLE `histories` DROP FOREIGN KEY `FK_accaec34a33138051cfd3f00ee3`',
    );
    await queryRunner.query(
      'ALTER TABLE `histories` DROP FOREIGN KEY `FK_15037aa7ba657df5f34eae14c78`',
    );
    await queryRunner.query(
      'ALTER TABLE `requests` DROP FOREIGN KEY `FK_c5968347dba4c3580e1c699ca76`',
    );
    await queryRunner.query(
      'ALTER TABLE `requests` DROP FOREIGN KEY `FK_53662ee34844cf4444660e6872f`',
    );
    await queryRunner.query(
      'ALTER TABLE `requests` DROP FOREIGN KEY `FK_ae8400293ddacbbf2aa6e5f578f`',
    );
    await queryRunner.query(
      'ALTER TABLE `replacements` DROP FOREIGN KEY `FK_68ae5c9e5a0217c0f46db5b495d`',
    );
    await queryRunner.query(
      'ALTER TABLE `replacements` DROP FOREIGN KEY `FK_5ad4f23894284355c8ae62907f9`',
    );
    await queryRunner.query(
      'ALTER TABLE `room_facilities` DROP FOREIGN KEY `FK_835afac6ffa590ad8095654223d`',
    );
    await queryRunner.query(
      'ALTER TABLE `room_facilities` DROP FOREIGN KEY `FK_d71e2d179153f54a2b070464eb9`',
    );
    await queryRunner.query(
      'ALTER TABLE `rooms` DROP FOREIGN KEY `FK_4d1c2078e85df4b86a6e80348e5`',
    );
    await queryRunner.query(
      'ALTER TABLE `floors` DROP FOREIGN KEY `FK_58ed6d6bd6268cdf83b7c72d1b5`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_051db7d37d478a69a7432df147` ON `admins`',
    );
    await queryRunner.query('DROP TABLE `admins`');
    await queryRunner.query('DROP TABLE `notifications`');
    await queryRunner.query(
      'DROP INDEX `IDX_ccf34273946f730daffa3a2d8d` ON `employees`',
    );
    await queryRunner.query('DROP TABLE `employees`');
    await queryRunner.query(
      'DROP INDEX `REL_fac08b6f18998bd0913b6ef62c` ON `facilities`',
    );
    await queryRunner.query('DROP TABLE `facilities`');
    await queryRunner.query(
      'DROP INDEX `IDX_4cdf7a0eccd7ec4b71e25d42d5` ON `facility_types`',
    );
    await queryRunner.query('DROP TABLE `facility_types`');
    await queryRunner.query('DROP TABLE `specializes`');
    await queryRunner.query(
      'DROP INDEX `IDX_1a186824d0c9350af0a57c1e03` ON `repairman`',
    );
    await queryRunner.query('DROP TABLE `repairman`');
    await queryRunner.query('DROP TABLE `histories`');
    await queryRunner.query('DROP TABLE `requests`');
    await queryRunner.query('DROP TABLE `replacements`');
    await queryRunner.query('DROP TABLE `room_facilities`');
    await queryRunner.query('DROP TABLE `rooms`');
    await queryRunner.query('DROP TABLE `buildings`');
    await queryRunner.query('DROP TABLE `floors`');
    await queryRunner.query('DROP TABLE `configurations`');
  }
}
