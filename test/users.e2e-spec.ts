import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entities/user.entity';
import { Document } from '../src/documents/entities/document.entity';
import { DataSource } from 'typeorm';
import { DocumentsModule } from '../src/documents/documents.module';
import { Role } from '../src/users/enums/role.enum';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('Users', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let user: UserResponseDto;
  let today: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Document],
          synchronize: true,
        }),
        UsersModule,
        DocumentsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    today = getToday();
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(exampleUserData)
      .expect(201);

    user = response.body as UserResponseDto;
  });

  const exampleUserData = {
    firstName: 'John',
    lastName: 'Doe',
    dob: '2024-04-13',
    email: 'johndoe@gmail.com',
    address: 'fake street 123',
    country: 'United States',
  };

  interface UserResponseDto extends CreateUserDto {
    id: string;
    role: number;
    createdAt: string;
    updatedAt: string;
  }

  const getToday = () => {
    return new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ');
  };

  it('should create a user with valid data', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'Emily',
        lastName: 'Smith',
        dob: '1990-12-05',
        email: 'emilysmith@example.com',
        address: '456 Elm Street',
        country: 'Canada',
      })
      .expect(201);
  });

  it('should return error 409 if client tries to create the same user twice', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(exampleUserData)
      .expect(409);
  });

  it('should list users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([
        {
          id: user.id,
          ...exampleUserData,
          role: Role.client,
          createdAt: today,
          updatedAt: today,
        },
      ]);
  });

  it('should get user by id', () => {
    return request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .expect(200)
      .expect({
        id: user.id,
        ...exampleUserData,
        role: Role.client,
        createdAt: today,
        updatedAt: today,
        documents: [],
      });
  });

  it('should return error 404 when trying to get unregistered user by id', () => {
    return request(app.getHttpServer())
      .get(`/users/${randomUUID()}`)
      .expect(404);
  });

  it('should delete user by id', () => {
    return request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .expect(200)
      .expect({
        raw: [],
        affected: 1,
      });
  });

  it('should return error 404 when trying to delete unregistered user by id', () => {
    return request(app.getHttpServer())
      .delete(`/users/${randomUUID()}`)
      .expect(404);
  });

  it('should update user by id', () => {
    return request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .send({
        country: 'Australia',
      })
      .expect(200)
      .expect({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });
  });

  it('should return error 404 when trying to update unregistered user by id', () => {
    return request(app.getHttpServer())
      .patch(`/users/${randomUUID()}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
