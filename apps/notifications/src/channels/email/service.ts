import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EmailPayload } from './interfaces';
import { EMAIL_QUEUE } from '../../constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue(EMAIL_QUEUE) private readonly queue: Queue<EmailPayload>,
  ) {}
  async sendReservationCreatedMail(data: { toName: string; toEmail: string }) {
    await this.queue
      .add('reservation.created', {
        template: 'ReservationCreated',
        options: {
          name: data.toName,
        },
        fromEmail: 'no-reply@sleepr.com',
        toEmail: data.toEmail,
        subject: 'Your reservation has been confirmed!',
      })
      .catch((err) => console.log(err)); // TODO: Addd logger here
  }
}
