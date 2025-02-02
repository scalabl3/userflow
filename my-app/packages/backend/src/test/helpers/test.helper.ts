import { INestApplication } from '@nestjs/common';
import { auth } from '../../models/test/__mocks__';
import { TestDataFactory } from '../../models/test/factories/test-data.factory';
import request from 'supertest';

export class TestHelper {
  // Database management
  static async initDb() {
    // Initialize test database
    // This will be implemented when we set up the test database
  }

  static async clearDb() {
    // Clear test data
    // This will be implemented when we set up the test database
  }

  // Authentication
  static async loginUser(app: INestApplication) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(auth.requests.login.email)
      .expect(200);
    return response.body.accessToken;
  }

  // Common test setups
  static async setupTestUser(app: INestApplication) {
    const { user } = await TestDataFactory.createFullUserSetup();
    const token = await this.loginUser(app);
    return { user, token };
  }

  // Repository mocks
  static createMockRepository<T>() {
    return {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
  }
} 