import {MigrationInterface, QueryRunner} from "typeorm";

export class removeColumnsStockPriceAddColumnProfit1640319811432 implements MigrationInterface {
    name = 'removeColumnsStockPriceAddColumnProfit1640319811432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "basePrice"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "salePrice"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "stock"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "profit" integer NOT NULL DEFAULT '50'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "profit"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "stock" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "salePrice" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "basePrice" integer NOT NULL`);
    }

}
