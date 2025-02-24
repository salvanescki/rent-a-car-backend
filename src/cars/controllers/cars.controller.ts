import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from '../services/cars.service';
import { CreateCarDto } from '../dto/create-car.dto';
import { UpdateCarDto } from '../dto/update-car.dto';
import { Car } from '../entities/car.entity';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Post()
  createCar(@Body() car: CreateCarDto): Promise<Car> {
    return this.carsService.createCar(car);
  }

  @Get()
  getCars(): Promise<Car[]> {
    return this.carsService.getCars();
  }

  @Get(':id')
  getCarById(@Param('id') id: string): Promise<Car> {
    return this.carsService.getCarById(id);
  }

  @Delete(':id')
  deleteCar(@Param('id') id: string): Promise<any> {
    return this.carsService.deleteCar(id);
  }

  @Patch(':id')
  updateCar(@Param('id') id: string, @Body() car: UpdateCarDto): Promise<any> {
    return this.carsService.updateCar(id, car);
  }
}
