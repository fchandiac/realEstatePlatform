import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationEntityUpdate20251123 implements MigrationInterface {
  name = 'NotificationEntityUpdate20251123'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE notifications 
      ADD COLUMN senderType varchar(32) NOT NULL DEFAULT 'SYSTEM',
      ADD COLUMN senderId varchar(64) NULL,
      ADD COLUMN senderName varchar(128) NOT NULL DEFAULT '',
      ADD COLUMN isSystem boolean NOT NULL DEFAULT false,
      ADD COLUMN message text NOT NULL DEFAULT '',
      ADD COLUMN firstViewerId varchar(64) NULL,
      ADD COLUMN firstViewedAt datetime NULL
    `);
    await queryRunner.query(`UPDATE notifications SET senderType='SYSTEM', senderName='Sistema', isSystem=true, message='Notificación migrada' WHERE senderType IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE notifications 
      DROP COLUMN senderType,
      DROP COLUMN senderId,
      DROP COLUMN senderName,
      DROP COLUMN isSystem,
      DROP COLUMN message,
      DROP COLUMN firstViewerId,
      DROP COLUMN firstViewedAt
    `);
  }
}
