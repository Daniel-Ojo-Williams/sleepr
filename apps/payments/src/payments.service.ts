import {
  EVENT_BUS,
  HttpService,
  PaymentResponse,
  PaymentSuccessEvent,
} from '@app/common';
import { CreatePaymentDto } from '@app/common/dto/payment.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FlutterwaveCreatePaymentDto,
  FlutterwaveCreatePaymentResponse,
  FLWQueryTransactionFeesResponse,
  IFlutterwaveWebhookPayload,
} from './interfaces/flutterwave.interface';
import * as crypto from 'node:crypto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private readonly baseUrl = 'https://api.flutterwave.com/v3';
  private readonly headers: Record<string, string>;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(EVENT_BUS) private readonly eventBus: ClientProxy,
  ) {
    this.headers = {
      Authorization: `Bearer ${this.configService.get<string>('FLUTTERWAVE_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  }

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    try {
      const tx_ref = crypto.randomUUID();

      const fees = await this.queryTransactionFees({
        amount: createPaymentDto.amount,
        currency: 'NGN',
      });

      const response = await this.httpService.post<
        FlutterwaveCreatePaymentDto,
        FlutterwaveCreatePaymentResponse
      >({
        url: `${this.baseUrl}/payments`,
        headers: this.headers,
        payload: {
          amount: createPaymentDto.amount + fees.flutterwave_fee,
          currency: 'NGN',
          customer: {
            email: createPaymentDto.email,
          },
          tx_ref,
          link_expiration: createPaymentDto.expiration,
          configuration: {
            session_duration: 1,
          },
          meta: createPaymentDto.meta,
          redirect_url: 'https://google.com',
          payment_options: 'card,bank transfer',
        },
      });
      return { reference: tx_ref, authorizationUrl: response.body.data.link };
    } catch (error) {
      console.dir(error, { depth: null });
      throw error;
    }
  }

  async queryTransactionFees(payload: { amount: number; currency: string }) {
    const response =
      await this.httpService.get<FLWQueryTransactionFeesResponse>({
        url: `${this.baseUrl}/transactions/fee`,
        headers: this.headers,
        query: payload,
      });

    return response.body.data;
  }

  async handleWebhook(
    payload: IFlutterwaveWebhookPayload,
    headers: Record<string, unknown>,
  ) {
    const flutterwaveSecretKey = this.configService.get<string>(
      'FLUTTERWAVE_SECRET_KEY',
    )!;
    const verifHash = headers['verif-hash'] as string;

    if (!verifHash || verifHash !== flutterwaveSecretKey) return;

    const transaction = await this.httpService.get<IFlutterwaveWebhookPayload>({
      url: `${this.baseUrl}/transactions/${payload.data.id}/verify`,
      headers: this.headers,
    });

    if (!transaction?.body?.data) return;

    if (transaction.body.data.status !== 'successful') return;

    this.eventBus.emit<string, PaymentSuccessEvent>('payment.success', {
      amount: payload.data.amount,
      reference: payload.data.tx_ref,
      type: payload.meta_data.item,
    });
  }
}
