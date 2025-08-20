import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Product } from './src/database/entities/product.entity';
import { Cart } from './src/database/entities/cart.entity';
import { CartItem } from './src/database/entities/cart-item.entity';
import { Promotion } from './src/database/entities/promotion.entity';

export default new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || ''),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [Product, Cart, CartItem, Promotion],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
