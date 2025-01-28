import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load test environment variables
config({ path: join(__dirname, '../.env.test') });

export class DatabaseHelper {
  private static dataSource: DataSource;

  static async initializeTestDatabase() {
    // Create a new DataSource instance for testing
    this.dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: ['src/**/*.entity.ts'],
      migrations: ['src/migrations/*.ts'],
      synchronize: false,
      logging: true
    });

    // Initialize the connection
    await this.dataSource.initialize();
    
    // Run migrations
    await this.dataSource.runMigrations();
  }

  static async cleanDatabase() {
    if (!this.dataSource) {
      throw new Error('Database connection not initialized');
    }

    // Drop all tables and rerun migrations
    await this.dataSource.dropDatabase();
    await this.dataSource.runMigrations();
  }

  static async closeDatabase() {
    if (this.dataSource) {
      await this.dataSource.destroy();
    }
  }

  static getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error('Database connection not initialized');
    }
    return this.dataSource;
  }
} 