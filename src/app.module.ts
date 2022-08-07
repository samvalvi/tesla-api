import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetEnv } from './config/env.config';
import { ValidationSchema } from './config/joi.validation';
import { CarModule } from './car/car.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [GetEnv],
      validationSchema: [ValidationSchema],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: GetEnv().postgres_host,
      port: parseInt(GetEnv().postgres_port),
      username: GetEnv().postgres_user,
      password: GetEnv().postgres_password,
      database: GetEnv().postgres_database,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
