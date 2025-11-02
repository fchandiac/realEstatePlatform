import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSliderToSlide1699000000000 implements MigrationInterface {
  name = 'RenameSliderToSlide1699000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Renombrar tabla de sliders a slides
    await queryRunner.query(`ALTER TABLE \`sliders\` RENAME TO \`slides\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: renombrar tabla de slides a sliders
    await queryRunner.query(`ALTER TABLE \`slides\` RENAME TO \`sliders\``);
  }
}