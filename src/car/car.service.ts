import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Car, CarImageEntity } from './entities';
import { isUUID } from 'class-validator';

@Injectable()
export class CarService {
  private readonly logger = new Logger('CarService');

  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(CarImageEntity)
    private readonly carImageRepository: Repository<CarImageEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const cars = await this.carRepository.find({
      take: limit,
      skip: offset,
      relations: {
        carImages: true,
      },
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
      const queryBuilder = this.carRepository.createQueryBuilder('c');
      car = await queryBuilder
        .where('model = :model', {
          model: term.toLowerCase().replace(' ', '_').replace("'", ''),
        })
        .leftJoinAndSelect('c.carImages', 'cImages')
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

    const exist = await this.findOne(model);

    if (exist) {
      this.logger.error(`Car with ${model} already exists`);
      throw new HttpException(`Car with ${model} already exists`, 409);
    }

    const { carImages = [], ...productDetails } = createCarDto;

    const car = await this.carRepository.create({
      ...productDetails,
      carImages: carImages.map((image) =>
        this.carImageRepository.create({ url: image }),
      ),
    });
    await this.carRepository.save(car);
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const { carImages, ...productDetails } = updateCarDto;

    const new_car = await this.carRepository.preload({
      id,
      ...productDetails,
    });

    if (!new_car) {
      this.logger.error(`Car with ${id} not found`);
      throw new HttpException('Not found', 404);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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
