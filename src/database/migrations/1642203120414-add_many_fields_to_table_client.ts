import {MigrationInterface, QueryRunner} from "typeorm";

export class addManyFieldsToTableClient1642203120414 implements MigrationInterface {
    name = 'addManyFieldsToTableClient1642203120414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "trade_name" character varying NOT NULL DEFAULT 'SIN NOMBRE'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "type" character varying NOT NULL DEFAULT 'TIENDA'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "person_charge" character varying NOT NULL DEFAULT 'SIN RESPONSABLE'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "phone_person_charge" character varying NOT NULL DEFAULT '7XXXXXXX'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "phone_person_charge"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "person_charge"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "trade_name"`);
    }

}
