import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldPrecioUnitarioToTableReloadDetails1641989774385 implements MigrationInterface {
    name = 'addFieldPrecioUnitarioToTableReloadDetails1641989774385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reload_details" ADD "precio_unitario" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reload_details" DROP COLUMN "precio_unitario"`);
    }

}
