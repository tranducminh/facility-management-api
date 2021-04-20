import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDatabase1618801793856 implements MigrationInterface {
  name = 'initDatabase1618801793856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `admins` (`id` int NOT NULL AUTO_INCREMENT, `hashPassword` longtext NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `configurations` (`id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `room_facilities` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NULL, `updated_at` timestamp NULL, `roomId` int NULL, `facilityTypeId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `replacements` (`id` int NOT NULL AUTO_INCREMENT, `component` varchar(255) NOT NULL, `origin` varchar(255) NOT NULL, `target` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `facilityId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `requests` (`id` int NOT NULL AUTO_INCREMENT, `status` varchar(255) NOT NULL, `problem` longtext NOT NULL, `solution` longtext NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `employeeId` int NULL, `facilityId` int NULL, `repairmanId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `request_replacements` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NULL, `updated_at` timestamp NULL, `requestId` int NULL, `replacementId` int NULL, UNIQUE INDEX `REL_9e1e9656993f13f1265cfb8790` (`replacementId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `repairman` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NULL, `updated_at` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `specializes` (`id` int NOT NULL AUTO_INCREMENT, `description` varchar(255) NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `facilityTypeId` int NULL, `repairmanId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `facility_types` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `facilities` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `origin` varchar(255) NULL, `price` int NULL, `status` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `employeeId` int NULL, `configurationId` int NULL, `facilityTypeId` int NULL, UNIQUE INDEX `REL_fac08b6f18998bd0913b6ef62c` (`configurationId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `employees` (`id` int NOT NULL AUTO_INCREMENT, `employee_identity` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `date_of_birth` timestamp NULL, `unit` varchar(255) NOT NULL, `email` varchar(255) NULL, `phone` varchar(255) NULL, `hash_password` longtext NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `roomId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `rooms` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, `buildingId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `buildings` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` timestamp NULL, `updated_at` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
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
      'ALTER TABLE `requests` ADD CONSTRAINT `FK_ae8400293ddacbbf2aa6e5f578f` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `requests` ADD CONSTRAINT `FK_53662ee34844cf4444660e6872f` FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `requests` ADD CONSTRAINT `FK_c5968347dba4c3580e1c699ca76` FOREIGN KEY (`repairmanId`) REFERENCES `repairman`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `request_replacements` ADD CONSTRAINT `FK_e73e8bc6dd94d57b56aeb68af39` FOREIGN KEY (`requestId`) REFERENCES `requests`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `request_replacements` ADD CONSTRAINT `FK_9e1e9656993f13f1265cfb8790c` FOREIGN KEY (`replacementId`) REFERENCES `replacements`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
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
      'ALTER TABLE `rooms` ADD CONSTRAINT `FK_0390a2fda90b13e8f578ff920c1` FOREIGN KEY (`buildingId`) REFERENCES `buildings`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `rooms` DROP FOREIGN KEY `FK_0390a2fda90b13e8f578ff920c1`',
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
      'ALTER TABLE `request_replacements` DROP FOREIGN KEY `FK_9e1e9656993f13f1265cfb8790c`',
    );
    await queryRunner.query(
      'ALTER TABLE `request_replacements` DROP FOREIGN KEY `FK_e73e8bc6dd94d57b56aeb68af39`',
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
      'ALTER TABLE `replacements` DROP FOREIGN KEY `FK_5ad4f23894284355c8ae62907f9`',
    );
    await queryRunner.query(
      'ALTER TABLE `room_facilities` DROP FOREIGN KEY `FK_835afac6ffa590ad8095654223d`',
    );
    await queryRunner.query(
      'ALTER TABLE `room_facilities` DROP FOREIGN KEY `FK_d71e2d179153f54a2b070464eb9`',
    );
    await queryRunner.query('DROP TABLE `buildings`');
    await queryRunner.query('DROP TABLE `rooms`');
    await queryRunner.query('DROP TABLE `employees`');
    await queryRunner.query(
      'DROP INDEX `REL_fac08b6f18998bd0913b6ef62c` ON `facilities`',
    );
    await queryRunner.query('DROP TABLE `facilities`');
    await queryRunner.query('DROP TABLE `facility_types`');
    await queryRunner.query('DROP TABLE `specializes`');
    await queryRunner.query('DROP TABLE `repairman`');
    await queryRunner.query(
      'DROP INDEX `REL_9e1e9656993f13f1265cfb8790` ON `request_replacements`',
    );
    await queryRunner.query('DROP TABLE `request_replacements`');
    await queryRunner.query('DROP TABLE `requests`');
    await queryRunner.query('DROP TABLE `replacements`');
    await queryRunner.query('DROP TABLE `room_facilities`');
    await queryRunner.query('DROP TABLE `configurations`');
    await queryRunner.query('DROP TABLE `admins`');
  }
}
