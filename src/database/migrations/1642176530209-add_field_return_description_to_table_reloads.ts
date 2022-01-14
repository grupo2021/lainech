import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldReturnDescriptionToTableReloads1642176530209 implements MigrationInterface {
    name = 'addFieldReturnDescriptionToTableReloads1642176530209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reloads" ADD "return_description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reloads" DROP COLUMN "return_description"`);
    }

}
