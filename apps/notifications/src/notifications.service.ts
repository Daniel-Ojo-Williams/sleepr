import { Injectable } from '@nestjs/common';
import { EmailService } from './channels/email/service';
import { ReservationCreatedMailDto } from '@app/common';

@Injectable()
export class NotificationsService {
  constructor(private readonly emailService: EmailService) {}

  async sendReservationCreatedMail(payload: ReservationCreatedMailDto) {
    await this.emailService
      .sendReservationCreatedMail(payload)
      .catch((err) => console.log(err)); // TODO: Add logger here
  }
}
