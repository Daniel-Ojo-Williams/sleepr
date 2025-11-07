import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UtilsModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        FLUTTERWAVE_SECRET_KEY: Joi.string().required(),
        TCP_PORT: Joi.number().required(),
      }),
    }),
    UtilsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
