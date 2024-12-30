import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1735583167205 implements MigrationInterface {
    name = 'Auto1735583167205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles_favorites_articles" ("articlesId_1" integer NOT NULL, "articlesId_2" integer NOT NULL, CONSTRAINT "PK_5539d595491fa2bf70349e67a0d" PRIMARY KEY ("articlesId_1", "articlesId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bb9e2aa715b7ca0fa755fbb4ba" ON "articles_favorites_articles" ("articlesId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_47e279f74f3788220f97cba6a5" ON "articles_favorites_articles" ("articlesId_2") `);
        await queryRunner.query(`ALTER TABLE "articles_favorites_articles" ADD CONSTRAINT "FK_bb9e2aa715b7ca0fa755fbb4baa" FOREIGN KEY ("articlesId_1") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "articles_favorites_articles" ADD CONSTRAINT "FK_47e279f74f3788220f97cba6a50" FOREIGN KEY ("articlesId_2") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles_favorites_articles" DROP CONSTRAINT "FK_47e279f74f3788220f97cba6a50"`);
        await queryRunner.query(`ALTER TABLE "articles_favorites_articles" DROP CONSTRAINT "FK_bb9e2aa715b7ca0fa755fbb4baa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47e279f74f3788220f97cba6a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb9e2aa715b7ca0fa755fbb4ba"`);
        await queryRunner.query(`DROP TABLE "articles_favorites_articles"`);
    }

}
