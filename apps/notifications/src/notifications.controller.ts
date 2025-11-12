import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload, RpcException } from '@nestjs/microservices';
import { ReservationCreatedMailDto } from '@app/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('notifications.reservation.created')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) =>
        new RpcException(
          errors
            .map((e) => e.constraints && Object.values(e.constraints))
            .flat(),
        ),
    }),
  )
  async handleReservationCreated(
    @Payload() payload: ReservationCreatedMailDto,
  ) {
    await this.notificationsService.sendReservationCreatedMail(payload);
  }
}
