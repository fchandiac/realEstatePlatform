import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlLogoToIdentity1733257300000 implements MigrationInterface {
    name = 'AddUrlLogoToIdentity1733257300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`identities\` ADD \`urlLogo\` varchar(500) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`identities\` DROP COLUMN \`urlLogo\``);
    }

}