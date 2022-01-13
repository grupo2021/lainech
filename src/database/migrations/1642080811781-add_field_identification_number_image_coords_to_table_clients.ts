import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldIdentificationNumberImageCoordsToTableClients1642080811781 implements MigrationInterface {
    name = 'addFieldIdentificationNumberImageCoordsToTableClients1642080811781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "identification_number" character varying NOT NULL DEFAULT '111AAA'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "image" character varying NOT NULL DEFAULT 'www.noimage.com'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "coords" character varying NOT NULL DEFAULT '-66.15689613829687,-17.393748196299114,'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "coords"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "identification_number"`);
    }

}
