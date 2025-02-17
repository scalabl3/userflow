/**
 * Core test helper utilities for setting up and managing test environments.
 * Provides standardized methods for database management, authentication, and test setup.
 * 
 * Core Features:
 * - Database initialization and cleanup
 * - User authentication
 * - Test data setup
 * - Repository mocking
 * 
 * Usage:
 * - Integration Tests: Database and authentication setup
 * - Unit Tests: Repository mocking
 * - E2E Tests: Full application testing
 */

import { INestApplication } from '@nestjs/common';
import { auth } from '../../models/test/__mocks__';
import { TestDataFactory } from '../../models/test/factories/test-data.factory';
import request from 'supertest';

export class TestHelper {
  /**
   * Initialize test database with required schema and initial data.
   * Should be called before running tests that require database access.
   * 
   * @remarks
   * This is a placeholder that will be implemented when database setup is complete.
   */
  static async initDb() {
    // Initialize test database
    // This will be implemented when we set up the test database
  }

  /**
   * Clear all test data from the database.
   * Should be called after tests to ensure a clean state.
   * 
   * @remarks
   * This is a placeholder that will be implemented when database setup is complete.
   */
  static async clearDb() {
    // Clear test data
    // This will be implemented when we set up the test database
  }

  /**
   * Authenticate a user and get an access token.
   * Uses the standard test credentials from auth mocks.
   * 
   * @param app - NestJS application instance
   * @returns Access token for authenticated user
   * @throws {UnauthorizedException} If authentication fails
   */
  static async loginUser(app: INestApplication) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(auth.requests.login.email)
      .expect(200);
    return response.body.accessToken;
  }

  /**
   * Set up a complete test user environment.
   * Creates both base user and standard user with proper relationships.
   * 
   * @param app - NestJS application instance
   * @returns Object containing user instance and authentication token
   * @throws {UnauthorizedException} If user setup or authentication fails
   */
  static async setupTestUser(app: INestApplication) {
    const { user } = await TestDataFactory.createFullUserSetup();
    const token = await this.loginUser(app);
    return { user, token };
  }

  /**
   * Create a mock repository with Jest mock functions.
   * Provides standard repository methods as Jest mocks.
   * 
   * @template T - Entity type for the repository
   * @returns Mock repository with common methods
   * 
   * @example
   * ```typescript
   * const mockUserRepo = TestHelper.createMockRepository<User>();
   * mockUserRepo.findOne.mockResolvedValue(testUser);
   * ```
   */
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