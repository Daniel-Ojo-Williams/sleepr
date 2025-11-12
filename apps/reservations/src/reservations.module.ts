import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
  AUTH_SECVICE,
  DatabaseModule,
  EVENT_BUS,
  PAYMENTS_SERVICE,
} from '@app/common';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { ReservationsRepository } from './reservations.repository';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        AUTH_TCP_HOST: Joi.string().required(),
        AUTH_TCP_PORT: Joi.number().required(),
        PAYMENTS_TCP_HOST: Joi.string().required(),
        PAYMENTS_TCP_PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature({
      name: ReservationDocument.name,
      schema: ReservationSchema,
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SECVICE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('AUTH_TCP_HOST'),
            port: config.get<number>('AUTH_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('PAYMENTS_TCP_HOST'),
            port: config.get<number>('PAYMENTS_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: EVENT_BUS,
        useFactory: (config: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: config.get<string>('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
