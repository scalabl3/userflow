import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { User } from '../../models/User';
import { user as userMock } from '../../models/test/__mocks__/user.mock';
const request = require('supertest');

export interface TestContext {
  app: INestApplication;
  module: TestingModule;
  agent: ReturnType<typeof request>;
}

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

export async function cleanupTestModule(ctx: TestContext) {
  await ctx.app.close();
}

export async function createTestUser(ctx: TestContext, userData: Partial<User> = {}): Promise<User> {
  // TODO: Implement once database service is ready
  const testUser = {
    ...userMock.standard,
    ...userData,
  };
  return testUser as User;
}

export async function authenticateTestUser(ctx: TestContext, user: User): Promise<string> {
  const response = await ctx.agent
    .post('/auth/login')
    .send({
      username: user.username,
      password: 'password123', // Use your standard test password
    });
  
  return response.body.token;
}

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
