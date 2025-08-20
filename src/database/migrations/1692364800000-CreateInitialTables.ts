import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1692364800000 implements MigrationInterface {
  name = 'CreateInitialTables1692364800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE products (
        id int IDENTITY(1,1) NOT NULL,
        title nvarchar(255) NOT NULL,
        price decimal(10,2) NOT NULL,
        CONSTRAINT products_PK PRIMARY KEY (id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE carts (
        id int IDENTITY(1,1) NOT NULL,
        CONSTRAINT carts_PK PRIMARY KEY (id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE cart_items (
        id int IDENTITY(1,1) NOT NULL,
        cartId int NOT NULL,
        productId int NOT NULL,
        quantity int NOT NULL,
        unitPrice decimal(10,2) NOT NULL,
        totalPrice decimal(10,2) NOT NULL,
        CONSTRAINT cart_items_PK PRIMARY KEY (id)
      )
    `);

    await queryRunner.query(`
        CREATE TABLE promotions (
          id int IDENTITY(1,1) NOT NULL,
          name nvarchar(255) NOT NULL,
          type varchar(255) NOT NULL,
          productId int NULL,
          discountValue int NULL,
          minimumOrderValue int NULL,
          CONSTRAINT promotions_PK PRIMARY KEY (id)
        )
      `);

    await queryRunner.query(`
      ALTER TABLE promotions ADD CONSTRAINT products_FK_promotions 
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE cart_items ADD CONSTRAINT cart_items_cartId_FK 
      FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE cart_items ADD CONSTRAINT cart_items_productId_FK 
      FOREIGN KEY (productId) REFERENCES products(id)
    `);

    await queryRunner.query(`
      CREATE INDEX IX_cart_items_cartId ON cart_items (cartId)
    `);

    await queryRunner.query(`
      CREATE INDEX IX_cart_items_productId ON cart_items (productId)
    `);
    await queryRunner.query(`
      CREATE INDEX IX_promotions_type ON promotions (type)
    `);

    await queryRunner.query(`
      ALTER TABLE promotions ADD CONSTRAINT CK_promotions_type 
      CHECK (type IN ('BuyOneGetOne', 'PercentageDiscount'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE cart_items DROP CONSTRAINT cart_items_productId_FK`);
    await queryRunner.query(`ALTER TABLE cart_items DROP CONSTRAINT cart_items_cartId_FK`);

    await queryRunner.query(`DROP INDEX IX_promotions_type ON promotions`);
    await queryRunner.query(`DROP INDEX IX_promotions_active ON promotions`);
    await queryRunner.query(`DROP INDEX IX_cart_items_productId ON cart_items`);
    await queryRunner.query(`DROP INDEX IX_cart_items_cartId ON cart_items`);

    await queryRunner.query(`DROP TABLE promotions`);
    await queryRunner.query(`DROP TABLE cart_items`);
    await queryRunner.query(`DROP TABLE carts`);
    await queryRunner.query(`DROP TABLE products`);
  }
}
