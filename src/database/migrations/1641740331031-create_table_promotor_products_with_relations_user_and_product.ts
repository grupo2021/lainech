import {MigrationInterface, QueryRunner} from "typeorm";

export class createTablePromotorProductsWithRelationsUserAndProduct1641740331031 implements MigrationInterface {
    name = 'createTablePromotorProductsWithRelationsUserAndProduct1641740331031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promotor_products" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cant" integer NOT NULL, "cant_out" integer NOT NULL DEFAULT '0', "productId" integer, "userId" integer, CONSTRAINT "PK_ebd260ecb6c10d2fcc52d682b18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "promotor_products" ADD CONSTRAINT "FK_e84bae33365bb47966e2d17d62f" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotor_products" ADD CONSTRAINT "FK_dd828606bd30254caf219297a9f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promotor_products" DROP CONSTRAINT "FK_dd828606bd30254caf219297a9f"`);
        await queryRunner.query(`ALTER TABLE "promotor_products" DROP CONSTRAINT "FK_e84bae33365bb47966e2d17d62f"`);
        await queryRunner.query(`DROP TABLE "promotor_products"`);
    }

}
