import {MigrationInterface, QueryRunner} from "typeorm";

export class addRealtionReturnsWithAlmacenero1642861637063 implements MigrationInterface {
    name = 'addRealtionReturnsWithAlmacenero1642861637063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "returns" ADD "almaceneroId" integer`);
        await queryRunner.query(`ALTER TABLE "returns" ADD CONSTRAINT "FK_31599150cb2c4f2dfe0eda6cb92" FOREIGN KEY ("almaceneroId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "returns" DROP CONSTRAINT "FK_31599150cb2c4f2dfe0eda6cb92"`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "almaceneroId"`);
    }

}
