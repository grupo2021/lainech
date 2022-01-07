import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableReloadDetailsWithRelationsToReloasAndProducts1641571907715 implements MigrationInterface {
    name = 'createTableReloadDetailsWithRelationsToReloasAndProducts1641571907715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reload_details" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "subtotal" integer NOT NULL, "cant" integer NOT NULL, "cant_sold" integer NOT NULL DEFAULT '0', "reloadId" integer, "productId" integer, CONSTRAINT "PK_2685f7893bf9dc68d4be9778979" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reload_details" ADD CONSTRAINT "FK_ca73bb5465a65a71a4e6e84f201" FOREIGN KEY ("reloadId") REFERENCES "reloads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reload_details" ADD CONSTRAINT "FK_5c47fe8345287224204726bacd1" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reload_details" DROP CONSTRAINT "FK_5c47fe8345287224204726bacd1"`);
        await queryRunner.query(`ALTER TABLE "reload_details" DROP CONSTRAINT "FK_ca73bb5465a65a71a4e6e84f201"`);
        await queryRunner.query(`DROP TABLE "reload_details"`);
    }

}
