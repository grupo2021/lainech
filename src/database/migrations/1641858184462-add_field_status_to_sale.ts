import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldStatusToSale1641858184462 implements MigrationInterface {
    name = 'addFieldStatusToSale1641858184462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" ADD "status" character varying NOT NULL DEFAULT 'PENDIENTE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "status"`);
    }

}
