import {
  Controller,
  Post,
  Req,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreatePaymentDto } from '@app/common';
import { IFlutterwaveWebhookPayload } from './interfaces/flutterwave.interface';
import { Request } from 'express';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_payment')
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) =>
        new RpcException(
          errors
            .map((e) => e.constraints && Object.values(e.constraints))
            .flat(),
        ),
    }),
  )
  createPayment(@Payload() data: CreatePaymentDto) {
    return this.paymentsService.createPayment(data);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() data: IFlutterwaveWebhookPayload, @Req() req: Request) {
    await this.paymentsService.handleWebhook(data, req.headers);
    return { message: 'Webhook received' };
  }
}
