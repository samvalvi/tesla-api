import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Car } from './car.entity';

@Entity()
export class CarImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  url: string;

  @ManyToOne(() => Car, (car) => car.carImages)
  car: Car;
}
