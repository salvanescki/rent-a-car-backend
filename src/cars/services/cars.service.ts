import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/car.entity';
import { CreateCarDto } from '../dto/create-car.dto';
import { UpdateCarDto } from '../dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  private async _findCarById(id: string): Promise<Car> {
    const carFound = await this.carsRepository.findOne({
      where: { id },
    });
    if (!carFound) {
      throw new NotFoundException('Car not found');
    }
    return carFound;
  }

  async createCar(car: CreateCarDto): Promise<Car> {
    const newCar = this.carsRepository.create(car);
    return this.carsRepository.save(newCar);
  }

  getCars(): Promise<Car[]> {
    return this.carsRepository.find();
  }

  async getCarById(id: string): Promise<Car> {
    return this._findCarById(id);
  }

  async deleteCar(id: string): Promise<any> {
    const result = await this.carsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Car not found');
    }
    return result;
  }

  async updateCar(id: string, car: UpdateCarDto): Promise<any> {
    await this._findCarById(id);
    return this.carsRepository.update({ id }, car);
  }
}
