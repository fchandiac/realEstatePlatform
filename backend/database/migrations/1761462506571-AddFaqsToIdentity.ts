import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFaqsToIdentity1761462506571 implements MigrationInterface {
    name = 'AddFaqsToIdentity1761462506571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`identities\` ADD \`faqs\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`identities\` DROP COLUMN \`faqs\``);
    }

}
