import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1692364900000 implements MigrationInterface {
  name = 'SeedInitialData1692364900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO products (title, price) VALUES
      (N'Plaktukas', 9.99),
      (N'Atsuktuvas', 4.99),
      (N'Grąžtas', 49.99),
      (N'Pjūklas', 24.99),
      (N'Replės', 7.99)
    `);

    await queryRunner.query(`
      INSERT INTO promotions (name, type, productId, discountValue, minimumOrderValue) VALUES
      (N'Perki vieną, antrą gauni nemokamai - Atsuktuvas', 'BuyOneGetOne', 2, NULL, NULL)
    `);

    await queryRunner.query(`
      INSERT INTO promotions (name, type, productId, discountValue, minimumOrderValue) VALUES
      (N'10% nuolaida užsakymams virš 75€', 'PercentageDiscount', NULL, 10, 75)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM promotions`);
    await queryRunner.query(`DELETE FROM products`);
  }
}
