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
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { CreateDocumentDto } from '../src/documents/dto/create-document.dto';

describe('Documents', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let user: UserResponseDto;
  let document: DocumentResponseDto;
  let today: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Document, User],
          synchronize: true,
        }),
        DocumentsModule,
        UsersModule,
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

    const userCreateResponse = await request(app.getHttpServer())
      .post('/users')
      .send(exampleUserData)
      .expect(201);

    user = userCreateResponse.body as UserResponseDto;

    exampleDocumentData.authorId = user.id;
    const response = await request(app.getHttpServer())
      .post('/documents')
      .send(exampleDocumentData)
      .expect(201);

    document = response.body as DocumentResponseDto;
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

  const exampleDocumentData = {
    url: 'https://www.example.com',
    src: 'https://www.example.com',
    description: 'This is an example document',
    title: 'Example document',
    authorId: '',
  };

  interface DocumentResponseDto extends CreateDocumentDto {
    id: string;
    author: User;
    createdAt: string;
    updatedAt: string;
  }

  const getToday = () => {
    return new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ');
  };

  it('should create a document with valid data for a valid user', () => {
    return request(app.getHttpServer())
      .post('/documents')
      .send({
        url: 'https://www.example2.com',
        src: 'https://www.example2.com',
        description: 'This is an example document 2',
        title: 'Example document 2',
        authorId: user.id,
      })
      .expect(201);
  });

  it('should return 404 creating document with valid data for an invalid user', () => {
    exampleDocumentData.authorId = randomUUID();
    return request(app.getHttpServer())
      .post('/documents')
      .send(exampleDocumentData)
      .expect(404);
  });

  it('should list documents', () => {
    return request(app.getHttpServer())
      .get('/documents')
      .expect(200)
      .expect([
        {
          id: document.id,
          ...exampleDocumentData,
          author: user,
          createdAt: today,
          updatedAt: today,
        },
      ]);
  });

  it('should get document by authorId and id', async () => {
    return request(app.getHttpServer())
      .get(`/documents/${user.id}/${document.id}`)
      .expect(200)
      .expect({
        id: document.id,
        ...exampleDocumentData,
        createdAt: today,
        updatedAt: today,
      });
  });

  it('should return error 404 when trying to get a valid document with invalid user id', () => {
    return request(app.getHttpServer())
      .get(`/documents/${randomUUID()}/${document.id}`)
      .expect(404);
  });

  it('should return error 404 when trying to get an invalid document with valid user id', () => {
    return request(app.getHttpServer())
      .get(`/documents/${user.id}/${randomUUID()}`)
      .expect(404);
  });

  it('should return error 404 when trying to get an invalid document with invalid user id', () => {
    return request(app.getHttpServer())
      .get(`/documents/${randomUUID()}/${randomUUID()}`)
      .expect(404);
  });

  it('should delete document using ids', async () => {
    return request(app.getHttpServer())
      .delete(`/documents/${user.id}/${document.id}`)
      .expect(200)
      .expect({
        raw: [],
        affected: 1,
      });
  });

  it('should return error 404 when trying to delete valid document of an invalid user', () => {
    return request(app.getHttpServer())
      .delete(`/documents/${randomUUID()}/${document.id}`)
      .expect(404);
  });

  it('should return error 404 when trying to delete invalid document of a valid user', () => {
    return request(app.getHttpServer())
      .delete(`/documents/${user.id}/${randomUUID()}`)
      .expect(404);
  });

  it('should return error 404 when trying to delete invalid document of an invalid user', () => {
    return request(app.getHttpServer())
      .delete(`/documents/${randomUUID()}/${randomUUID()}`)
      .expect(404);
  });

  it('should update document using valid ids', () => {
    return request(app.getHttpServer())
      .patch(`/documents/${user.id}/${document.id}`)
      .send({
        title: 'Updated title',
      })
      .expect(200)
      .expect({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });
  });

  it('should return error 404 when trying to update a valid document of an invalid user', () => {
    return request(app.getHttpServer())
      .patch(`/documents/${randomUUID()}/${document.id}`)
      .send({
        title: 'Updated title',
      })
      .expect(404);
  });

  it('should return error 404 when trying to update an invalid document of a valid user', () => {
    return request(app.getHttpServer())
      .patch(`/documents/${user.id}/${randomUUID()}`)
      .send({
        title: 'Updated title',
      })
      .expect(404);
  });

  it('should return error 404 when trying to update an invalid document of an invalid user', () => {
    return request(app.getHttpServer())
      .patch(`/documents/${randomUUID()}/${randomUUID()}`)
      .send({
        title: 'Updated title',
      })
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
