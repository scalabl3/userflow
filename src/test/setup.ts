import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { DatabaseHelper } from './helpers/database.helper';

export class TestSetup {
  private static app: INestApplication;

  static async initializeTestEnvironment(): Promise<INestApplication> {
    // Initialize test database
    await DatabaseHelper.initializeTestDatabase();

    // Create test module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Create and initialize app
    this.app = moduleFixture.createNestApplication();
    await this.app.init();

    return this.app;
  }

  static async cleanupTestEnvironment() {
    // Clean database
    await DatabaseHelper.cleanDatabase();
  }

  static async teardownTestEnvironment() {
    // Close app and database connections
    if (this.app) {
      await this.app.close();
    }
    await DatabaseHelper.closeDatabase();
  }

  static getApp(): INestApplication {
    if (!this.app) {
      throw new Error('Test environment not initialized');
    }
    return this.app;
  }
}

// Jest lifecycle hooks
beforeAll(async () => {
  await TestSetup.initializeTestEnvironment();
});

afterEach(async () => {
  await TestSetup.cleanupTestEnvironment();
});

afterAll(async () => {
  await TestSetup.teardownTestEnvironment();
}); 