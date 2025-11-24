import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInterestedUserFieldsToNotifications1763943454703 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE notifications
            ADD COLUMN interestedUserEmail VARCHAR(255) NULL,
            ADD COLUMN interestedUserName VARCHAR(255) NULL,
            ADD COLUMN interestedUserMessage TEXT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE notifications
            DROP COLUMN interestedUserEmail,
            DROP COLUMN interestedUserName,
            DROP COLUMN interestedUserMessage
        `);
    }

}
