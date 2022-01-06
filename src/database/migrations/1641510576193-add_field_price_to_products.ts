import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldPriceToProducts1641510576193 implements MigrationInterface {
    name = 'addFieldPriceToProducts1641510576193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "price" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
    }

}
