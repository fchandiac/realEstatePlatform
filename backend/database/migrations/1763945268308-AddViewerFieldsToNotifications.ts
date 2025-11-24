import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViewerFieldsToNotifications1763945268308 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE notifications
            ADD COLUMN firstViewerId VARCHAR(36) NULL,
            ADD COLUMN firstViewedAt DATETIME NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE notifications
            DROP COLUMN firstViewerId,
            DROP COLUMN firstViewedAt
        `);
    }

}
