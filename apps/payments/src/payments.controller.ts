import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreatePaymentDto } from '@app/common';

@Controller()
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
}
