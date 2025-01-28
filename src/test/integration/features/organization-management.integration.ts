import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../../setup';
import { DatabaseHelper } from '../../helpers/database.helper';
import { OrganizationFactory } from '../../factories/organization.factory';
import { UserFactory } from '../../factories/user.factory';
import { Organization } from '../../../models/Organization';

describe('Organization Management', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = TestSetup.getApp();
  });

  describe('Organization CRUD', () => {
    describe('POST /api/organizations', () => {
      it('should create a new organization', async () => {
        const newOrg = {
          name: 'Test Organization',
          visible: true
        };

        const response = await request(app.getHttpServer())
          .post('/api/organizations')
          .send(newOrg)
          .expect(201);

        expect(response.body).toMatchObject({
          name: newOrg.name,
          visible: newOrg.visible,
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        });

        // Verify in database
        const dataSource = DatabaseHelper.getDataSource();
        const orgRepo = dataSource.getRepository(Organization);
        const savedOrg = await orgRepo.findOne({ where: { id: response.body.id } });
        expect(savedOrg).toBeDefined();
        expect(savedOrg.name).toBe(newOrg.name);
      });

      it('should validate required fields', async () => {
        const invalidOrg = { visible: true };
        await request(app.getHttpServer())
          .post('/api/organizations')
          .send(invalidOrg)
          .expect(400);
      });
    });

    describe('GET /api/organizations/:id', () => {
      it('should return organization details', async () => {
        const org = await OrganizationFactory.create();
        const admin = await UserFactory.create(org);

        const response = await request(app.getHttpServer())
          .get(`/api/organizations/${org.id}`)
          .expect(200);

        expect(response.body).toMatchObject({
          id: org.id,
          name: org.name,
          visible: org.visible,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        });
      });

      it('should return 404 for non-existent organization', async () => {
        await request(app.getHttpServer())
          .get('/api/organizations/non-existent-id')
          .expect(404);
      });
    });

    describe('PATCH /api/organizations/:id', () => {
      it('should update organization details', async () => {
        const org = await OrganizationFactory.create();
        const updateData = {
          name: 'Updated Organization Name',
          visible: false
        };

        const response = await request(app.getHttpServer())
          .patch(`/api/organizations/${org.id}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toMatchObject({
          id: org.id,
          name: updateData.name,
          visible: updateData.visible,
          updatedAt: expect.any(String)
        });

        // Verify update in database
        const dataSource = DatabaseHelper.getDataSource();
        const orgRepo = dataSource.getRepository(Organization);
        const updatedOrg = await orgRepo.findOne({ where: { id: org.id } });
        expect(updatedOrg.name).toBe(updateData.name);
        expect(updatedOrg.visible).toBe(updateData.visible);
      });
    });

    describe('DELETE /api/organizations/:id', () => {
      it('should delete an organization', async () => {
        const org = await OrganizationFactory.create();

        await request(app.getHttpServer())
          .delete(`/api/organizations/${org.id}`)
          .expect(204);

        // Verify deletion in database
        const dataSource = DatabaseHelper.getDataSource();
        const orgRepo = dataSource.getRepository(Organization);
        const deletedOrg = await orgRepo.findOne({ where: { id: org.id } });
        expect(deletedOrg).toBeNull();
      });
    });

    describe('GET /api/organizations', () => {
      it('should list organizations with pagination', async () => {
        // Create multiple organizations
        await OrganizationFactory.createMany(5);

        const response = await request(app.getHttpServer())
          .get('/api/organizations')
          .query({ page: 1, limit: 3 })
          .expect(200);

        expect(response.body.items).toHaveLength(3);
        expect(response.body.meta).toMatchObject({
          page: 1,
          limit: 3,
          totalItems: 5,
          totalPages: 2
        });
      });

      it('should filter organizations by visibility', async () => {
        await OrganizationFactory.create({ visible: true });
        await OrganizationFactory.create({ visible: false });

        const response = await request(app.getHttpServer())
          .get('/api/organizations')
          .query({ visible: true })
          .expect(200);

        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].visible).toBe(true);
      });
    });
  });
}); 