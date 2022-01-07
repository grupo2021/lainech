import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableReload1641571022861 implements MigrationInterface {
    name = 'createTableReload1641571022861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reloads" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, "total" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDIENTE', "userId" integer, CONSTRAINT "PK_c1bc890bfba1361510fc2c1c43b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reloads" ADD CONSTRAINT "FK_b2e38f3a4164c65860cadddd1fd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reloads" DROP CONSTRAINT "FK_b2e38f3a4164c65860cadddd1fd"`);
        await queryRunner.query(`DROP TABLE "reloads"`);
    }

}
