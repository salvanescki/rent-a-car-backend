import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from '../src/cars/cars.module';
import { Car } from '../src/cars/entities/car.entity';
import { Picture } from '../src/pictures/entities/picture.entity';
import { DataSource } from 'typeorm';
import { PicturesModule } from '../src/pictures/pictures.module';
import { randomUUID } from 'node:crypto';
import { CreateCarDto } from '../src/cars/dto/create-car.dto';

describe('Cars', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let car: CarResponseDto;
  let today: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Car, Picture],
          synchronize: true,
        }),
        CarsModule,
        PicturesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    const response = await request(app.getHttpServer())
      .post('/cars')
      .send(exampleCarData)
      .expect(201);

    car = response.body as CarResponseDto;

    today = getToday();
  });

  const exampleCarData = {
    brand: 'toyota',
    model: 'corolla',
    color: 'red',
    passengers: 4,
    ac: true,
    pricePerDay: 50,
  };

  interface CarResponseDto extends CreateCarDto {
    id: string;
    createdAt: string;
    updatedAt: string;
  }

  const getToday = () => {
    return new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ');
  };

  it('should create a car with valid data', () => {
    return request(app.getHttpServer())
      .post('/cars')
      .send({
        brand: 'ford',
        model: 'focus',
        color: 'blue',
        passengers: 5,
        ac: true,
        pricePerDay: 60,
      })
      .expect(201);
  });

  it('should list cars', () => {
    return request(app.getHttpServer())
      .get('/cars')
      .expect(200)
      .expect([
        {
          id: car.id,
          ...exampleCarData,
          createdAt: today,
          updatedAt: today,
        },
      ]);
  });

  it('should get car by id', () => {
    return request(app.getHttpServer())
      .get(`/cars/${car.id}`)
      .expect(200)
      .expect({
        id: car.id,
        ...exampleCarData,
        createdAt: today,
        updatedAt: today,
      });
  });

  it('should return error 404 when trying to get unknown car by id', () => {
    return request(app.getHttpServer())
      .get(`/cars/${randomUUID()}`)
      .expect(404);
  });

  it('should delete car by id', () => {
    return request(app.getHttpServer())
      .delete(`/cars/${car.id}`)
      .expect(200)
      .expect({
        raw: [],
        affected: 1,
      });
  });

  it('should return error 404 when trying to delete unknown car by id', () => {
    return request(app.getHttpServer())
      .delete(`/cars/${randomUUID()}`)
      .expect(404);
  });

  it('should update car by id', () => {
    return request(app.getHttpServer())
      .patch(`/cars/${car.id}`)
      .send({
        model: 'hilux',
      })
      .expect(200)
      .expect({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });
  });

  it('should return error 404 when trying to update unknown car by id', () => {
    return request(app.getHttpServer())
      .patch(`/cars/${randomUUID()}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
