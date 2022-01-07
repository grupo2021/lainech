import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldCantOutOnTableLotes1641569941582 implements MigrationInterface {
    name = 'addFieldCantOutOnTableLotes1641569941582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lotes" ADD "cant_out" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lotes" DROP COLUMN "cant_out"`);
    }

}
