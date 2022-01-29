import {MigrationInterface, QueryRunner} from "typeorm";

export class tablePromotorProductHaveManyReturns1643383460290 implements MigrationInterface {
    name = 'tablePromotorProductHaveManyReturns1643383460290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "returns" ADD "approve_description" character varying`);
        await queryRunner.query(`ALTER TABLE "returns" DROP CONSTRAINT "FK_4dbf482d31528cde47fc0ee5072"`);
        await queryRunner.query(`ALTER TABLE "returns" DROP CONSTRAINT "REL_4dbf482d31528cde47fc0ee507"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD CONSTRAINT "FK_4dbf482d31528cde47fc0ee5072" FOREIGN KEY ("promotorProductId") REFERENCES "promotor_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "returns" DROP CONSTRAINT "FK_4dbf482d31528cde47fc0ee5072"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD CONSTRAINT "REL_4dbf482d31528cde47fc0ee507" UNIQUE ("promotorProductId")`);
        await queryRunner.query(`ALTER TABLE "returns" ADD CONSTRAINT "FK_4dbf482d31528cde47fc0ee5072" FOREIGN KEY ("promotorProductId") REFERENCES "promotor_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "approve_description"`);
    }

}
