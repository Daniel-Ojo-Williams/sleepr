export interface FlutterwaveCreatePaymentDto {
  amount: number;
  currency: string;
  customer: {
    email: string;
  };
  configuration?: {
    session_duration: number;
  };
  tx_ref: string;
  meta?: Record<string, string>;
  link_expiration?: Date;
  redirect_url: string;
  payment_options: string;
}

export interface FLWResponse<T> {
  status: string;
  message: string;
  data: T;
}

export type FlutterwaveCreatePaymentResponse = FLWResponse<{ link: string }>;

export interface FLWQueryTransactionFeesDto {
  amount: number;
  currency: string;
}

export type FLWQueryTransactionFeesResponse = FLWResponse<{
  charge_amount: number;
  fee: number;
  flutterwave_fee: number;
  stamp_duty_fee: number;
}>;
