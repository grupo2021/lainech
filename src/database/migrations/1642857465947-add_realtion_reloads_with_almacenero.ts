import {MigrationInterface, QueryRunner} from "typeorm";

export class addRealtionReloadsWithAlmacenero1642857465947 implements MigrationInterface {
    name = 'addRealtionReloadsWithAlmacenero1642857465947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reloads" ADD "almaceneroId" integer`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "sale_point" SET DEFAULT 'MATRIZ'`);
        await queryRunner.query(`ALTER TABLE "reloads" ADD CONSTRAINT "FK_687dd2ec7687525f6285e33483d" FOREIGN KEY ("almaceneroId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reloads" DROP CONSTRAINT "FK_687dd2ec7687525f6285e33483d"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "sale_point" SET DEFAULT 'CASA MATRIZ'`);
        await queryRunner.query(`ALTER TABLE "reloads" DROP COLUMN "almaceneroId"`);
    }

}
