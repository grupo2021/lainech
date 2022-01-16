import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldSalePointToTableClients1642297222070 implements MigrationInterface {
    name = 'addFieldSalePointToTableClients1642297222070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "sale_point" character varying NOT NULL DEFAULT 'CASA MATRIZ'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "sale_point"`);
    }

}
