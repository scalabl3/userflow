/**
 * Advanced test helpers for managing NestJS test environments.
 * Provides utilities for module setup, authentication, and context management.
 * 
 * Core Features:
 * - Test module creation and cleanup
 * - Test user management
 * - Authentication handling
 * - Context management
 * 
 * Usage:
 * - E2E Tests: Full application testing
 * - Integration Tests: Module testing
 * - API Tests: Endpoint testing with authentication
 */

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { User } from '../../models/User';
import { user as userMock } from '../../models/test/__mocks__/user.mock';
const request = require('supertest');

/**
 * Test context interface for managing test state.
 * Provides access to application, module, and request agent.
 * 
 * @property app - NestJS application instance
 * @property module - TestingModule instance
 * @property agent - Supertest request agent
 */
export interface TestContext {
  app: INestApplication;
  module: TestingModule;
  agent: ReturnType<typeof request>;
}

/**
 * Create a new testing module with full application setup.
 * Initializes NestJS application with all required modules.
 * 
 * @returns TestContext containing app, module, and agent
 * @throws {Error} If module compilation or initialization fails
 */
export async function createTestingModule(): Promise<TestContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return {
    app,
    module: moduleFixture,
    agent: request(app.getHttpServer()),
  };
}

/**
 * Clean up test module and application.
 * Should be called after tests to properly close connections.
 * 
 * @param ctx - Test context to clean up
 */
export async function cleanupTestModule(ctx: TestContext) {
  await ctx.app.close();
}

/**
 * Create a test user with custom properties.
 * Uses standard user mock as base with optional overrides.
 * 
 * @param ctx - Test context
 * @param userData - Optional user property overrides
 * @returns Created user instance
 * @remarks This is a placeholder until database service is ready
 */
export async function createTestUser(ctx: TestContext, userData: Partial<User> = {}): Promise<User> {
  // TODO: Implement once database service is ready
  const testUser = {
    ...userMock.standard,
    ...userData,
  };
  return testUser as User;
}

/**
 * Authenticate a test user and get access token.
 * Performs login request with user credentials.
 * 
 * @param ctx - Test context
 * @param user - User to authenticate
 * @returns Authentication token
 * @throws {UnauthorizedException} If authentication fails
 */
export async function authenticateTestUser(ctx: TestContext, user: User): Promise<string> {
  const response = await ctx.agent
    .post('/auth/login')
    .send({
      username: user.username,
      password: 'password123', // Use your standard test password
    });
  
  return response.body.token;
}

/**
 * Create an authenticated test context.
 * Sets up complete test environment with authenticated user.
 * 
 * @param userData - Optional user property overrides
 * @returns Function that creates authenticated context
 * 
 * @example
 * ```typescript
 * const setup = createAuthenticatedContext({ role: 'admin' });
 * const ctx = await setup();
 * // Use ctx.agent for authenticated requests
 * ```
 */
export function createAuthenticatedContext(userData: Partial<User> = {}) {
  return async (): Promise<TestContext & { user: User }> => {
    const ctx = await createTestingModule();
    const user = await createTestUser(ctx, userData);
    const token = await authenticateTestUser(ctx, user);
    
    // Create a new agent with the token
    const authenticatedAgent = request(ctx.app.getHttpServer());
    authenticatedAgent.set('Authorization', `Bearer ${token}`);
    
    return { 
      ...ctx,
      agent: authenticatedAgent,
      user 
    };
  };
} 
