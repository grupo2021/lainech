import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableReturnsAndAddFieldCantReturnedToTablePromotorProducts1642274842060 implements MigrationInterface {
    name = 'createTableReturnsAndAddFieldCantReturnedToTablePromotorProducts1642274842060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "returns" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, "cant" integer NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDIENTE', "cancelled_description" character varying, "promotorProductId" integer, CONSTRAINT "REL_4dbf482d31528cde47fc0ee507" UNIQUE ("promotorProductId"), CONSTRAINT "PK_27a2f1895a71519ebfec7850361" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "promotor_products" ADD "cant_returned" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "returns" ADD CONSTRAINT "FK_4dbf482d31528cde47fc0ee5072" FOREIGN KEY ("promotorProductId") REFERENCES "promotor_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "returns" DROP CONSTRAINT "FK_4dbf482d31528cde47fc0ee5072"`);
        await queryRunner.query(`ALTER TABLE "promotor_products" DROP COLUMN "cant_returned"`);
        await queryRunner.query(`DROP TABLE "returns"`);
    }

}
