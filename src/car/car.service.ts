import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Car } from './entities/car.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class CarService {
  private readonly logger = new Logger('CarService');

  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const cars = await this.carRepository.find({
      take: limit,
      skip: offset,
      //active: true,
    });

    if (!cars) {
      this.logger.error(`Cars not found`);
      throw new HttpException('No Content', 204);
    }

    return cars;
  }

  async findOne(term: string) {
    let car: Car;

    if (isUUID(term)) {
      car = await this.carRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.carRepository.createQueryBuilder();
      car = await queryBuilder
        .where('model = :model', { model: term.toLowerCase() })
        .getOne();
    }

    if (!car) {
      this.logger.error(`Car with ${term} not found`);
      throw new HttpException('Not found', 404);
    }

    return car;
  }

  async create(createCarDto: CreateCarDto) {
    const { model } = createCarDto;
    const result = await this.findOne(model);

    if (result) {
      this.logger.error(`Car with ${model} already exists`);
      throw new HttpException(`Car with ${model} already exists`, 409);
    }

    const car = this.carRepository.create(createCarDto);
    await this.carRepository.save(car);
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const result = await this.findOne(id);

    if (!result) {
      this.logger.error(`Car with ${id} not found`);
      throw new HttpException('Not found', 404);
    }

    const new_car = await this.carRepository.preload({ id, ...updateCarDto });
    await this.carRepository.save(new_car);
    return new_car;
  }

  async remove(id: string) {
    const result = await this.findOne(id);

    if (!result) {
      this.logger.error(`Car with ${id} not found`);
      throw new HttpException('Not found', 404);
    }

    return await this.carRepository.remove(result);
  }
}
