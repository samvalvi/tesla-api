import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarService } from './car.service';
import { CarController } from './car.controller';
import { Car } from './entities/car.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Car])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
