import { HttpService } from '@app/common';
import { CreatePaymentDto } from '@app/common/dto/payment.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FlutterwaveCreatePaymentDto,
  FlutterwaveCreatePaymentResponse,
  FLWQueryTransactionFeesResponse,
} from './interfaces/flutterwave.interface';
import * as crypto from 'node:crypto';

@Injectable()
export class PaymentsService {
  private readonly baseUrl = 'https://api.flutterwave.com/v3';
  private readonly headers: Record<string, string>;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.headers = {
      Authorization: `Bearer ${this.configService.get<string>('FLUTTERWAVE_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
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
}
