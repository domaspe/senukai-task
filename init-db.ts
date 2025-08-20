import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || ''),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'master',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

async function createDatabaseIfNotExists() {
  const databaseName = process.env.DB_DATABASE;

  while (true) {
    try {
      await dataSource.initialize();
      break;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error('Waiting for database connection...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  try {
    const result = await dataSource.query(`SELECT database_id FROM sys.databases WHERE name = '${databaseName}'`);

    if (result.length === 0) {
      await dataSource.query(`CREATE DATABASE ${databaseName}`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

createDatabaseIfNotExists();
