import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { EmailComponent, EmailPayload, TemplateName } from './interfaces';
import { render } from '@react-email/components';
import { EMAIL_QUEUE } from '../../constants';

@Processor(EMAIL_QUEUE)
export class EmailQueueProcessor extends WorkerHost {
  private readonly mailer: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    super();
    this.mailer = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async process(job: Job<EmailPayload>) {
    console.log('Processing email', job.id);
    const component = await this.getTemplate(job.data.template);
    const html = await render(component(job.data.options));
    await this.sendMail({
      toEmail: job.data.toEmail,
      toName: job.data.toName,
      subject: job.data.subject,
      body: html,
      fromEmail: job.data.fromEmail,
      fromName: job.data.fromName,
    });
  }

  private async sendMail(data: {
    toEmail: string;
    toName?: string;
    subject: string;
    body: string;
    fromEmail: string;
    fromName?: string;
  }) {
    await this.mailer.sendMail({
      from: `${data.fromName} <${data.fromEmail}>`,
      to: data.toName ? `${data.toName} <${data.toEmail}>` : data.toEmail,
      subject: data.subject,
      html: data.body,
    });
  }

  private getTemplate<T extends TemplateName>(template: T) {
    const templates: Record<TemplateName, () => Promise<EmailComponent<T>>> = {
      ReservationCreated: () =>
        import('./templates/reservation-created').then((m) => m.default),
    };
    return templates[template]();
  }
}
