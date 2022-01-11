import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableSaleDetailsWithRelationsToSalesAndPromotorProduct1641857900494 implements MigrationInterface {
    name = 'createTableSaleDetailsWithRelationsToSalesAndPromotorProduct1641857900494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sale_details" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "subtotal" integer NOT NULL, "cant" integer NOT NULL, "precio_unitario" integer NOT NULL, "promotorProductId" integer, "saleId" integer, CONSTRAINT "PK_a8e8b6d243f38e3587378d401f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sale_details" ADD CONSTRAINT "FK_e1b93204420a3ab43a6847336fd" FOREIGN KEY ("promotorProductId") REFERENCES "promotor_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_details" ADD CONSTRAINT "FK_d7fef51a6c57924613bdb3980cd" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_details" DROP CONSTRAINT "FK_d7fef51a6c57924613bdb3980cd"`);
        await queryRunner.query(`ALTER TABLE "sale_details" DROP CONSTRAINT "FK_e1b93204420a3ab43a6847336fd"`);
        await queryRunner.query(`DROP TABLE "sale_details"`);
    }

}
