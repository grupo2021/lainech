import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableLoteWithRelationToProduct1640316676275 implements MigrationInterface {
    name = 'createTableLoteWithRelationToProduct1640316676275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lotes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "cant" integer NOT NULL, "price" integer NOT NULL, "register" TIMESTAMP NOT NULL, "expiry" TIMESTAMP NOT NULL, "productId" integer, CONSTRAINT "PK_6eda564423c09706b95cbf8ae1c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lotes" ADD CONSTRAINT "FK_ddfdc6cfdc7d179eb5eeec22707" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lotes" DROP CONSTRAINT "FK_ddfdc6cfdc7d179eb5eeec22707"`);
        await queryRunner.query(`DROP TABLE "lotes"`);
    }

}
