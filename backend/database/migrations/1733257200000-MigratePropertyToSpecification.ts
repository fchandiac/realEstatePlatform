import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class MigratePropertyToSpecification1733257200000 implements MigrationInterface {
  name = 'MigratePropertyToSpecification1733257200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, add the new UUID column
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'new_id',
      type: 'varchar',
      length: '36',
      isNullable: true,
    }));

    // Generate UUIDs for existing records
    await queryRunner.query(`
      UPDATE properties 
      SET new_id = UUID() 
      WHERE new_id IS NULL
    `);

    // Add new columns for pricing
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'rentPriceCLP',
      type: 'bigint',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'rentPriceUF',
      type: 'decimal',
      precision: 10,
      scale: 2,
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'expenses',
      type: 'bigint',
      isNullable: true,
    }));

    // Add SEO columns
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'seoKeywords',
      type: 'text',
      isNullable: true,
    }));

    // Add publication columns
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'isFeatured',
      type: 'boolean',
      default: false,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'priority',
      type: 'int',
      default: 0,
    }));

    // Add physical characteristics
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'propertyType',
      type: 'varchar',
      length: '255',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'floors',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'constructionYear',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'amenities',
      type: 'text',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'nearbyServices',
      type: 'text',
      isNullable: true,
    }));

    // Add location columns
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'address',
      type: 'varchar',
      length: '255',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'city',
      type: 'varchar',
      length: '255',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'neighborhood',
      type: 'varchar',
      length: '255',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'zipCode',
      type: 'varchar',
      length: '20',
      isNullable: true,
    }));

    // Add statistics columns
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'viewCount',
      type: 'int',
      default: 0,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'favoriteCount',
      type: 'int',
      default: 0,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'contactCount',
      type: 'int',
      default: 0,
    }));

    // Add internal notes
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'internalNotes',
      type: 'text',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'rejectionReason',
      type: 'text',
      isNullable: true,
    }));

    // Add timestamp columns
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'publishedAt',
      type: 'datetime',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'lastModifiedAt',
      type: 'datetime',
      isNullable: true,
    }));

    // Update existing columns data types
    await queryRunner.changeColumn('properties', 'priceCLP', new TableColumn({
      name: 'priceCLP',
      type: 'bigint',
      default: 0,
    }));

    await queryRunner.changeColumn('properties', 'priceUF', new TableColumn({
      name: 'priceUF',
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
    }));

    await queryRunner.changeColumn('properties', 'builtSquareMeters', new TableColumn({
      name: 'builtSquareMeters',
      type: 'decimal',
      precision: 8,
      scale: 2,
      isNullable: true,
    }));

    await queryRunner.changeColumn('properties', 'landSquareMeters', new TableColumn({
      name: 'landSquareMeters',
      type: 'decimal',
      precision: 8,
      scale: 2,
      isNullable: true,
    }));

    await queryRunner.changeColumn('properties', 'latitude', new TableColumn({
      name: 'latitude',
      type: 'decimal',
      precision: 10,
      scale: 8,
      isNullable: true,
    }));

    await queryRunner.changeColumn('properties', 'longitude', new TableColumn({
      name: 'longitude',
      type: 'decimal',
      precision: 11,
      scale: 8,
      isNullable: true,
    }));

    await queryRunner.changeColumn('properties', 'publicationDate', new TableColumn({
      name: 'publicationDate',
      type: 'datetime',
      isNullable: true,
    }));

    // Update ENUM values for PropertyOperationType
    await queryRunner.query(`
      ALTER TABLE properties 
      MODIFY COLUMN operationType ENUM('SALE', 'RENT', 'SALE_AND_RENT') NOT NULL
    `);

    // Update foreign key columns to varchar for UUID compatibility
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'creatorUserId_new',
      type: 'varchar',
      length: '36',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'assignedAgentId_new', 
      type: 'varchar',
      length: '36',
      isNullable: true,
    }));

    // Create indexes for performance
    await queryRunner.createIndex('properties', new TableIndex({
      name: 'IDX_PROPERTY_STATUS',
      columnNames: ['status'],
    }));

    await queryRunner.createIndex('properties', new TableIndex({
      name: 'IDX_PROPERTY_OPERATION_TYPE',
      columnNames: ['operationType'],
    }));

    await queryRunner.createIndex('properties', new TableIndex({
      name: 'IDX_PROPERTY_FEATURED',
      columnNames: ['isFeatured'],
    }));

    await queryRunner.createIndex('properties', new TableIndex({
      name: 'IDX_PROPERTY_PRIORITY',
      columnNames: ['priority'],
    }));

    await queryRunner.createIndex('properties', new TableIndex({
      name: 'IDX_PROPERTY_PUBLICATION_DATE',
      columnNames: ['publicationDate'],
    }));

    await queryRunner.createIndex('properties', new TableIndex({
      name: 'IDX_PROPERTY_PRICE_CLP',
      columnNames: ['priceCLP'],
    }));

    await queryRunner.createIndex('properties', new TableIndex({
      name: 'IDX_PROPERTY_CITY',
      columnNames: ['city'],
    }));

    console.log('Property table migrated to new specification successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes
    await queryRunner.dropIndex('properties', 'IDX_PROPERTY_CITY');
    await queryRunner.dropIndex('properties', 'IDX_PROPERTY_PRICE_CLP');
    await queryRunner.dropIndex('properties', 'IDX_PROPERTY_PUBLICATION_DATE');
    await queryRunner.dropIndex('properties', 'IDX_PROPERTY_PRIORITY');
    await queryRunner.dropIndex('properties', 'IDX_PROPERTY_FEATURED');
    await queryRunner.dropIndex('properties', 'IDX_PROPERTY_OPERATION_TYPE');
    await queryRunner.dropIndex('properties', 'IDX_PROPERTY_STATUS');

    // Remove new foreign key columns
    await queryRunner.dropColumn('properties', 'assignedAgentId_new');
    await queryRunner.dropColumn('properties', 'creatorUserId_new');

    // Revert ENUM changes
    await queryRunner.query(`
      ALTER TABLE properties 
      MODIFY COLUMN operationType ENUM('SALE', 'RENT') NOT NULL
    `);

    // Remove all new columns
    const columnsToRemove = [
      'lastModifiedAt',
      'publishedAt',
      'rejectionReason',
      'internalNotes',
      'contactCount',
      'favoriteCount',
      'viewCount',
      'zipCode',
      'neighborhood',
      'city',
      'address',
      'nearbyServices',
      'amenities',
      'constructionYear',
      'floors',
      'propertyType',
      'priority',
      'isFeatured',
      'seoKeywords',
      'expenses',
      'rentPriceUF',
      'rentPriceCLP',
      'new_id',
    ];

    for (const column of columnsToRemove) {
      await queryRunner.dropColumn('properties', column);
    }

    console.log('Property table migration rolled back successfully');
  }
}