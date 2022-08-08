import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarService } from './car.service';
import { CarController } from './car.controller';
import { Car, CarImageEntity } from './entities';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Car, CarImageEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
